import { AssignmentSubmission, Prisma, PrismaClient } from "@prisma/client";
import {
  AssignmentSubCreateParams,
  AssignmentSubFilterParams,
  AssignmentSubmissionDetail,
  AssignmentSubmissionShort,
  AssignmentSubUpdateParams,
} from "../util/types/assignmentSubmission.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";
import { searchAndPaginate } from "../util/pagination/pagination.util";
import { Uuid } from "../util/types/assignment.types";

export class AssignmentSubmissionPersistence {
  private selectInputDetail: Prisma.AssignmentSubmissionSelect;
  private selectInputShort: Prisma.AssignmentSubmissionSelect;

  public constructor() {
    this.selectInputDetail = {
      id: true,
      submission: true,
      group: {
        select: {
          id: true,
          nodeId: true, //TODO change to nodeIndex
          assignmentId: true
        }
      },
      node: {
        select: {
          id: true,
          learningObject: {
            select: {
              id: true,
              title: true,
              language: true,
              estimatedTime: true,
              targetAges: true
            }
          }
        }
      }
    };
    this.selectInputShort = {
      id: true
    }
  }

  public async getAssignmentSubmissions(
    filters: AssignmentSubFilterParams,
    paginationParams: PaginationParams,
  ): Promise<{ data: AssignmentSubmissionShort[]; totalPages: number }> {
    const whereClause: Prisma.AssignmentSubmissionWhereInput = {
      AND: [
        filters.groupId ? { groupId: filters.groupId } : {},
        filters.nodeId ? { nodeId: filters.nodeId } : {},
      ],
    };
    return searchAndPaginate(PrismaSingleton.instance.assignmentSubmission, whereClause, paginationParams, undefined, this.selectInputShort);
  }

  public async getAssignmentSubmissionById(id: Uuid): Promise<AssignmentSubmissionDetail> {
    return PrismaSingleton.instance.assignmentSubmission.findFirstOrThrow({
      where: {id: id},
      select: this.selectInputDetail
    });
  }

  public async createAssignmentSubmission(
    params: AssignmentSubCreateParams,
  ): Promise<AssignmentSubmissionDetail> {
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
        submission: params.submission!,
      },
      select: {
        id: true,
        submission: true,
        group: {
          select: {
            id: true,
            nodeId: true, //TODO change to nodeIndex
            assignmentId: true
          }
        },
        node: {
          select: {
            id: true,
            learningObject: {
              select: {
                id: true,
                title: true,
                language: true,
                estimatedTime: true,
                targetAges: true
              }
            }
          }
        }
      }
    });
  }

  public async updateAssignmentSubmission(
    params: AssignmentSubUpdateParams,
  ): Promise<AssignmentSubmissionDetail> {
    return PrismaSingleton.instance.assignmentSubmission.update({
      where: {
        id: params.id,
      },
      data: {
        submissionType: params.submissionType,
        submission: params.submission!,
      },
      select: this.selectInputDetail
    });
  }
}
