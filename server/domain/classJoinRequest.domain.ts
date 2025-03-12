import { PaginationFilterSchema } from "../util/types/pagination.types";
import {
  ClassJoinRequestCreateScheme,
  ClassJoinRequestDecisionSchema,
  ClassJoinRequestFilterSchema,
} from "../util/types/classJoinRequest.types";
import { ClassJoinRequestPersistence } from "../persistence/classJoinRequest.persistence";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";
import { ClassPersistence } from "../persistence/class.persistence";

export class ClassJoinRequestDomain {
  private classJoinRequestPersistance: ClassJoinRequestPersistence;
  private classPersistence: ClassPersistence;

  constructor() {
    this.classJoinRequestPersistance = new ClassJoinRequestPersistence();
    this.classPersistence = new ClassPersistence();
  }

  public async createClassJoinRequest(body: unknown, user: UserEntity) {
    const ClassJoinRequestParams = ClassJoinRequestCreateScheme.safeParse(body);
    if (!ClassJoinRequestParams.success) {
      throw ClassJoinRequestParams.error;
    }

    if (
      await this.classJoinRequestPersistance.checkIfJoinRequestExists(
        ClassJoinRequestParams.data.classId,
        user.id,
      )
    ) {
      throw new Error("Join request already exists.");
    }

    return this.classJoinRequestPersistance.createClassJoinRequest(
      ClassJoinRequestParams.data,
      user,
    );
  }

  public async getJoinRequests(query: unknown, user: UserEntity) {
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    const ClassJoinRequestFilterResult =
      ClassJoinRequestFilterSchema.safeParse(query);
    if (!ClassJoinRequestFilterResult.success) {
      throw ClassJoinRequestFilterResult.error;
    }

    // Atleast one of them will be non null because of the checks in the zod scheme.
    const { classId, userId } = ClassJoinRequestFilterResult.data;

    // Teacher checks:
    if (user.role === ClassRoleEnum.TEACHER) {
      // If userId is provided, it must match the teacher's own userId
      // Teachers should only be able to view join requests for their own classes.
      if (userId && userId !== user.id) {
        throw new Error(
          "Teachers can only view join requests of their own classes.",
        );
      }

      // If classId is provided, check if the teacher is associated with that class
      if (
        classId &&
        !(await this.classPersistence.isTeacherFromClass(user.id, classId))
      ) {
        throw new Error(
          "Teachers can only view join requests of their own classes.",
        );
      }
    }

    // Student checks:
    if (user.role === ClassRoleEnum.STUDENT) {
      // If userId is provided, it must match the student's own userId
      if (userId && userId !== user.id) {
        throw new Error("Students can only view their own join requests.");
      }

      // If classId is provided, deny the request because students cannot fetch join requests for classes
      if (classId) {
        throw new Error("Students cannot view join requests for classes.");
      }
    }

    return this.classJoinRequestPersistance.getJoinRequests(
      paginationResult.data,
      ClassJoinRequestFilterResult.data,
      user,
    );
  }

  public async handleJoinRequest(body: unknown, user: UserEntity) {
    const ClassJoinRequestDecisionParams =
      ClassJoinRequestDecisionSchema.safeParse(body);
    if (!ClassJoinRequestDecisionParams.success) {
      throw ClassJoinRequestDecisionParams.error;
    }

    if (user.role !== "TEACHER") {
      throw new Error("Only teachers can handle join requests.");
    }

    if (
      !this.classJoinRequestPersistance.isTeacherOfClassFromRequest(
        ClassJoinRequestDecisionParams.data.requestId,
        user.id,
      )
    ) {
      throw new Error("Only teachers of this class can handle join requests.");
    }

    return this.classJoinRequestPersistance.handleJoinRequest(
      ClassJoinRequestDecisionParams.data,
    );
  }
}
