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

    const { data, totalPages } = await this.classPersistance.getClasses(
      paginationResult.data,
      filtersResult.data,
    );

    // If the user is a teacher, check if the user is a teacher of all the classes.
    if (user.role === ClassRoleEnum.TEACHER) {
      for (const classData of data) {
        let isTeacherOfThisClass = false;
        for (const teacher of classData.teachers) {
          if (teacher.userId === user.id) {
            isTeacherOfThisClass = true;
          }
        }

        if (!isTeacherOfThisClass) {
          throw new Error("Can't fetch classes you're not a teacher of.");
        }
      }
    }

    // If the user is a student, check if the user is a student of all the classes.
    if (user.role === ClassRoleEnum.STUDENT) {
      for (const a of data) {
        let isStudentOfThisClass = false;
        for (const b of a.students) {
          if (b.userId === user.id) {
            isStudentOfThisClass = true;
          }
        }

        if (!isStudentOfThisClass) {
          throw new Error("Can't fetch classes you're not a student of.");
        }
      }
    }

    return { data, totalPages };
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
