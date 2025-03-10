import { ClassPersistence } from "../persistence/class.persistence";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import {
  ClassFilterSchema,
  ClassCreateSchema,
  ClassUpdateSchema,
} from "../util/types/class.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class ClassDomain {
  private classPersistance;

  constructor() {
    this.classPersistance = new ClassPersistence();
  }

  public async getClasses(query: unknown, user: UserEntity) {
    // Validate and parse pagination query parameters
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    // Validate and parse class filters
    const filtersResult = ClassFilterSchema.safeParse(query);
    if (!filtersResult.success) {
      throw filtersResult.error;
    }

    const { id, studentId, teacherId } = filtersResult.data;

    if (id) {
      // Class Id is given => fetch class and check if user is a teacher or student
      const classData = await this.classPersistance.getClassById(id);

      if (!classData) {
        throw new Error("Class not found.");
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
        throw new Error(
          "Either studentId, teacherId or classId must be provided.",
        );
      }

      if (
        (studentId &&
          user.role === ClassRoleEnum.STUDENT &&
          user.student?.id !== studentId) ||
        (teacherId &&
          user.role === ClassRoleEnum.TEACHER &&
          user.teacher?.id !== teacherId)
      ) {
        throw new Error(
          "User ID does correspond with the provided studentId or teacherId.",
        );
      }

      const { data, totalPages } = await this.classPersistance.getClasses(
        paginationResult.data,
        filtersResult.data,
      );

      return { data, totalPages };
    }
  }

  public async createClass(body: unknown, user: UserEntity) {
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error("User must be a teacher to create a class.");
    }

    // Validate and parse class create parameters
    const createParamsResult = ClassCreateSchema.safeParse(body);
    if (!createParamsResult.success) {
      throw createParamsResult.error;
    }

    return this.classPersistance.createClass(createParamsResult.data);
  }

  public async updateClass(body: unknown, user: UserEntity) {
    // Validate and parse class update parameters
    const updateParamsResult = ClassUpdateSchema.safeParse(body);
    if (!updateParamsResult.success) {
      throw updateParamsResult.error;
    }

    if (
      !this.classPersistance.isTeacherFromClass(
        user.id,
        updateParamsResult.data.id,
      )
    ) {
      throw new Error("User must be a teacher of the class to update it.");
    }

    return this.classPersistance.updateClass(updateParamsResult.data);
  }
}
