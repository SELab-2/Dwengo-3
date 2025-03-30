import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  ClassJoinRequestCreateScheme,
  ClassJoinRequestDecisionSchema,
  ClassJoinRequestFilterSchema,
} from '../util/types/classJoinRequest.types';
import { ClassJoinRequestPersistence } from '../persistence/classJoinRequest.persistence';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { ClassPersistence } from '../persistence/class.persistence';
import { BadRequestError } from '../util/types/error.types';

export class ClassJoinRequestDomain {
  private classJoinRequestPersistence: ClassJoinRequestPersistence;
  private classPersistence: ClassPersistence;

  constructor() {
    this.classJoinRequestPersistence = new ClassJoinRequestPersistence();
    this.classPersistence = new ClassPersistence();
  }

  public async createClassJoinRequest(body: unknown, user: UserEntity) {
    const classJoinRequestParams = ClassJoinRequestCreateScheme.parse(body);

    if (
      await this.classJoinRequestPersistence.checkIfJoinRequestExists(
        classJoinRequestParams.classId,
        user.id,
      )
    ) {
      throw new BadRequestError(40014);
    }

    return this.classJoinRequestPersistence.createClassJoinRequest(classJoinRequestParams, user);
  }

  public async getJoinRequests(query: unknown, user: UserEntity, classRole: ClassRoleEnum) {
    const pagination = PaginationFilterSchema.parse(query);

    const classJoinRequestFilter = ClassJoinRequestFilterSchema.parse(query);

    // At least one of them will be non-null because of the checks in the zod scheme.
    const { classId, userId } = classJoinRequestFilter;

    // Teacher checks:
    if (user.role === ClassRoleEnum.TEACHER) {
      if (!user.teacher) {
        throw new BadRequestError(40006);
      }

      // If userId is provided, it must match the teacher's own userId
      // Teachers should only be able to view join requests for their own classes.
      if (userId && userId !== user.id) {
        throw new BadRequestError(40015);
      }

      // If classId is provided, check if the teacher is associated with that class
      if (classId && !(await this.classPersistence.isTeacherFromClass(user.teacher.id, classId))) {
        throw new BadRequestError(40015);
      }
    }

    // Student checks:
    if (user.role === ClassRoleEnum.STUDENT) {
      // If userId is provided, it must match the student's own userId
      if (userId && userId !== user.id) {
        throw new BadRequestError(40017);
      }

      // If classId is provided, deny the request because students cannot fetch join requests for classes
      if (classId) {
        throw new BadRequestError(40018);
      }
    }

    return this.classJoinRequestPersistence.getJoinRequests(
      pagination,
      classJoinRequestFilter,
      classRole,
    );
  }

  public async handleJoinRequest(body: unknown, user: UserEntity) {
    const classJoinRequestDecisionParams = ClassJoinRequestDecisionSchema.parse(body);

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40019);
    }

    if (
      !(await this.classJoinRequestPersistence.isTeacherOfClassFromRequest(
        classJoinRequestDecisionParams.requestId,
        user.id,
      ))
    ) {
      throw new BadRequestError(40020);
    }

    return this.classJoinRequestPersistence.handleJoinRequest(classJoinRequestDecisionParams);
  }
}
