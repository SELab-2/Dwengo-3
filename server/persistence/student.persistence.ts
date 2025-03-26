import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import {
  StudentFilterParams,
  StudentIncludeParams,
} from '../util/types/student.types';
import { studentSelectDetail } from '../util/selectInput/student.select';

/**
 * Persistence class for Student model.
 *
 * This class contains methods for querying the Student model.
 */
export class StudentPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  /**
   * Create a student.
   *
   * @param userId - The ID of the user to create the student for.
   * @returns
   */
  public async createStudent(userId: string) {
    return await this.prisma.student.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: studentSelectDetail,
    });
  }

  /**
   * Get a list of students based on the provided filters and pagination parameters.
   *
   * @param pagination - Pagination parameters.
   * @param filters - Filters for the query.
   * @param include - Optional `include` clause for related models.
   * @returns Paginated data and total pages.
   */
  public async getStudents(
    pagination: PaginationParams,
    filters: StudentFilterParams,
    include: StudentIncludeParams,
  ) {
    const whereClause: Prisma.StudentWhereInput = {
      AND: [
        filters.userId ? { userId: filters.userId } : {},
        filters.classId ? { classes: { some: { id: filters.classId } } } : {},
        filters.groupId ? { groups: { some: { id: filters.groupId } } } : {},
      ],
    };

    return searchAndPaginate(
      this.prisma.student,
      whereClause,
      pagination,
      include,
    );
  }

  /**
   * Get a student by their ID.
   *
   * @param id - The ID of the student to fetch.
   * @param include - Optional `include` clause for related models.
   * @returns The student data.
   */
  public async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: studentSelectDetail,
    });

    if (!student) {
      throw new Error(`Student with id: ${id} was not found`);
    }

    return student;
  }

  /**
   * Get a student by their user ID.
   *
   * @param userId - The ID of the user to fetch the student for.
   * @returns The student data.
   */
  public async getStudentByUserId(userId: string) {
    return await this.prisma.student.findUnique({
      where: { userId },
      select: studentSelectDetail,
    });
  }
}
