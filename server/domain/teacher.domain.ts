import { TeacherPersistence } from '../persistence/teacher.persistence';
import { ClassPersistence } from '../persistence/class.persistence';
import { UserEntity } from '../util/types/user.types';
import {
  TeacherCreateSchema,
  TeacherFilterSchema,
  TeacherIncludeSchema,
} from '../util/types/teacher.types';
import { UsersPersistence } from '../persistence/auth/users.persistence';
import { Class } from '@prisma/client';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { BadRequestError, NotFoundError } from '../util/types/error.types';

export class TeacherDomain {
  private teacherPersistence: TeacherPersistence;
  private classPersistence: ClassPersistence;
  private readonly userPersistence: UsersPersistence;

  constructor() {
    this.teacherPersistence = new TeacherPersistence();
    this.classPersistence = new ClassPersistence();
    this.userPersistence = new UsersPersistence();
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

    const user = await this.userPersistence.getUserById(userId);

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

    // TODO: validation

    // Fetch the teachers
    return await this.teacherPersistence.getTeachers(paginationData, filterData);
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

    return classes1.some((c1: Class) => classes2.some((c2: Class) => c1.id === c2.id));
  }

  public async getClassesByUserId(userId: string) {
    // TODO: move this to class domain

    const user = await this.userPersistence.getUserById(userId);

    if (!user) {
      throw new NotFoundError(40405);
    }

    if (user.teacher) {
      return await this.classPersistence.getClasses(
        { page: 1, pageSize: 100, skip: 0 },
        { teacherId: user.teacher.id },
      );
    } else if (user.student) {
      return await this.classPersistence.getClasses(
        { page: 1, pageSize: 100, skip: 0 },
        { studentId: user.student.id },
      );
    } else {
      // This should not happen
      throw new BadRequestError(40031);
    }
  }

  public async deleteTeacher(id: string, user: UserEntity) {
    if (!user.teacher || user.teacher.id !== id) {
      throw new BadRequestError(40047);
    }
    this.teacherPersistence.deleteTeacher(id);
  }
}
