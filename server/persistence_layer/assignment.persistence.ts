import { Assignment, PrismaClient } from '@prisma/client';
import { AssignmentCreateParams, AssignmentFilterParams } from './types';

export class AssignmentPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAssignmentById(id: string): Promise<Assignment | null> {
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
            }
        });
        await this.prisma.$transaction(params.groups.map(group =>
                this.prisma.group.create({
                    data: {
                        assignmentId: assignment.id,
                        students: {
                            connect: group.map(student => ({id: student}))
                        }
                    }
                })
            )
        );
        return assignment;
    }
}