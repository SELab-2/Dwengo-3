import { ClassPersistence } from '../persistence/class.persistence';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { ClassCreateSchema, ClassFilterSchema, ClassUpdateSchema } from '../util/types/class.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';

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
        throw new Error('Class not found.');
      }

      if (user.role === ClassRoleEnum.TEACHER) {
        const isTeacherOfThisClass = classData.teachers.some(
          (teacher) => teacher.userId === user.id,
        );

        if (!isTeacherOfThisClass) {
          throw new Error("Can't fetch classes you're not a teacher of.");
        }
      }

      if (user.role === ClassRoleEnum.STUDENT) {
        const isStudentOfThisClass = classData.students.some(
          (student) => student.userId === user.id,
        );

        if (!isStudentOfThisClass) {
          throw new Error("Can't fetch classes you're not a student of.");
        }
      }

      return { data: [classData], totalPages: 1 };
    } else {
      if (!studentId && !teacherId) {
        throw new Error('Either studentId, teacherId or classId must be provided.');
      }

      if (
        (studentId && user.role === ClassRoleEnum.STUDENT && user.student?.id !== studentId) ||
        (teacherId && user.role === ClassRoleEnum.TEACHER && user.teacher?.id !== teacherId)
      ) {
        throw new Error('User ID does correspond with the provided studentId or teacherId.');
      }

      const { data, totalPages } = await this.classPersistence.getClasses(pagination, filters);

      return { data, totalPages };
    }
  }

  public async createClass(body: unknown, user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error('User must be a teacher to create a class.');
    }

    // Validate and parse class create parameters
    const createParams = ClassCreateSchema.parse(body);

    return this.classPersistence.createClass(createParams, user);
  }

  public async updateClass(body: unknown, user: UserEntity) {
    // Validate and parse class update parameters
    const updateParams = ClassUpdateSchema.parse(body);

    if (!(await this.classPersistence.isTeacherFromClass(user.id, updateParams.id))) {
      throw new Error('User must be a teacher of the class to update it.');
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
      throw new Error('User does not belong to the class.');
    }
  }
}
