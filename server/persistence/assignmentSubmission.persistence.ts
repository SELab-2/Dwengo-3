import { AssignmentSubmission, Prisma, PrismaClient } from "@prisma/client";
import { AssignmentSubFilterParams, AssignmentSubUpdataParams, PaginationParams, Uuid } from "../domain/types";

export class AssignmentSubmissionPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAssignmentSubmission(
        filters: AssignmentSubFilterParams,
        paginationParams: PaginationParams
    ): Promise<{data: AssignmentSubmission[], totalPages: number}> {
        const whereClause: Prisma.AssignmentSubmissionWhereInput = {
            AND: [
                filters.groupId ? { groupId: filters.groupId } : {},
                filters.nodeId ? {nodeId: filters.nodeId} : {},
                filters.id ? {id: filters.id} : {}
            ]
        }

        const [assignmentsSubs, totalCount] = await this.prisma.$transaction([
            this.prisma.assignmentSubmission.findMany({
                where: whereClause,
                skip: paginationParams.skip,
                take: paginationParams.pageSize
            }
            ),
            this.prisma.assignmentSubmission.count({
                where: whereClause
            })
        ]);
        return {
            data: assignmentsSubs,
            totalPages: Math.ceil(totalCount / paginationParams.pageSize)
        };
    }

    /*
    public async createAssignmentSubmission(params: AssignmentSubParams): Promise<AssignmentSubmission> {
        return this.prisma.assignmentSubmission.create({
            data: {
                groupId: params.groupId,
                nodeId: params.nodeId
            }
        });
    }
    */
    
    public async updateAssignmentSubmission(params: AssignmentSubUpdataParams): Promise<AssignmentSubmission> {
        return this.prisma.assignmentSubmission.update({
            where: {
                groupId_nodeId: {
                    groupId: params.groupId,
                    nodeId: params.nodeId
                }
            },
            data: {
                submissionType: params.submissionType,
                submission: params.submission
            }
        })
    }
}