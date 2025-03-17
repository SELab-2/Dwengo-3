import { PaginationParams } from "../util/types/pagination.types";
import {
  ClassCreateParams,
  ClassFilterParams,
  ClassUpdateParams,
} from "../util/types/class.types";
import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import { searchAndPaginate } from "../util/pagination/pagination.util";
import { UserEntity } from "../util/types/user.types";

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

    return searchAndPaginate(this.prisma.class, where, paginationParams, {
      students: true,
      teachers: true,
    });
  }

  public async getClassById(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                name: true,
                surname: true,
              },
            },
          },
        },
        teachers: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                name: true,
                surname: true,
              },
            },
          },
        },
        assignment: {
          select: {
            id: true,
            learningPathId: true,
          },
        },
      },
    });

    if (!classData) {
      throw new Error("Class with id: ${id} was not found");
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
    });
  }

  public async updateClass(params: ClassUpdateParams) {
    const { id, ...data } = params;

    return await this.prisma.class.update({
      where: { id },
      data: data,
    });
  }

  public async isTeacherFromClass(userId: string, classId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId,
        classes: {
          some: {
            id: classId,
          },
        },
      },
    });
    return teacher !== null;
  }
}
