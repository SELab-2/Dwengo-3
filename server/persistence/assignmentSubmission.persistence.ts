import { Prisma, SubmissionType } from '@prisma/client';
import {
  AssignmentSubCreateParams,
  AssignmentSubFilterParams,
  AssignmentSubmissionShort,
  AssignmentSubUpdateParams,
  FileSubmission,
} from '../util/types/assignmentSubmission.types';
import { PaginationParams } from '../util/types/pagination.types';
import { PrismaSingleton } from './prismaSingleton';
import { searchAndPaginate } from '../util/pagination/pagination.util';
import { Uuid } from '../util/types/assignment.types';

import { NotFoundError } from '../util/types/error.types';
import {
  assignmentSubmissionSelectShort,
  assignmentSubmissionSelectDetail,
} from '../util/selectInput/select';
import fs from 'fs';

export class AssignmentSubmissionPersistence {
  public async getAssignmentSubmissions(
    filters: AssignmentSubFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: AssignmentSubmissionShort[]; totalPages: number }> {
    const whereClause: Prisma.AssignmentSubmissionWhereInput = {
      AND: [
        filters.groupId ? { groupId: filters.groupId } : {},
        filters.nodeId ? { nodeId: filters.nodeId } : {},
        filters.favoriteId ? { favoriteId: filters.favoriteId } : {},
      ],
    };
    return await searchAndPaginate(
      PrismaSingleton.instance.assignmentSubmission,
      whereClause,
      paginationParams,
      undefined,
      assignmentSubmissionSelectShort,
    );
  }

  public async getAssignmentSubmissionById(id: Uuid) {
    const assignmentsubmission = await PrismaSingleton.instance.assignmentSubmission.findUnique({
      where: { id: id },
      select: assignmentSubmissionSelectDetail,
    });

    if (!assignmentsubmission) {
      throw new NotFoundError(40406);
    }

    return assignmentsubmission;
  }

  public async createAssignmentSubmission(params: AssignmentSubCreateParams) {
    if (params.groupId) {
      return await PrismaSingleton.instance.assignmentSubmission.create({
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
          submission: params.submission!,
        },
        select: assignmentSubmissionSelectDetail,
      });
    } else {
      return await PrismaSingleton.instance.assignmentSubmission.create({
        data: {
          node: {
            connect: {
              id: params.nodeId,
            },
          },
          favorite: {
            connect: {
              id: params.favoriteId,
            },
          },
          submissionType: params.submissionType,
          submission: params.submission!,
        },
        select: assignmentSubmissionSelectDetail,
      });
    }
  }

  public async updateAssignmentSubmission(id: string, params: AssignmentSubUpdateParams) {
    return await PrismaSingleton.instance.assignmentSubmission.update({
      where: {
        id: id,
      },
      data: {
        submissionType: params.submissionType,
        submission: params.submission,
      },
      select: assignmentSubmissionSelectDetail,
    });
  }

  public async deleteAssignmentSubmissions(
    {groupId, favoriteId} : {groupId?: string, favoriteId?: string}
  ) {
    const submissions = await PrismaSingleton.instance.assignmentSubmission.findMany({
          where: {
            groupId: groupId,
            favoriteId: favoriteId
          }
    });

    for (const submission of submissions) {
      if (submission.submissionType === SubmissionType.FILE) {
        const filePath = (submission.submission as FileSubmission).filePath;
        fs.unlink(filePath, (_) => {});
      }
      await PrismaSingleton.instance.assignmentSubmission.delete({
        where: { id: submission.id}
      });
    }
  }
}
