import { DiscussionPersistence } from '../persistence/discussion.persistence';
import { queryWithPaginationParser } from '../util/pagination/queryWithPaginationParser.util';
import {
  DiscussionCreateSchema,
  DiscussionDetail,
  DiscussionFilterSchema,
  discussionShort,
} from '../util/types/discussion.types';
import { UserEntity } from '../util/types/user.types';
import {
  checkIfUserIsInGroup,
  checkIfUsersAreInSameGroup,
} from '../util/coockie-checks/coockieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { Uuid } from '../util/types/assignment.types';

export class DiscussionDomain {
  private discussionPersistence: DiscussionPersistence;
  private groupPersistence: GroupPersistence;

  public constructor() {
    this.discussionPersistence = new DiscussionPersistence();
    this.groupPersistence = new GroupPersistence();
  }

  public async getDiscussions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: discussionShort[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(query, DiscussionFilterSchema);
    const filters = parseResult.dataSchema;
    const checks = filters.groupIds
      ? filters.groupIds.map((groupId) =>
          checkIfUserIsInGroup(user, groupId, this.groupPersistence),
        )
      : [];
    await Promise.all(checks);
    return this.discussionPersistence.getDiscussions(filters, parseResult.dataPagination);
  }

  public async getDiscussionById(id: Uuid, user: UserEntity) {
    const discussion = await this.discussionPersistence.getDiscussionById(id);
    await checkIfUserIsInGroup(user, discussion.group.id, this.groupPersistence);
    return discussion;
  }

  public async createDiscussion(query: any, user: UserEntity): Promise<DiscussionDetail> {
    const data = DiscussionCreateSchema.parse(query);
    await checkIfUserIsInGroup(user, data.groupId, this.groupPersistence);
    await checkIfUsersAreInSameGroup(data.members, data.groupId, this.groupPersistence);
    return this.discussionPersistence.createDiscussion(data);
  }
}
