import { PrismaSingleton } from "../prismaSingleton";
import { PaginationParams } from "../util/types/pagination.types";
import {
  ClassJoinRequestCreateParams,
  ClassJoinRequestDecisionParams,
  ClassJoinRequestFilterParams,
  ClassJoinRequestType,
} from "../util/types/classJoinRequest.types";
import { Prisma } from "@prisma/client";

export class ClassJoinRequestPersistence {
  public async createClassJoinRequest(data: ClassJoinRequestCreateParams) {
    // TODO: Implement this method once we have authentication so we can determine the userId of the requester.
    // TODO(?): check if the user already has a join request for the class.
    //return await PrismaSingleton.instance.classJoinRequest.update({
    //});
  }

  public async getJoinRequests(
    type: ClassJoinRequestType,
    paginationParams: PaginationParams,
    filters: ClassJoinRequestFilterParams,
  ) {
    // TODO: check if the requester is a teacher of the class the joinRequests are for.
    // We need to do this to not expose the Prisma.EnumClassRoleFilter<"User"> type to the domain layer.
    let filterByRole: Prisma.UserWhereInput = {};
    if (type === ClassJoinRequestType.STUDENT) {
      filterByRole = { role: "STUDENT" };
    } else if (type === ClassJoinRequestType.TEACHER) {
      filterByRole = { role: "TEACHER" };
    }

    const where: Prisma.ClassJoinRequestWhereInput = {
      AND: [
        filters.id ? { id: filters.id } : {},
        filters.classId ? { classId: filters.classId } : {},
        filters.userId ? { userId: filters.userId } : {},
        { user: filterByRole },
      ],
    };

    const [classJoinRequests, totalCount] =
      await PrismaSingleton.instance.$transaction([
        PrismaSingleton.instance.classJoinRequest.findMany({
          where,
          skip: paginationParams.skip,
          take: paginationParams.pageSize,
        }),
        PrismaSingleton.instance.classJoinRequest.count({
          where,
        }),
      ]);

    return {
      data: classJoinRequests,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async handleJoinRequest(data: ClassJoinRequestDecisionParams) {
    // TODO: check if the requester is a teacher of the class the joinRequest is for.
    if (data.acceptRequest) {
      // Delete the join request.
      const classJoinRequest =
        await PrismaSingleton.instance.classJoinRequest.delete({
          where: {
            id: data.requestId,
          },
        });

      // Add the student/teacher to the class.
      await PrismaSingleton.instance.class.update({
        where: {
          id: classJoinRequest.classId,
        },
        data: {
          students: {
            connect: {
              id: classJoinRequest.userId,
            },
          },
        },
      });
    } else {
      // Delete the join request.
      await PrismaSingleton.instance.classJoinRequest.delete({
        where: {
          id: data.requestId,
        },
      });
    }
  }
}
