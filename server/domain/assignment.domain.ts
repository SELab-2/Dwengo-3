import { Assignment, ClassRole } from "@prisma/client";
import { AssignmentPersistence } from "../persistence/assignment.persistence";
import {
  AssignmentFilterSchema,
  AssignmentCreateSchema,
  AssignmentShort,
  AssignmentDetail,
  Uuid,
} from "../util/types/assignment.types";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";
import {
  checkIfUserIsInClass,
  checkIfUserIsInGroup,
  checkIfUsersAreInSameClass,
  compareUserIdWithFilterId,
} from "../util/coockie-checks/coockieChecks.util";
import { ClassPersistence } from "../persistence/class.persistence";
import { GroupPersistence } from "../persistence/group.persistence";

export class AssignmentDomain {
  private assignmentPersistence: AssignmentPersistence;
  private classPersistance: ClassPersistence;
  private groupPersistence: GroupPersistence;

  public constructor() {
    this.assignmentPersistence = new AssignmentPersistence();
    this.classPersistance = new ClassPersistence();
    this.groupPersistence = new GroupPersistence();
  }

  public async getAssignments(
    query: any,
    user: UserEntity,
  ): Promise<{ data: AssignmentShort[]; totalPages: number }> {
    const paginationParseResult = PaginationFilterSchema.safeParse(query);
    if (!paginationParseResult.success) {
      throw paginationParseResult.error;
    }
    const filtersResults = AssignmentFilterSchema.safeParse(query);
    if (!filtersResults.success) {
      throw filtersResults.error;
    }
    const filters = filtersResults.data;
    await compareUserIdWithFilterId(user, filters.studentId, filters.teacherId);
    await checkIfUserIsInClass(user, filters.classId, this.classPersistance);
    await checkIfUserIsInGroup(user, filters.groupId, this.groupPersistence);
    return this.assignmentPersistence.getAssignments(
      filters,
      paginationParseResult.data,
    );
  }

  public async getAssignmentById(id: Uuid, user: UserEntity) {
    const assignment = await this.assignmentPersistence.getAssignmentId(id);
    checkIfUserIsInClass(
      user,
      assignment.class.id,
      this.classPersistance,
    );
    return assignment;
  }

  public async createAssigment(
    query: any,
    user: UserEntity,
  ): Promise<AssignmentDetail> {
    if (user.role !== ClassRole.TEACHER) {
      throw new Error("Only teachers can create assigments");
    }
    const parseResult = AssignmentCreateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const data = parseResult.data;
    data.teacherId = user.teacher!.id;
    checkIfUsersAreInSameClass(
      data.groups,
      data.classId,
      data.teacherId!,
      this.classPersistance,
    );
    return this.assignmentPersistence.createAssignment(data);
  }
}
