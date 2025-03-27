import { PrismaSingleton } from './prismaSingleton';
import { PaginationParams } from '../util/types/pagination.types';
import {
  ClassJoinRequestCreateParams,
  ClassJoinRequestDecisionParams,
  ClassJoinRequestFilterParams,
} from '../util/types/classJoinRequest.types';
import { Prisma } from '@prisma/client';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { classJoinRequestSelectDetail } from '../util/selectInput/classJoinRequest.select';
import { searchAndPaginate } from '../util/pagination/pagination.util';

export class ClassJoinRequestPersistence {
  public async createClassJoinRequest(data: ClassJoinRequestCreateParams, user: UserEntity) {
    return PrismaSingleton.instance.classJoinRequest.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        class: {
          connect: {
            id: data.classId,
          },
        },
      },
      select: classJoinRequestSelectDetail,
    });
  }

  public async checkIfJoinRequestExists(classId: string, userId: string): Promise<boolean> {
    const existingRequest = await PrismaSingleton.instance.classJoinRequest.findFirst({
      where: {
        classId,
        userId,
      },
      select: classJoinRequestSelectDetail,
    });

    return !!existingRequest;
  }

  public async getJoinRequests(
    paginationParams: PaginationParams,
    filters: ClassJoinRequestFilterParams,
    user: UserEntity,
  ) {
    // We need to do this to not expose the Prisma.EnumClassRoleFilter<"User"> type to the domain layer.
    let filterByRole: Prisma.UserWhereInput = {};
    if (user.role === ClassRoleEnum.STUDENT) {
      filterByRole = { role: 'STUDENT' };
    } else {
      filterByRole = { role: 'TEACHER' };
    }

    const where: Prisma.ClassJoinRequestWhereInput = {
      AND: [
        filters.classId ? { classId: filters.classId } : {},
        filters.userId ? { userId: filters.userId } : {},
        { user: filterByRole },
      ],
    };

    return searchAndPaginate(
      PrismaSingleton.instance.classJoinRequest,
      where,
      paginationParams,
      undefined,
      classJoinRequestSelectDetail,
    );
  }

  public async handleJoinRequest(data: ClassJoinRequestDecisionParams) {
    if (data.acceptRequest) {
      // Delete the join request.
      const classJoinRequest = await PrismaSingleton.instance.classJoinRequest.delete({
        where: {
          id: data.requestId,
        },
      });

      // Add the student/teacher to the class.
      await PrismaSingleton.instance.student.update({
        where: {
          userId: classJoinRequest.userId,
        },
        data: {
          classes: {
            connect: {
              id: classJoinRequest.classId,
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

  public async isTeacherOfClassFromRequest(classJoinRequestId: string, userId: string) {
    const classJoinRequest = await PrismaSingleton.instance.classJoinRequest.findFirst({
      where: {
        id: classJoinRequestId,
      },
      include: {
        class: {
          include: {
            teachers: true,
          },
        },
      },
    });

    if (!classJoinRequest) {
      return false;
    }

    return classJoinRequest.class.teachers.some((teacher) => teacher.userId === userId);
  }
}
