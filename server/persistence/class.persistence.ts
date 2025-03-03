import { PrismaClient, Prisma } from "@prisma/client";
import {
  PaginationParams,
  ClassFilterParams,
  ClassCreateParams,
  ClassUpdateParams,
  UUIDParams,
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

  public async createClass(data: ClassCreateParams) {
    return await prisma.class.create({
      data,
    });
  }

  public async updateClass(idParams: UUIDParams, data: ClassUpdateParams) {
    return await prisma.class.update({
      where: { id: idParams.id },
      data,
    });
  }

  public async deleteClass(idParams: UUIDParams) {
    return await prisma.class.delete({
      where: { id: idParams.id },
    });
  }
}
