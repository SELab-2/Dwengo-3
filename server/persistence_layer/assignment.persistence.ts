import { Assignment, PrismaClient } from '@prisma/client';
import { AssignmentJson, AssignmentFilterParams } from './types';

export class AssignmentPersistence {
    private prisma: PrismaClient;

    public constructor() {
        this.prisma = new PrismaClient();
    }

    public async getAssignmentById(id: string): Promise<Assignment | null> {
        const assignment = await this.prisma.assignment.findUnique({
            where: {
                id: id
            }
        });
        return assignment;
    }

    public async getAssignments(filters: AssignmentFilterParams): Promise<Assignment[]> {
        const assignments = await this.prisma.assignment.findMany({
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

    public async createAssignment(assignmentJson: AssignmentJson): Promise<Assignment> {
        const assignment = await this.prisma.assignment.create({
            data: {
                classId: assignmentJson.classId,
                teacherId: assignmentJson.teacherId,
                lpId: assignmentJson.learningPathId,
            }
        });
        await this.prisma.$transaction(assignmentJson.groups.map(group =>
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