import { TeacherPersistence } from '../persistence/teacher.persistence';
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
   * Create a teacher.
   *
   * @param body - The body used in the request to create a teacher
   * @returns The created teacher
   */
  public async createTeacher(body: unknown) {
    // Validate the request body
    const { userId } = TeacherCreateSchema.parse(body);

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
    const paginationData = PaginationFilterSchema.parse(query);
    const filterData = TeacherFilterSchema.parse(query);
    const includeData = TeacherIncludeSchema.parse(query);

    // TODO: validation

    // Fetch the teachers
    return await this.teacherPersistence.getTeachers(paginationData, filterData, includeData);
  }

  public async updateTeacher(body: unknown, user: UserEntity) {
    // Validate the body
    const updateData = TeacherUpdateSchema.parse(body);

    // TODO validation

    // Update the teacher
    return await this.teacherPersistence.updateTeacher(updateData);
  }

  public async deleteTeacher(body: unknown, user: UserEntity) {
    // Validate the body
    const { id } = TeacherDeleteSchema.parse(body);

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
