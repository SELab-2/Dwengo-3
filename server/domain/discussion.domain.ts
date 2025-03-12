import { Discussion } from "@prisma/client";
import { DiscussionPersistence } from "../persistence/discussion.persistence";
import { queryWithPaginationParser } from "../util/pagination/queryWithPaginationParser.util";
import { DiscussionCreateSchema, DiscussionFilterSchema } from "../util/types/discussion.types";
import { UserEntity } from "../util/types/user.types";
import { checkIfUserIsInGroup, checkIfUsersAreInSameGroup } from "../util/coockie-checks/coockieChecks.util";
import { GroupPersistence } from "../persistence/group.persistence";

export class DiscussionDomain {
    private discussionPersistence: DiscussionPersistence;
    private groupPersistence: GroupPersistence;

    public constructor() {
        this.discussionPersistence = new DiscussionPersistence();
        this.groupPersistence = new GroupPersistence();
    }

    public async getDiscussions(query: any, user: UserEntity): Promise<{data: Discussion[], totalPages: number}> {
        const parseResult = queryWithPaginationParser(query, DiscussionFilterSchema);
        const filters = parseResult.dataSchema;
        filters.groupIds?.forEach((groupId) => checkIfUserIsInGroup(user, groupId, this.groupPersistence));
        const discussions = await this.discussionPersistence.getDiscussions(filters, parseResult.dataPagination);
        if (filters.id && discussions.data.length === 1) {
            checkIfUserIsInGroup(user, discussions.data[0].groupId, this.groupPersistence);
        }
        return discussions;
    }

    public async createDiscussion(query: any, user: UserEntity): Promise<Discussion> {
        const parseResult = DiscussionCreateSchema.safeParse(query);
        if (!parseResult.success) {
            throw parseResult.error;
        }
        const data = parseResult.data;
        checkIfUserIsInGroup(user, data.groupId, this.groupPersistence);
        checkIfUsersAreInSameGroup(data.members, data.groupId, this.groupPersistence);
        return this.discussionPersistence.createDiscussion(data);
    }
}