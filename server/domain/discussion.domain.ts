import { DiscussionPersistence } from '../persistence/discussion.persistence';
import { queryWithPaginationParser } from '../util/pagination/queryWithPaginationParser.util';
import {
  DiscussionCreateSchema,
  DiscussionDetail,
  DiscussionFilterSchema,
  DiscussionShort,
} from '../util/types/discussion.types';
import { UserEntity } from '../util/types/user.types';
import { checkIfUserIsInGroup } from '../util/cookie-checks/cookieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { Uuid } from '../util/types/assignment.types';
import { TeacherPersistence } from '../persistence/teacher.persistence';
import { StudentPersistence } from '../persistence/student.persistence';

export class DiscussionDomain {
  private discussionPersistence: DiscussionPersistence;
  private groupPersistence: GroupPersistence;
  private teacherPersistence: TeacherPersistence;
  private studentPersistence: StudentPersistence;

  public constructor() {
    this.discussionPersistence = new DiscussionPersistence();
    this.groupPersistence = new GroupPersistence();
    this.teacherPersistence = new TeacherPersistence();
    this.studentPersistence = new StudentPersistence();
  }

  public async getDiscussions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: DiscussionShort[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(query, DiscussionFilterSchema);
    const filters = parseResult.dataSchema;
    if (user.id !== filters.userId) {
      throw new Error("User ID doesn't correspond with the provided userId.");
    }
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

    // get all the users that are supposed to see the discussion
    // This includes all the group members and the teachers in the class

    // get the group members userIds
    const groupMemberUserIds: string[] = await this.studentPersistence.getStudentUserIdsByGroupId(
      data.groupId,
    );

    // get the teacherIds
    const teacherIds: string[] = await this.teacherPersistence.getTeacherUserIdsByGroupId(
      data.groupId,
    );

    const memberIds = groupMemberUserIds.concat(teacherIds);

    return this.discussionPersistence.createDiscussion(data, memberIds);
  }
}
