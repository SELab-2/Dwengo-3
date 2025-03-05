import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "../prismaSingleton";
import { PaginationParams } from "../util/types/pagination.types";
import { ClassFilterParams, ClassCreateParams, UUIDParams, ClassJoinRequestParams } from "../util/types/class.types";

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

    const [classes, totalCount] = await PrismaSingleton.instance.$transaction([
      PrismaSingleton.instance.class.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.pageSize,
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
      data: { owner: { connect: { id: data.owner } }, name: data.name },
    });
  }

  public async deleteClass(idParams: UUIDParams) {
    return await PrismaSingleton.instance.class.delete({
      where: { id: idParams.id },
    });
  }

  public async createClassJoinRequest(data: ClassJoinRequestParams) {
    // TODO: Implement this method once we have authentication.
    //return await PrismaSingleton.instance.class.update({

    //});
  }
}
