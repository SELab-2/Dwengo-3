import { PrismaClient, LearningObject, LearningObjectKeyword } from "@prisma/client";
import { LearningObjectsQuery  } from '../domain/types';

const prisma = new PrismaClient();

export class LearningObjectPersistence {
    public async getLearningObjects(learningPathNodesIncluded: boolean) {
        return await prisma.learningObject.findMany({
            include: {
                learningPathNodes: learningPathNodesIncluded
            }
        });
    }

    public async getLearningObjectById(id: string, learningPathNodesIncluded: boolean) {
        return await prisma.learningObject.findUnique({
            where: { 
                id: id 
            },
            include: {
                learningPathNodes: learningPathNodesIncluded
            }
        });
    }

    public async getLearningObjectsByKeyword(keyword: string, learningPathNodesIncluded: boolean) {
        return await prisma.learningObjectKeyword.findMany({
            where: { 
                keyword: keyword 
            },
            include: {
                learningObject: {
                    include: {
                        learningPathNodes: learningPathNodesIncluded
                    }
                }
            }
        });
    }

    // TODO create

    // TODO update

    // TODO delete
}