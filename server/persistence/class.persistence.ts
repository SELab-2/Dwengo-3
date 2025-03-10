import { PrismaClient, Prisma } from "@prisma/client";
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
        filters.teacherIds && filters.teacherIds.length > 0
          ? {
              AND: filters.teacherIds.map((teacherId) => ({
                teachers: {
                  some: {
                    id: teacherId,
                  },
                },
              })),
            }
          : {},
        filters.studentIds && filters.studentIds.length > 0
          ? {
              AND: filters.studentIds.map((studentId) => ({
                students: {
                  some: {
                    id: studentId,
                  },
                },
              })),
            }
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
    return await PrismaSingleton.instance.class.findUnique({
      where: { id },
    });
  }

  public async createClass(params: ClassCreateParams) {
    return await this.prisma.class.create({
      data: { name: params.name },
    });
  }

  public async updateClass(id: string, params: ClassUpdateParams) {
    return await this.prisma.class.update({
      where: { id },
      data: { name: params.name },
    });
  }

  public async deleteClass(id: string) {
    return await this.prisma.class.delete({
      where: { id },
    });
  }
}
