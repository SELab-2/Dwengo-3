import { Assignment, ClassRole } from '@prisma/client';
import { AssignmentPersistence } from '../persistence/assignment.persistence';
import { AssignmentCreateSchema, AssignmentFilterSchema } from '../util/types/assignment.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { UserEntity } from '../util/types/user.types';
import {
  checkIfUserIsInClass,
  checkIfUserIsInGroup,
  checkIfUsersAreInSameClass,
  compareUserIdWithFilterId,
} from '../util/coockie-checks/coockieChecks.util';
import { ClassPersistence } from '../persistence/class.persistence';
import { GroupPersistence } from '../persistence/group.persistence';
import { BadRequestError } from '../util/types/error.types';

export class AssignmentDomain {
  private assignmentPersistence: AssignmentPersistence;
  private classPersistence: ClassPersistence;
  private groupPersistence: GroupPersistence;

  public constructor() {
    this.assignmentPersistence = new AssignmentPersistence();
    this.classPersistence = new ClassPersistence();
    this.groupPersistence = new GroupPersistence();
  }

  public async getAssignments(
    query: any,
    user: UserEntity,
  ): Promise<{ data: Assignment[]; totalPages: number }> {
    const pagination = PaginationFilterSchema.parse(query);
    const filters = AssignmentFilterSchema.parse(query);

    await compareUserIdWithFilterId(user, filters.studentId, filters.teacherId);
    await checkIfUserIsInClass(user, filters.classId, this.classPersistence);
    await checkIfUserIsInGroup(user, filters.groupId, this.groupPersistence);
    const assignments = await this.assignmentPersistence.getAssignments(filters, pagination);
    if (filters.id && assignments.data.length === 1) {
      await checkIfUserIsInClass(user, assignments.data[0].classId, this.classPersistence);
    }
    return assignments;
  }

  public async createAssigment(query: any, user: UserEntity): Promise<Assignment> {
    if (user.role !== ClassRole.TEACHER) {
      throw new BadRequestError(40012);
    }
    const data = AssignmentCreateSchema.parse(query);

    data.teacherId = user.teacher!.id;
    await checkIfUsersAreInSameClass(
      data.groups,
      data.classId,
      data.teacherId!,
      this.classPersistence,
    );
    return this.assignmentPersistence.createAssignment(data);
  }
}
