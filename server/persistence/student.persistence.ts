import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { StudentFilterParams } from '../util/types/student.types';
import { NotFoundError } from '../util/types/error.types';
import { studentSelectDetail, studentSelectShort } from '../util/selectInput/select';
import { GroupPersistence } from './group.persistence';
import { AssignmentSubmissionPersistence } from './assignmentSubmission.persistence';

/**
 * Persistence class for Student model.
 *
 * This class contains methods for querying the Student model.
 */
export class StudentPersistence {
  private prisma: PrismaClient;
  private groupPersistence: GroupPersistence;
  private submissionPersistence: AssignmentSubmissionPersistence;

  constructor() {
    this.prisma = PrismaSingleton.instance;
    this.groupPersistence = new GroupPersistence();
    this.submissionPersistence = new AssignmentSubmissionPersistence();
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
  public async getStudents(pagination: PaginationParams, filters: StudentFilterParams) {
    const whereClause: Prisma.StudentWhereInput = {
      AND: [
        filters.classId ? { classes: { some: { id: filters.classId } } } : {},
        filters.groupId ? { groups: { some: { id: filters.groupId } } } : {},
      ],
    };

    return searchAndPaginate(
      this.prisma.student,
      whereClause,
      pagination,
      undefined,
      studentSelectShort,
    );
  }

  /**
   * Get a student by their ID.
   *
   * @param id - The ID of the student to fetch.
   * @returns The student data.
   */
  public async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: studentSelectDetail,
    });

    if (!student) {
      throw new NotFoundError(40403);
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
    const student = await this.prisma.student.findUnique({
      where: { userId },
      select: studentSelectDetail,
    });

    if (!student) {
      throw new NotFoundError(40403);
    }

    return student;
  }

  public async getStudentUserIdsByGroupId(groupId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        groups: {
          some: {
            id: groupId,
          },
        },
      },
      select: {
        userId: true,
      },
    });

    return students.map((student) => student.userId);
  }

  public async deleteStudent(id: string) {
    const student = await this.getStudentById(id);
    
    for (const group of student.groups) {
      await this.groupPersistence.deleteStudentFromGroup(id, group.id);
    }

    for (const classData of student.classes) {
      await this.prisma.class.update({
        where: { id: classData.id},
        data: {
          students: {
            disconnect: { id: student.id }
          }
        }
      });
    }

    const favorites = (await this.prisma.user.findUnique({
      where: { id: student.userId },
      include: { favorites: true }
    }))!.favorites;

    for (const favorite of favorites) {
      await this.submissionPersistence.deleteAssignmentSubmissions({
        favoriteId: favorite.id
      });
    }

    await this.prisma.user.delete({
      where: { id: student.userId }
    });
  }
}
