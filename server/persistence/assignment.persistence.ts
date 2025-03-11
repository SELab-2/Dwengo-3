import {
  Assignment,
  Prisma,
} from "@prisma/client";
import {
  AssignmentCreateParams,
  AssignmentFilterParams,
  Uuid,
} from "../util/types/assignment.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";

export class AssignmentPersistence {
  public async getAssignments(
    filters: AssignmentFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: Assignment[]; totalPages: number }> {
    const whereClause: Prisma.AssignmentWhereInput = {
      AND: [
        filters.classId
          ? {
              classId: filters.classId,
            }
          : {},
        filters.teacherId
          ? {
              teacherId: filters.teacherId,
            }
          : {},
        filters.groupId
          ? {
              groups: {
                some: {
                  id: filters.groupId,
                },
              },
            }
          : {},
        filters.studentId
          ? {
              groups: {
                some: {
                  students: {
                    some: {
                      userId: filters.studentId,
                    },
                  },
                },
              },
            }
          : {},
        filters.id
          ? {
              id: filters.id,
            }
          : {},
      ],
    };

    const [assignments, totalcount] =
      await PrismaSingleton.instance.$transaction([
        PrismaSingleton.instance.assignment.findMany({
          where: whereClause,
          skip: paginationParams.skip,
          take: paginationParams.pageSize,
        }),
        PrismaSingleton.instance.assignment.count({
          where: whereClause,
        }),
      ]);
    return {
      data: assignments,
      totalPages: Math.ceil(totalcount / paginationParams.pageSize),
    };
  }

  public async createAssignment(
    params: AssignmentCreateParams,
  ): Promise<Assignment> {
    //create assignment
    const assignment = await PrismaSingleton.instance.assignment.create({
      data: {
        class: {
          connect: {
            id: params.classId,
          },
        },
        teacher: {
          connect: {
            id: params.teacherId,
          },
        },
        learningPath: {
          connect: {
            id: params.learningPathId,
          },
        },
      },
    });
    //create groups for the assignment
    await PrismaSingleton.instance.$transaction(
      params.groups.map((group: Uuid[]) =>
        PrismaSingleton.instance.group.create({
          data: {
            assignment: {
              connect: {
                id: assignment.id,
              },
            },
            students: {
              connect: group.map((student: Uuid) => ({ id: student })),
            },
          }
        }),
      ),
    );
    return assignment;
  }
}
