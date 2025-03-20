import { ClassPersistence } from '../persistence/class.persistence';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { ClassCreateSchema, ClassFilterSchema, ClassUpdateSchema } from '../util/types/class.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError, NotFoundError } from '../util/types/error.types';

export class ClassDomain {
  private classPersistence;

  constructor() {
    this.classPersistence = new ClassPersistence();
  }

  public async getClasses(query: unknown, user: UserEntity) {
    // Validate and parse pagination query parameters
    const pagination = PaginationFilterSchema.parse(query);

    // Validate and parse class filters
    const filters = ClassFilterSchema.parse(query);

    const { id, studentId, teacherId } = filters;

    if (id) {
      // Class Id is given => fetch class and check if user is a teacher or student
      const classData = await this.classPersistence.getClassById(id);

      if (!classData) {
        throw new NotFoundError(40401);
      }

      if (user.role === ClassRoleEnum.TEACHER) {
        const isTeacherOfThisClass = classData.teachers.some(
          (teacher) => teacher.userId === user.id,
        );

        if (!isTeacherOfThisClass) {
          throw new BadRequestError(40001);
        }
      }

      if (user.role === ClassRoleEnum.STUDENT) {
        const isStudentOfThisClass = classData.students.some(
          (student) => student.userId === user.id,
        );

        if (!isStudentOfThisClass) {
          throw new BadRequestError(40002);
        }
      }

      return { data: [classData], totalPages: 1 };
    } else {
      if (!studentId && !teacherId) {
        throw new BadRequestError(40003);
      }

      if (
        (studentId && user.role === ClassRoleEnum.STUDENT && user.student?.id !== studentId) ||
        (teacherId && user.role === ClassRoleEnum.TEACHER && user.teacher?.id !== teacherId)
      ) {
        throw new BadRequestError(40004);
      }

      const { data, totalPages } = await this.classPersistence.getClasses(pagination, filters);

      return { data, totalPages };
    }
  }

  public async createClass(body: unknown, user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40005);
    }

    // Validate and parse class create parameters
    const createParams = ClassCreateSchema.parse(body);

    return this.classPersistence.createClass(createParams, user);
  }

  public async updateClass(body: unknown, user: UserEntity) {
    // Validate and parse class update parameters
    const updateParams = ClassUpdateSchema.parse(body);

    if (!(await this.classPersistence.isTeacherFromClass(user.id, updateParams.id))) {
      throw new BadRequestError(40006);
    }

    return this.classPersistence.updateClass(updateParams);
  }

  public async checkUserBelongsToClass(user: UserEntity, classId: string) {
    const classById = await this.classPersistence.getClassById(classId);
    let exists = false;
    if (user.role === ClassRoleEnum.TEACHER) {
      exists = classById?.teachers.some((teacher) => teacher.id === user.teacher?.id) || false;
    } else if (user.role === ClassRoleEnum.STUDENT) {
      exists = classById?.students.some((student) => student.id === user.student?.id) || false;
    }
    if (exists) {
      throw new BadRequestError(40007);
    }
  }
}
