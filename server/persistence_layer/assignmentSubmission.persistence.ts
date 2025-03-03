import { AssignmentSubmission, PrismaClient } from "@prisma/client";
import { AssignmentSubParams, AssignmentSubUpdataParams, Uuid } from "./types";

export class AssignmentSubmissionPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAssignmentSubmission(params: AssignmentSubParams): Promise<AssignmentSubmission | null> {
        return this.prisma.assignmentSubmission.findUnique({
            where: {
                groupId_nodeId : {
                    groupId: params.groupId,
                    nodeId: params.nodeId
                }
            }
        });
    }

    public async createAssignmentSubmission(params: AssignmentSubParams): Promise<AssignmentSubmission> {
        return this.prisma.assignmentSubmission.create({
            data: {
                groupId: params.groupId,
                nodeId: params.nodeId
            }
        });
    }
    
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