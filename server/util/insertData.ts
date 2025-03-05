import * as dotenv from 'dotenv'
import { PrismaClient, LearningObjectKeyword, ClassJoinRequest, Message, LearningNodeTransition, AssignmentSubmission, User, Student, Teacher, Class, Assignment, LearningPath, LearningPathNode, LearningObject, Chat, Group } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
dotenv.config({ path: "../.env" });

/**
 * Inserts all data from a JSON file into the database in the correct order
 */
async function main() {
    const dataPath = path.join(__dirname, 'data.json')
    
    // Read the data from the JSON file according to this schema
    const data: {
        users: User[],
        students: Student[],
        teachers: Teacher[],
        classes: (Class & {
            students: { id: string }[],
            teachers: { id: string }[],
            assignments: { id: string }[],
            classJoinRequests: { id: string }[],
        })[],
        assignments: (Assignment & {
            groups: { id: string }[],
        })[],
        learningPaths: LearningPath[],
        learningPathNodes: (LearningPathNode & {
            groups: { id: string }[],
            assignmentSubmissions: { id: string }[],
        })[],
        learningObjects: (LearningObject & {
            learningPathNodes: { id: string }[]
        })[],
        assignmentSubmissions: AssignmentSubmission[],
        learningNodeTransitions: LearningNodeTransition[],
        learningObjectKeywords: LearningObjectKeyword[],
        groups: (Group & {
            chat?: string,
            assignmentSubmissions: { id: string }[],
            students: { id: string }[],
        })[],
        classJoinRequests: ClassJoinRequest[],
        chats: (Chat & {
            messages: { id: string }[],
            members: { id: string }[],
        })[],
        messages: Message[]
    } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Insert all users into the database
    await prisma.user.createMany({
        data: data.users
    });

    // Insert all students into the database
    await prisma.student.createMany({
        data: data.students
    });

    // Insert all teachers into the database
    await prisma.teacher.createMany({
        data: data.teachers
    });

    // Insert all classes into the database
    await prisma.class.createMany({
        data: data.classes.map(({ id, name }) => ({ id, name }))
    });

    // Link the students to their respective users
    for (const student of data.students) {
        await prisma.student.update({
            where: { id: student.id },
            data: {
                user: {
                    connect: { id: student.userId }
                }
            }
        });
    }

    // Link the teachers to their respective users
    for (const teacher of data.teachers) {
        await prisma.teacher.update({
            where: { id: teacher.id },
            data: {
                user: {
                    connect: { id: teacher.userId }
                }
            }
        });
    }

    // Link the classes to their respective students and teachers
    for (const classgroup of data.classes) {
        await prisma.class.update({
            where: { id: classgroup.id },
            data: {
                students: {
                    connect: classgroup.students.map(student => ({ id: student.id }))
                },
                teachers: {
                    connect: classgroup.teachers.map(teacher => ({ id: teacher.id }))
                }
            }
        });
    }

    // Insert all learning paths into the database
    await prisma.learningPath.createMany({
        data: data.learningPaths.map(({ id, hruid, language, title, description, image }) => ({ id, hruid, language, title, description, image }))
    });

    // Insert all assignments into the database
    await prisma.assignment.createMany({
        data: data.assignments.map(({ id, lpId, teacherId, classId }) => ({ id, lpId, teacherId, classId }))
    });

    // Insert all learning objects into the database
    await prisma.learningObject.createMany({
        data: data.learningObjects.map(({ id, hruid, uuid, version, language, title, content }) => ({ id, hruid, uuid, version, language, title, content }))
    });

    // Insert all learningPathNodes into the database
    await prisma.learningPathNode.createMany({
        data: data.learningPathNodes.map(({ id, lpId, loId, instruction, startNode }) => ({ id, lpId, loId, instruction, startNode }))
    });

    // Insert all learningNodeTransitions into the database
    await prisma.learningNodeTransition.createMany({
        data: data.learningNodeTransitions
    });

    // Insert all learningObjectKeywords into the database
    await prisma.learningObjectKeyword.createMany({
        data: data.learningObjectKeywords
    });

    // Insert all groups into the database
    await prisma.group.createMany({
        data: data.groups.map(({ id, nodeId, assignmentId }) => ({ id, nodeId, assignmentId }))
    });

    // Insert all classJoinRequests into the database
    await prisma.classJoinRequest.createMany({
        data: data.classJoinRequests
    });

    // Insert all chats into the database
    await prisma.chat.createMany({
        data: data.chats.map(({ id, groupId }) => ({ id, groupId }))
    });

    // Insert all messages into the database
    await prisma.message.createMany({
        data: data.messages
    });

    // Insert all assignmentSubmissions into the database
    await prisma.assignmentSubmission.createMany({
        data: data.assignmentSubmissions
    });

    // Link the groups to their respective students and assignmentSubmissions
    for (const group of data.groups) {
        if (group.students.length > 0) {
            await prisma.group.update({
                where: { id: group.id },
                data: {
                    students: {
                        connect: group.students.map(student => ({ id: student.id }))
                    }
                }
            });
        }

        if (group.assignmentSubmissions.length > 0) {
            await prisma.group.update({
                where: { id: group.id },
                data: {
                    assignmentSubmissions: {
                        connect: group.assignmentSubmissions.map(submission => ({ id: submission.id }))
                    }
                }
            });
        }
    }

    // Link the learningPathNodes to their respective groups and assignmentSubmissions
    for (const node of data.learningPathNodes) {
        if (node.groups.length > 0) {
            await prisma.learningPathNode.update({
                where: { id: node.id },
                data: {
                    groups: {
                        connect: node.groups.map(group => ({ id: group.id }))
                    }
                }
            });
        }

        if (node.assignmentSubmissions.length > 0) {
            await prisma.learningPathNode.update({
                where: { id: node.id },
                data: {
                    assignmentSubmissions: {
                        connect: node.assignmentSubmissions.map(submission => ({ id: submission.id }))
                    }
                }
            });
        }
    }

    // Link the assignemnts to their respective groups
    for (const assignment of data.assignments) {
        if (assignment.groups.length > 0) {
            await prisma.assignment.update({
                where: { id: assignment.id },
                data: {
                    groups: {
                        connect: assignment.groups.map(group => ({ id: group.id }))
                    },
                }
            });
        }
    }

    // Link the learningObjects to their respective learningPathNodes
    for (const learningObject of data.learningObjects) {
        if (learningObject.learningPathNodes.length > 0) {
            await prisma.learningObject.update({
                where: { id: learningObject.id },
                data: {
                    learningPathNodes: {
                        connect: learningObject.learningPathNodes.map(node => ({ id: node.id }))
                    }
                }
            });
        }
    }

    // Link the chats to their respective members
    for (const chat of data.chats) {
        if (chat.members.length > 0) {
            await prisma.chat.update({
                where: { id: chat.id },
                data: {
                    members: {
                        connect: chat.members.map(member => ({ id: member.id }))
                    }
                }
            });
        }
    }
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })