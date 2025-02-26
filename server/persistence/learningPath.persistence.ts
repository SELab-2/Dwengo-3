import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLearningPathByIdPersistence = async (id: string) => {
    const learningPath = await prisma.learningPath.findUnique({
        where: {
            id: id
        }
    });
    return learningPath;
}

export const getAllLearningPathsPersistence = async () => {
    const learningPaths = await prisma.learningPath.findMany();
    return learningPaths;
}