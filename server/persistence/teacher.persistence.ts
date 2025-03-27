import { PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import {
  TeacherFilterParams,
  TeacherIncludeParams,
} from '../util/types/teacher.types';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { teacherSelectDetail } from '../util/selectInput/teacher.select';
import { NotFoundError } from '../util/types/error.types';

export class TeacherPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  /**
   * Create a teacher.
   *
   * @param userId - The ID of the user to create the teacher for.
   * @returns The created teacher.
   */
  public async createTeacher(userId: string) {
    return await this.prisma.teacher.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * Get a list of teachers based on the provided filters and pagination parameters.
   *
   * @param pagination - Pagination parameters.
   * @param filters - Filters for the query.
   * @param include - Optional `include` clause for related models.
   * @returns Paginated data and total pages.
   */
  public async getTeachers(
    pagination: PaginationParams,
    filters: TeacherFilterParams,
    include: TeacherIncludeParams,
  ) {
    const whereClause = {
      AND: [
        filters.userId ? { userId: filters.userId } : {},
        filters.classId ? { classes: { some: { id: filters.classId } } } : {},
        filters.assignmentId ? { assignments: { some: { id: filters.assignmentId } } } : {},
      ],
    };

    return await searchAndPaginate(this.prisma.teacher, whereClause, pagination, include);
  }

  /**
   * Get a teacher by their ID.
   *
   * @param teacherId - The ID of the teacher to get.
   * @param include - Optional `include` clause for related models.
   * @returns The teacher data.
   */
  public async getTeacherById(teacherId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: teacherSelectDetail,
    });

    if (!teacher) {
      throw new NotFoundError(40404);
    }

    return teacher;
  }

  /**
   * Get a teacher by their user ID.
   *
   * @param userId - The ID of the user to get the teacher for.
   * @param include - Optional `include` clause for related models.
   * @returns The teacher data.
   */
  public async getTeacherByUserId(userId: string) {
    return await this.prisma.teacher.findUnique({
      where: { userId },
      select: teacherSelectDetail,
    });
  }
}
