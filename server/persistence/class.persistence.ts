import { PaginationParams } from '../util/types/pagination.types';
import {
  ClassCreateParams,
  ClassFilterParams,
  ClassUpdateParams,
} from '../util/types/class.types';
import { Prisma } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { UserEntity } from '../util/types/user.types';
import {
  classSelectDetail,
  classSelectShort,
} from '../util/selectInput/class.select';

export class ClassPersistence {
  private prisma;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  private buildWhereClause(filters: ClassFilterParams): Prisma.ClassWhereInput {
    return {
      AND: [
        filters.teacherId
          ? { teachers: { some: { id: filters.teacherId } } }
          : {},
        filters.studentId
          ? { students: { some: { id: filters.studentId } } }
          : {},
      ],
    };
  }

  public async getClasses(
    paginationParams: PaginationParams,
    filters: ClassFilterParams,
  ) {
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
      throw new Error(`Class with id: ${id} was not found`);
    }

    return classData;
  }

  public async createClass(params: ClassCreateParams, creator: UserEntity) {
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

  public async updateClass(params: ClassUpdateParams) {
    const { id, ...data } = params;

    return await this.prisma.class.update({
      where: { id },
      data: data,
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
    return await this.prisma.class.update({
      where: { id: classId },
      data: {
        teachers: {
          disconnect: { id: teacherId },
        },
      },
      select: classSelectDetail,
    });
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
}
