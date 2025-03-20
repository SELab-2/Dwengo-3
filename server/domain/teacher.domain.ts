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
import { BadRequestError, NotFoundError } from '../util/types/error.types';

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
  private validateQuery<T extends z.ZodSchema<any>>(schema: T, query: unknown): z.infer<T> {
    // TODO: move this to a util function
    // TODO: Er zijn meerdere plekken waar dit voorkomt, mss op een centrale plek zetten?
    return schema.parse(query);
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
      throw new BadRequestError(40000, errorMessage);
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

    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError(40405);
    }

    // Check if the user is already a teacher or student
    if (user.teacher || user.student) {
      throw new BadRequestError(40032);
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
    return await this.teacherPersistence.getTeachers(paginationData, filterData, includeData);
  }

  public async updateTeacher(body: unknown, user: UserEntity) {
    // Validate the body
    const updateData = this.validateQuery(TeacherUpdateSchema, body);

    // TODO validation

    // Update the teacher
    return await this.teacherPersistence.updateTeacher(updateData);
  }

  public async deleteTeacher(body: unknown, user: UserEntity) {
    // Validate the body
    const { id } = this.validateQuery(TeacherDeleteSchema, body);

    // TODO validation

    // Delete the teacher
    return await this.teacherPersistence.deleteTeacher(id);
  }

  public async shareClass(userId1: string, userId2: string) {
    // TODO: move this to class domain

    const classes1 = await this.getClassesByUserId(userId1);
    const classes2 = await this.getClassesByUserId(userId2);

    return this.sameClass(classes1.data, classes2.data);
  }

  public async sameClass(classes1: Class[], classes2: Class[]) {
    // TODO: move this to class domain

    return classes1.some((c1: Class) => classes2.some((c2: Class) => c1.id === c2.id));
  }

  public async getClassesByUserId(userId: string) {
    // TODO: move this to class domain

    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError(40405);
    }

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
      throw new BadRequestError(40031);
    }
  }
}
