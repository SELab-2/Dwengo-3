import { DiscussionPersistence } from '../persistence/discussion.persistence';
import { queryWithPaginationParser } from '../util/pagination/queryWithPaginationParser.util';
import {
  DiscussionCreateSchema,
  DiscussionDetail,
  DiscussionFilterSchema,
  DiscussionShort,
} from '../util/types/discussion.types';
import { UserEntity } from '../util/types/user.types';
import {
  checkIfUserInAssignment,
  checkIfUserIsInGroup,
} from '../util/cookie-checks/cookieChecks.util';
import { GroupPersistence } from '../persistence/group.persistence';
import { TeacherPersistence } from '../persistence/teacher.persistence';
import { StudentPersistence } from '../persistence/student.persistence';
import { BadRequestError } from '../util/types/error.types';
import { ClassPersistence } from '../persistence/class.persistence';
import { AssignmentPersistence } from '../persistence/assignment.persistence';
import { Uuid } from '../util/types/theme.types';

export class DiscussionDomain {
  private discussionPersistence: DiscussionPersistence;
  private groupPersistence: GroupPersistence;
  private teacherPersistence: TeacherPersistence;
  private studentPersistence: StudentPersistence;
  private classPersistence: ClassPersistence;
  private assignmentPersistence: AssignmentPersistence;

  public constructor() {
    this.discussionPersistence = new DiscussionPersistence();
    this.groupPersistence = new GroupPersistence();
    this.teacherPersistence = new TeacherPersistence();
    this.studentPersistence = new StudentPersistence();
    this.classPersistence = new ClassPersistence();
    this.assignmentPersistence = new AssignmentPersistence();
  }

  public async getDiscussions(
    query: any,
    user: UserEntity,
  ): Promise<{ data: DiscussionShort[]; totalPages: number }> {
    const parseResult = queryWithPaginationParser(query, DiscussionFilterSchema);
    const filters = parseResult.dataSchema;

    // Check if the userId's match if the userId is used as a filter
    if (filters.userId && user.id !== filters.userId) {
      throw new BadRequestError(40049);
    }

    // Check if the user is a member of the assignment if the assignmentId is used as a filter
    if (filters.assignmentId) {
      await checkIfUserInAssignment(
        user,
        filters.assignmentId,
        this.assignmentPersistence,
        this.classPersistence,
      );
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
    await this.checkIfGroupAlreadyHasDiscussion(data.groupId);

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

  public async checkIfGroupAlreadyHasDiscussion(groupId: Uuid): Promise<void> {
    const group = await this.groupPersistence.getGroupById(groupId);

    if (group && group.discussion) {
      throw new BadRequestError(40051);
    }
  }
}
