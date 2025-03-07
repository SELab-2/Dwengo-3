import * as dotenv from 'dotenv'
import { PrismaClient, User, Student, Teacher, Class, Assignment, LearningPath, LearningPathNode, LearningObject, AssignmentSubmission, LearningNodeTransition, LearningObjectKeyword, Group, ClassJoinRequest, Chat, Message } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
dotenv.config({ path: "../.env" });

/**
 * Reads all data from the database and writes it to a JSON file
 */
async function main() {
    const data: { 
        users?: User[],
        students?: Student[],
        teachers?: Teacher[],
        classes?: Class[],
        assignments?: Assignment[],
        learningPaths?: LearningPath[],
        learningPathNodes?: LearningPathNode[],
        learningObjects?: LearningObject[],
        assignmentSubmissions?: AssignmentSubmission[],
        learningNodeTransitions?: LearningNodeTransition[],
        learningObjectKeywords?: LearningObjectKeyword[],
        groups?: Group[],
        classJoinRequests?: ClassJoinRequest[],
        chats?: Chat[],
        messages?: Message[]
    } = {}
    
    data.users = await prisma.user.findMany();
    data.students = await prisma.student.findMany();
    data.teachers = await prisma.teacher.findMany();
    data.classes = await prisma.class.findMany({
        include: {
            students: true,
            teachers: true,
            assignment: true,
            classJoinRequests: true,
        }
    });
    data.assignments = await prisma.assignment.findMany({
        include: {
            groups: true
        }
    });
    data.learningPaths = await prisma.learningPath.findMany();
    data.learningPathNodes = await prisma.learningPathNode.findMany({
        include: {
            groups: true,
            assignmentSubmissions: true,
        }
    });
    data.learningObjects = await prisma.learningObject.findMany({
        include: {
            learningPathNodes: true,
        }
    });
    data.assignmentSubmissions = await prisma.assignmentSubmission.findMany();
    data.learningNodeTransitions = await prisma.learningNodeTransition.findMany();
    data.learningObjectKeywords = await prisma.learningObjectKeyword.findMany();
    data.groups = await prisma.group.findMany({
        include: {
            chat: true,
            students: true,
            assignmentSubmissions: true,
        }
    });
    data.classJoinRequests = await prisma.classJoinRequest.findMany();
    data.chats = await prisma.chat.findMany({
        include: {
            messages: true,
            members: true,
        }
    });
    data.messages = await prisma.message.findMany();
    
    const jsonData = JSON.stringify(data, null, 2);
    const outputPath = path.join(__dirname, 'current_data.json');
    fs.writeFileSync(outputPath, jsonData);
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })