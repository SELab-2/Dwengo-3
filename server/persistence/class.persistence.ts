import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "../prismaSingleton";
import { PaginationParams } from "../util/types/pagination.types";
import {
  ClassFilterParams,
  ClassCreateParams,
  ClassUpdateParams,
} from "../util/types/class.types";

export class ClassPersistence {
  public async getClasses(
    paginationParams: PaginationParams,
    filters: ClassFilterParams,
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

    const [classes, totalCount] = await PrismaSingleton.instance.$transaction([
      PrismaSingleton.instance.class.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.pageSize,
        include: {
          students: true,
          teachers: true,
        },
      }),
      PrismaSingleton.instance.class.count({
        where,
      }),
    ]);

    return {
      data: classes,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async createClass(data: ClassCreateParams) {
    return await PrismaSingleton.instance.class.create({
      data: { name: data.name },
    });
  }

  public async updateClass(params: ClassUpdateParams) {
    const { id, ...data } = params;

    return await PrismaSingleton.instance.class.update({
      where: { id },
      data: data,
    });
  }

  public async isTeacherFromClass(userId: string, classId: string) {
    const teacher = await PrismaSingleton.instance.teacher.findFirst({
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
