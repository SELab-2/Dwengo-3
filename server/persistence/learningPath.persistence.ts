import { PrismaClient } from '@prisma/client';
import { LearningPathJson, LearningPathNodeJson } from './types';
import { createLearningPathNodePersistence } from './learningPathNode.persistence';
const prisma = new PrismaClient();

export const getLearningPathByIdPersistence = async (id: string) => {
    const learningPath = await prisma.learningPath.findUnique({
        where: {
            id: id
        },
        include: {
            learningPathNodes: true
        }

    });
    return learningPath;
}

export const getAllLearningPathsPersistence = async () => {
    const learningPaths = await prisma.learningPath.findMany({
        include: {
            learningPathNodes: true
        }
    });
    return learningPaths;
}

export const createLearningPathPersistence = async (lpJson: LearningPathJson) => {
    const learningPath = await prisma.learningPath.create({
        data: {
            title: lpJson.title,
            description: lpJson.description,
            hruid: lpJson.hruid,
            language: lpJson.language,
            image: lpJson.image,
            createdAt: lpJson.createdAt,
            updatedAt: lpJson.updatedAt,
        }
    });

    // learningPathNodes have to be created and linked
    lpJson.learningPathNodes.forEach((element: LearningPathNodeJson) => {
        createLearningPathNodePersistence(element, learningPath.id);
    });


    return learningPath; //JSON.stringify(learningPath);
}