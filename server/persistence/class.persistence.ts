import { PrismaSingleton } from "./prismaSingleton";
import { PaginationParams } from "../util/types/pagination.types";
import {
  ClassCreateParams,
  ClassFilterParams,
  ClassUpdateParams,
} from "../util/types/class.types";
import { PrismaSingleton } from "./prismaSingleton";
import { searchAndPaginate } from "../util/pagination/pagination.util";

export class ClassPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  private buildWhereClause(filters: ClassFilterParams): Prisma.ClassWhereInput {
    return {
      AND: [
        filters.name
          ? {
              name: {
                contains: filters.name,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
        filters.teacherId
          ? { teachers: { some: { id: filters.teacherId } } }
          : {},
        filters.studentId
          ? { students: { some: { id: filters.studentId } } }
          : {},
        filters.id ? { id: filters.id } : {},
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
    return await this.prisma.class.findUnique({
      where: { id },
      include: {
        students: true,
        teachers: true,
      },
    });
  }
  public async createClass(params: ClassCreateParams) {
    return await this.prisma.class.create({
      data: { name: params.name },
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
