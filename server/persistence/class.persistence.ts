import { PaginationParams } from '../util/types/pagination.types';
import {
  ClassCreateParams,
  ClassDetail,
  ClassFilterParams,
  ClassUpdateParams,
} from '../util/types/class.types';
import { Prisma } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { UserEntity } from '../util/types/user.types';
import { NotFoundError } from '../util/types/error.types';
import { classSelectDetail, classSelectShort } from '../util/selectInput/select';

export class ClassPersistence {
  private prisma;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getClasses(paginationParams: PaginationParams, filters: ClassFilterParams) {
    const where: Prisma.ClassWhereInput = this.buildWhereClause(filters);

    return searchAndPaginate(
      this.prisma.class,
      where,
      paginationParams,
      undefined,
      classSelectShort,
    );
  }

  public async getClassById(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      select: classSelectDetail,
    });

    if (!classData) {
      throw new NotFoundError(40401);
    }

    return classData;
  }

  public async createClass(params: ClassCreateParams, creator: UserEntity): Promise<ClassDetail> {
    return await this.prisma.class.create({
      data: {
        name: params.name,
        teachers: {
          connect: {
            id: creator.teacher?.id,
          },
        },
      },
      select: classSelectDetail,
    });
  }

  public async updateClass(id: string, params: ClassUpdateParams) {
    return await this.prisma.class.update({
      where: { id },
      data: params,
      select: classSelectDetail,
    });
  }

  public async isTeacherFromClass(teacherId: string, classId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        id: teacherId,
        classes: {
          some: {
            id: classId,
          },
        },
      },
    });
    return teacher !== null;
  }

  public async isStudentFromClass(studentId: string, classId: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        classes: {
          some: {
            id: classId,
          },
        },
      },
    });
    return student !== null;
  }

  public async removeTeacherFromClass(classId: string, teacherId: string) {
    const classData = await this.prisma.class.update({
      where: { id: classId },
      data: {
        teachers: {
          disconnect: { id: teacherId },
        },
      },
      include: {
        teachers: true,
      },
    });
    if (classData.teachers.length == 0) {
      await this.prisma.class.delete({
        where: { id: classId },
      });
    }
  }

  public async removeStudentFromClass(classId: string, studentId: string) {
    return await this.prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId },
        },
      },
      select: classSelectDetail,
    });
  }

  private buildWhereClause(filters: ClassFilterParams): Prisma.ClassWhereInput {
    return {
      AND: [
        filters.teacherId ? { teachers: { some: { id: filters.teacherId } } } : {},
        filters.studentId ? { students: { some: { id: filters.studentId } } } : {},
      ],
    };
  }
}
