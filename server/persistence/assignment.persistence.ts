import { Assignment, Prisma } from "@prisma/client";
import {
  AssignmentCreateParams,
  AssignmentDetail,
  AssignmentFilterParams,
  AssignmentShort,
  Uuid,
} from "../util/types/assignment.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";
import { searchAndPaginate } from "../util/pagination/pagination.util";

export class AssignmentPersistence {
  private selectInputDetail: Prisma.AssignmentSelect;
  private selectInputShort: Prisma.AssignmentSelect;
  public constructor() {
    this.selectInputDetail = {
      id: true,
      teacherId: true,
      class: {
        select: {
          id: true,
          name: true
        }
      },
      groups: {
        select: {
          id: true,
          nodeId: true, //TODO change to nodeIndex
          assignmentId: true
        }
      },
      learningPath: {
        select: {
          id: true,
          title: true,
          image: true,
          description: true
        }
      }
    };

    this.selectInputShort = {
      id: true,
      learningPathId: true
    }
  }

  public async getAssignments(
    filters: AssignmentFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: AssignmentShort[]; totalPages: number }> {
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
          : {}
      ],
    };
    return searchAndPaginate(PrismaSingleton.instance.assignment, whereClause, paginationParams, undefined, this.selectInputShort);
  }

  public async getAssignmentId(id: Uuid): Promise<AssignmentDetail> {
    return PrismaSingleton.instance.assignment.findUniqueOrThrow({
      where: {id: id},
      select: this.selectInputDetail
    }
    );
  }

  public async createAssignment(
    params: AssignmentCreateParams,
  ): Promise<AssignmentDetail> {
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
            id: params.teacherId!,
          },
        },
        learningPath: {
          connect: {
            id: params.learningPathId,
          },
        },
      },
      select: this.selectInputDetail
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
          },
        }),
      ),
    );
    return assignment;
  }
}
