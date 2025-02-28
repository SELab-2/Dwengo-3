import { PrismaClient, Prisma } from "@prisma/client";
import { PaginationParams, ClassFilterParams } from "../domain/types";

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

    const classes = await prisma.class.findMany({
      where,
      skip: paginationParams.skip,
      take: paginationParams.pageSize,
    });

    return {
      data: classes,
      total: classes.length,
      page: paginationParams.page,
      pageSize: paginationParams.pageSize,
      totalPages: Math.ceil(classes.length / paginationParams.pageSize),
    };
  }

  public async getClassById(id: string) {
    return prisma.class.findUnique({
      where: { id },
    });
  }

  public async createClass(name: string) {
    return prisma.class.create({
      data: { name },
    });
  }

  public async updateClass(id: string, name: string) {
    return prisma.class.update({
      where: { id },
      data: { name },
    });
  }

  public async deleteClass(id: string) {
    return prisma.class.delete({
      where: { id },
    });
  }
}
