import { Assignment, LearningObject, LearningPathNode, Prisma, PrismaClient } from '@prisma/client';
import { AssignmentCreateParams, AssignmentFilterParams, PaginationParams, Uuid } from '../domain/types';

export class AssignmentPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAssignments(
        filters: AssignmentFilterParams,
        paginationParams: PaginationParams
    ): Promise<{data: Assignment[], totalPages: number}> {
        const whereClause: Prisma.AssignmentWhereInput = {
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
                    filters.id
                        ? {
                            id: filters.id
                        } : {},
            ]
        };

        const [assignments, totalcount] = await this.prisma.$transaction([
            this.prisma.assignment.findMany({
                where: whereClause,
                skip: paginationParams.skip,
                take: paginationParams.pageSize
            }),
            this.prisma.assignment.count({
                where: whereClause
            })
        ]);
        return {
            data: assignments,
            totalPages: Math.ceil(totalcount / paginationParams.pageSize)
        };
    }

    public async createAssignment(params: AssignmentCreateParams): Promise<Assignment> {
        //create assignment
        const assignment = await this.prisma.assignment.create({
            data: {
                class: {
                    connect: {
                        id: params.classId
                    }
                },
                teacher: {
                    connect: {
                        id: params.teacherId
                    }
                },
                learningPath: {
                    connect: {
                        id: params.learningPathId
                    }
                }
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
        //create groups for the assignment and save the ids for creating assignment submissions
        const groupIds = await this.prisma.$transaction(params.groups.map((group: Uuid[]) =>
                this.prisma.group.create({
                    data: {
                        assignment: {
                            connect: {
                                id: assignment.id
                            }
                        },
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
        //create an assignment submission for every group and node of the learning path that accecpt submissions
        const submissions: any = [];
        assignment.learningPath.learningPathNodes.forEach((node: LearningPathNode & {learningObject: LearningObject}) => {
            if (node.learningObject.canUploadSubmission) {
                groupIds.forEach((group: {id: string}) => {
                    submissions.push(this.prisma.assignmentSubmission.create({
                        data: {
                            node: {
                                connect: {
                                    id: node.id
                                }
                            },
                            group: {
                                connect: {
                                    id: group.id
                                }
                            }
                        }
                    }));
                });
            }
        });
        this.prisma.$transaction(submissions);
        return assignment;
    }
}