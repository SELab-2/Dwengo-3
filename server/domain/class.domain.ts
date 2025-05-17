import { ClassPersistence } from '../persistence/class.persistence';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import {
  ClassCreateSchema,
  ClassDetail,
  ClassFilterParams,
  ClassFilterSchema,
  ClassUpdateSchema,
} from '../util/types/class.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError, NotFoundError } from '../util/types/error.types';
import { compareUserIdWithFilterId } from '../util/cookie-checks/cookieChecks.util';

export class ClassDomain {
  private classPersistence;

  constructor() {
    this.classPersistence = new ClassPersistence();
  }

  public async getClasses(query: ClassFilterParams, user: UserEntity) {
    // Validate and parse pagination query parameters
    const pagination = PaginationFilterSchema.parse(query);

    // Validate and parse class filters
    const filters = ClassFilterSchema.parse(query);

    await compareUserIdWithFilterId(user, filters.studentId, filters.teacherId);

    return await this.classPersistence.getClasses(pagination, filters);
  }

  public async getClassById(id: string, user: UserEntity) {
    const classData = await this.classPersistence.getClassById(id);

    if (user.role === ClassRoleEnum.TEACHER) {
      const isTeacherOfThisClass = classData.teachers.some(
        (teacher) => teacher.id === user.teacher?.id,
      );

      if (!isTeacherOfThisClass) {
        throw new BadRequestError(40001);
      }
    }

    if (user.role === ClassRoleEnum.STUDENT) {
      const isStudentOfThisClass = classData.students.some((student) => student.userId === user.id);

      if (!isStudentOfThisClass) {
        throw new BadRequestError(40002);
      }
    }

    // Delete the userId fields from the object
    return classData;
  }

  public async createClass(body: unknown, user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40005);
    }

    // Validate and parse class create parameters
    const data = ClassCreateSchema.parse(body);
    return this.classPersistence.createClass(data, user);
  }

  public async updateClass(id: string, body: unknown, user: UserEntity) {
    // Validate and parse class update parameters
    const params = ClassUpdateSchema.parse(body);

    if (!user.teacher) {
      throw new BadRequestError(40006);
    }

    if (!(await this.classPersistence.isTeacherFromClass(user.teacher.id, id))) {
      throw new BadRequestError(40006);
    }

    return this.classPersistence.updateClass(id, params);
  }

  public async checkUserBelongsToClass(user: UserEntity, classId: string) {
    const classById: ClassDetail = await this.classPersistence.getClassById(classId);
    let exists = false;
    if (user.role === ClassRoleEnum.TEACHER) {
      exists = classById?.teachers.some((teacher) => teacher.id === user.teacher?.id) || false;
    } else if (user.role === ClassRoleEnum.STUDENT) {
      exists = classById?.students.some((student) => student.id === user.student?.id) || false;
    }
    if (!exists) {
      throw new BadRequestError(40007);
    }
  }

  public async removeTeacherFromClass(classId: string, teacherId: string, user: UserEntity) {
    if (!user.teacher) {
      throw new BadRequestError(40035);
    }

    if (!(await this.classPersistence.isTeacherFromClass(user.teacher.id, classId))) {
      throw new BadRequestError(40035);
    }

    if (!(await this.classPersistence.isTeacherFromClass(teacherId, classId))) {
      throw new NotFoundError(40404);
    }

    return await this.classPersistence.removeTeacherFromClass(classId, teacherId);
  }

  public async removeStudentFromClass(classId: string, studentId: string, user: UserEntity) {
    if (!user.teacher) {
      throw new BadRequestError(40035);
    }

    if (!(await this.classPersistence.isTeacherFromClass(user.teacher.id, classId))) {
      throw new BadRequestError(40035);
    }

    if (!(await this.classPersistence.isStudentFromClass(studentId, classId))) {
      throw new NotFoundError(40403);
    }

    return await this.classPersistence.removeStudentFromClass(classId, studentId);
  }
}
