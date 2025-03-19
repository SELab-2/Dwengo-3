import { AssignmentSubmission, Prisma, PrismaClient } from '@prisma/client';
import {
  AssignmentSubCreateParams,
  AssignmentSubFilterParams,
  AssignmentSubUpdateParams,
} from '../util/types/assignmentSubmission.types';
import { PaginationParams } from '../util/types/pagination.types';
import { PrismaSingleton } from './prismaSingleton';

export class AssignmentSubmissionPersistence {
  public async getAssignmentSubmissions(
    filters: AssignmentSubFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: AssignmentSubmission[]; totalPages: number }> {
    const whereClause: Prisma.AssignmentSubmissionWhereInput = {
      AND: [
        filters.groupId ? { groupId: filters.groupId } : {},
        filters.nodeId ? { nodeId: filters.nodeId } : {},
        filters.id ? { id: filters.id } : {},
      ],
    };

    const [assignmentsSubs, totalCount] =
      await PrismaSingleton.instance.$transaction([
        PrismaSingleton.instance.assignmentSubmission.findMany({
          where: whereClause,
          skip: paginationParams.skip,
          take: paginationParams.pageSize,
        }),
        PrismaSingleton.instance.assignmentSubmission.count({
          where: whereClause,
        }),
      ]);
    return {
      data: assignmentsSubs,
      totalPages: Math.ceil(totalCount / paginationParams.pageSize),
    };
  }

  public async createAssignmentSubmission(
    params: AssignmentSubCreateParams,
  ): Promise<AssignmentSubmission> {
    return PrismaSingleton.instance.assignmentSubmission.create({
      data: {
        node: {
          connect: {
            id: params.nodeId,
          },
        },
        group: {
          connect: {
            id: params.groupId,
          },
        },
        submissionType: params.submissionType,
        submission: params.submission,
      },
    });
  }

  public async updateAssignmentSubmission(
    params: AssignmentSubUpdateParams,
  ): Promise<AssignmentSubmission> {
    return PrismaSingleton.instance.assignmentSubmission.update({
      where: {
        id: params.id,
      },
      data: {
        submissionType: params.submissionType,
        submission: params.submission,
      },
    });
  }
}
