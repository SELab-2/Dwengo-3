import { PrismaClient, Prisma } from "@prisma/client";
import {
  PaginationParams,
  ClassFilterParams,
  ClassCreateParams,
  ClassUpdateParams,
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
        // Filter to check if every teacherID of the filter params is in the teachers array
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
        // Filter to check if every studentID of the filter params is in the students array
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

  public async getClassById(id: string) {
    return prisma.class.findUnique({
      where: { id },
    });
  }

  public async createClass(params: ClassCreateParams) {
    return prisma.class.create({
      data: { name: params.name },
    });
  }

  public async updateClass(id: string, params: ClassUpdateParams) {
    return prisma.class.update({
      where: { id },
      data: { name: params.name },
    });
  }

  public async deleteClass(id: string) {
    return prisma.class.delete({
      where: { id },
    });
  }
}
