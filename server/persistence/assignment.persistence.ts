import { Prisma } from '@prisma/client';
import {
  AssignmentCreateParams,
  AssignmentDetail,
  AssignmentFilterParams,
  AssignmentShort2,
  Uuid,
} from '../util/types/assignment.types';
import { PaginationParams } from '../util/types/pagination.types';
import { PrismaSingleton } from './prismaSingleton';
import { searchAndPaginate } from '../util/pagination/pagination.util';

import { NotFoundError } from '../util/types/error.types';
import {
  assignmentSelectDetail,
  assignmentSelectShort2,
  groupSelectShort,
} from '../util/selectInput/select';

export class AssignmentPersistence {
  public async getAssignments(
    filters: AssignmentFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: AssignmentShort2[]; totalPages: number }> {
    const whereClause: Prisma.AssignmentWhereInput = {
      AND: [
        filters.classId
          ? {
              classId: filters.classId,
            }
          : {},
        filters.teacherId
          ? {
              class: {
                teachers: {
                  some: {
                    id: filters.teacherId,
                  },
                },
              },
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
                      id: filters.studentId,
                    },
                  },
                },
              },
              OR: [{ deadline: null }, { deadline: { gt: new Date() } }],
            }
          : {},
      ],
    };
    return searchAndPaginate(
      PrismaSingleton.instance.assignment,
      whereClause,
      paginationParams,
      undefined,
      assignmentSelectShort2,
    );
  }

  public async getAssignmentId(id: Uuid): Promise<AssignmentDetail> {
    const assignment = await PrismaSingleton.instance.assignment.findUnique({
      where: { id: id },
      select: assignmentSelectDetail,
    });

    if (!assignment) {
      throw new NotFoundError(40408);
    }

    return assignment;
  }

  public async createAssignment(params: AssignmentCreateParams): Promise<AssignmentDetail> {
    //create assignment
    const assignment = await PrismaSingleton.instance.assignment.create({
      data: {
        name: params.name,
        description: params.description,
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
        deadline: params.deadline,
      },
      select: assignmentSelectDetail,
    });

    //create groups for the assignment
    return assignment;
  }
}
