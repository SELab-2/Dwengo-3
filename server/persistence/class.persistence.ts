import { PrismaClient, Prisma } from "@prisma/client";
import {
  PaginationParams,
  ClassFilterParams,
  ClassCreateParams,
  ClassUpdateParams,
  IdParams,
} from "../domain/types";

const prisma = new PrismaClient();

export class ClassPersistence {
  public async getClasses(
    paginationParams: PaginationParams,
    filters: ClassFilterParams
  ) {
    const where: Prisma.ClassWhereInput = {
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

    const [classes, totalCount] = await prisma.$transaction([
      prisma.class.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.pageSize,
      }),
      prisma.class.count({
        where,
      }),
    ]);

    return {
      data: classes,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async createClass(params: ClassCreateParams) {
    return await prisma.class.create({
      data: { name: params.name },
    });
  }

  public async updateClass(idParams: IdParams, params: ClassUpdateParams) {
    return await prisma.class.update({
      where: { id: idParams.id },
      data: { name: params.name },
    });
  }

  public async deleteClass(idParams: IdParams) {
    return await prisma.class.delete({
      where: { id: idParams.id },
    });
  }
}
