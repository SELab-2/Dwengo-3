import { Assignment, LearningObject, LearningPathNode, PrismaClient } from '@prisma/client';
import { AssignmentCreateParams, AssignmentFilterParams, Uuid } from './types';
import { AssignmentSubmissionDomain } from '../domain_layer/assignmentSubmission.domain';

export class AssignmentPersistence {
    private prisma: PrismaClient;
    private assignementSubDomain: AssignmentSubmissionDomain; 

    public constructor() {
        this.prisma = new PrismaClient();
        this.assignementSubDomain = new AssignmentSubmissionDomain();
    }

    public async getAssignmentById(id: Uuid): Promise<Assignment | null> {
        const assignment = this.prisma.assignment.findUnique({
            where: {
                id: id
            }
        });
        return assignment;
    }

    public async getAssignments(filters: AssignmentFilterParams): Promise<Assignment[]> {
        const assignments = this.prisma.assignment.findMany({
            where: {
                AND: [
                    filters.classId
                        ? {
                            classId: filters.classId
                        }
                        : {},
                    filters.teacherId
                        ? {
                            teacherId: filters.teacherId
                        }
                        : {},
                    filters.groupId
                        ? {
                            groups: {
                                some: {
                                    id: filters.groupId
                                }
                            }
                        }
                        : {},
                    filters.studentId
                        ? {
                            groups: {
                                some: {
                                    students: {
                                        some: {
                                            userId: filters.studentId
                                        }
                                    }
                                }
                            }
                        }
                        : {},
            ]
        }});
        return assignments;
    }

    public async createAssignment(params: AssignmentCreateParams): Promise<Assignment> {
        const assignment = await this.prisma.assignment.create({
            data: {
                classId: params.classId,
                teacherId: params.teacherId,
                lpId: params.learningPathId,
            },
            include: {
                learningPath: {
                    include: {
                        learningPathNodes: {
                            include: {
                                learningObject: true
                            }
                        }
                    }
                }
            }
        });
        const groupIds = await this.prisma.$transaction(params.groups.map((group: Uuid[]) =>
                this.prisma.group.create({
                    data: {
                        assignmentId: assignment.id,
                        students: {
                            connect: group.map((student: Uuid) => ({id: student}))
                        }
                    },
                    select:{
                        id: true
                    }
                })
            )
        );
        const submissions: any = [];
        assignment.learningPath.learningPathNodes.forEach((node: LearningPathNode & {learningObject: LearningObject}) => {
            if (node.learningObject.canUploadSubmission) {
                groupIds.forEach((group: {id: string}) => {
                    submissions.push(this.assignementSubDomain.createAssignmentSubmission({
                        nodeId: node.learningObject.id,
                        groupId: group.id
                    }));
                });
            }
        });
        await this.prisma.$transaction(submissions);
        return assignment;
    }
}