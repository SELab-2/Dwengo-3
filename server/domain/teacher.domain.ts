import { TeacherPersistence } from '../persistence/teacher.persistence';
import { z } from 'zod';
import { ClassPersistence } from '../persistence/class.persistence';
import { UserEntity } from '../util/types/user.types';
import {
  TeacherCreateSchema,
  TeacherDeleteSchema,
  TeacherFilterSchema,
  TeacherIncludeSchema,
  TeacherUpdateSchema,
} from '../util/types/teacher.types';
import { getUserById } from '../persistence/auth/users.persistance';
import { Class } from '@prisma/client';
import { PaginationFilterSchema } from '../util/types/pagination.types';

export class TeacherDomain {
  private teacherPersistence: TeacherPersistence;
  private classPersistence: ClassPersistence;

  constructor() {
    this.teacherPersistence = new TeacherPersistence();
    this.classPersistence = new ClassPersistence();
  }

  /**
   * A generic function to validate a query based on a given schema.
   *
   * @param schema - The schema to validate the query against.
   * @param query - The query to validate.
   * @returns The parsed query data.
   */
  private validateQuery<T extends z.ZodSchema<any>>(
    schema: T,
    query: unknown,
  ): z.infer<T> {
    // TODO: move this to a util function

    const result = schema.safeParse(query);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  /**
   * A generic function to validate a given object exists using a given function and input.
   *
   * @param f - The function to retrieve the object
   * @param input - The input to use for the function
   * @param errorMessage - The error message to throw if the object does not exist
   * @returns The object if it exists
   */
  private async validateObject<T, W>(
    f: (input: T) => Promise<W | null>,
    input: T,
    errorMessage: string,
  ) {
    // TODO: move this to a util function

    const result = await f(input);

    if (!result) {
      throw new Error(errorMessage);
    }

    return result;
  }

  /**
   * Create a teacher.
   *
   * @param body - The body used in the request to create a teacher
   * @returns The created teacher
   */
  public async createTeacher(body: unknown) {
    // Validate the request body
    const { userId } = this.validateQuery(TeacherCreateSchema, body);

    // Check if the user exists
    const user = await this.validateObject(
      getUserById,
      userId,
      'User does not exist',
    );

    // Check if the user is already a teacher or student
    if (user.teacher || user.student) {
      throw new Error('User is already a teacher or student');
    }

    // Create the teacher
    return await this.teacherPersistence.createTeacher(userId);
  }

  public async getTeachers(query: unknown, user: UserEntity) {
    // Validate the query
    const paginationData = this.validateQuery(PaginationFilterSchema, query);
    const filterData = this.validateQuery(TeacherFilterSchema, query);
    const includeData = this.validateQuery(TeacherIncludeSchema, query);

    // TODO: validation

    // Fetch the teachers
    return await this.teacherPersistence.getTeachers(
      paginationData,
      filterData,
      includeData,
    );
  }

  public async getTeacherById(id: string) {
    return await this.teacherPersistence.getTeacherById(id);
  }

  public async shareClass(userId1: string, userId2: string) {
    // TODO: move this to class domain

    const classes1 = await this.getClassesByUserId(userId1);
    const classes2 = await this.getClassesByUserId(userId2);

    return this.sameClass(classes1.data, classes2.data);
  }

  public async sameClass(classes1: Class[], classes2: Class[]) {
    // TODO: move this to class domain

    return classes1.some((c1: Class) =>
      classes2.some((c2: Class) => c1.id === c2.id),
    );
  }

  public async getClassesByUserId(userId: string) {
    // TODO: move this to class domain

    const user = await this.validateObject(
      getUserById,
      userId,
      'User does not exist',
    );

    if (user.teacher) {
      return await this.classPersistence.getClasses(
        { page: 1, pageSize: Infinity, skip: 0 },
        { teacherId: user.teacher.id },
      );
    } else if (user.student) {
      return await this.classPersistence.getClasses(
        { page: 1, pageSize: Infinity, skip: 0 },
        { studentId: user.student.id },
      );
    } else {
      // This should not happen
      throw new Error('User is not a teacher or student');
    }
  }
}
