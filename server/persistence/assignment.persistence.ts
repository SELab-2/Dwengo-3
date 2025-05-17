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
import { GroupPersistence } from './group.persistence';
import { AssignmentSubmissionPersistence } from './assignmentSubmission.persistence';

export class AssignmentPersistence {
  private submissionPersistence: AssignmentSubmissionPersistence;

  public constructor() {
    this.submissionPersistence = new AssignmentSubmissionPersistence();
  }

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
              deadline: { gt: new Date() },
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

    // TODO: the following should be in group.persistence.ts, and should be called from assignment.domain.ts
    // TODO: maybe we should name 'group' according to the language of the request.
    //create groups for the assignment
    const groups = await PrismaSingleton.instance.$transaction(
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
          select: groupSelectShort,
        }),
      ),
    );
    assignment.groups = groups;
    return assignment;
  }

  public async deleteTeacherFromAssignment(teacherId: string, assignmentId: string) {
    const assignment = await this.getAssignmentId(assignmentId);
    const teachers = (await PrismaSingleton.instance.class.findUnique({
      where: { id: assignment.class.id },
      include: {
        teachers: {
          where: {
            NOT: { id: teacherId },
          },
        },
      },
    }))!.teachers;
    if (teachers.length == 0) {
      for (const group of assignment.groups) {
        await this.submissionPersistence.deleteAssignmentSubmissions({ groupId: group.id });
      }
      await PrismaSingleton.instance.group.deleteMany({
        where: { assignmentId: assignmentId },
      });
      await PrismaSingleton.instance.assignment.delete({
        where: { id: assignmentId },
      });
    } else {
      await PrismaSingleton.instance.assignment.update({
        where: { id: assignmentId },
        data: {
          teacher: {
            connect: { id: teachers[0].id },
          },
        },
      });
    }
  }
}
