import { Assignment, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAssignmentByIdPersistence = async (id: string) => {
    const assignment = await prisma.assignment.findUnique({
        where: {
            id: id
        }
    });
    return assignment;
}

export const getAllAssignmentsByClassIdPersistence = async (classId: string) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            classId: classId
        }
    });
    return assignments;
}

export const getAllAssignmentsByTeacherIdPersistence = async (teacherId: string) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            teacherId: teacherId
        }
    });
    return assignments;
}

export const getAllAssignmentsByUserIdPersistence = async (userId: string) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            groups: {
                some: {
                    students: {
                        some: {
                            userId: userId
                        }
                    }
                }
            }
        }
    });
    return assignments;
}

export const getAllAssignmentsByGroupIdPersistence = async (groupId: string) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            groups: {
                some: {
                    id: groupId
                }
            }
        }
    });
    return assignments;
}

export const createAssignment = async (groups: string[][], classId: string, teacherId: string, learningPathId: string) => {
    const assignment = await prisma.assignment.create({
        data: {
            classId: classId,
            teacherId: teacherId,
            lpId: learningPathId,
        }
    });
    await prisma.$transaction(groups.map(group =>
            prisma.group.create({
                data: {
                    assignmentId: assignment.id,
                    students: {
                        connect: group.map(student => ({id: student}))
                    }
                }
            })
        )
    );
}