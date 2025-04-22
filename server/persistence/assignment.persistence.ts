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
import {
  assignmentSelectDetail,
  assignmentSelectShort2,
} from '../util/selectInput/assignment.select';
import { NotFoundError } from '../util/types/error.types';

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
                      id: filters.studentId,
                    },
                  },
                },
              },
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
      select: assignmentSelectDetail,
    });

    // TODO: the following should be in group.persistence.ts, and should be called from assignment.domain.ts
    // TODO: maybe we should name 'group' according to the language of the request.
    //create groups for the assignment
    await PrismaSingleton.instance.$transaction(
      params.groups.map((group: Uuid[], index: number) =>
        PrismaSingleton.instance.group.create({
          data: {
            name: `Group ${index + 1}`,
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
