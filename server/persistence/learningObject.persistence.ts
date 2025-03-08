import { PrismaClient } from "@prisma/client";
import { LearningObjectUpdateWithoutKeywords, LearningObjectWithoutKeywords } from "../domain/types";

const prisma = new PrismaClient();

export class LearningObjectPersistence {

    public async getLearningObjectById(id: string) {
        return await prisma.learningObject.findUnique({
            where: { 
                id: id 
            },
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

    public async createLearningObject(data: LearningObjectWithoutKeywords) {
        const learningObject = await prisma.learningObject.create({
            data: data,
        });
        return learningObject;
    }

    public async updateLearningObject(id: string, data: LearningObjectUpdateWithoutKeywords) {
        return await prisma.learningObject.update({
            where: {id: id},
            data: data
        });
    }

    public async deleteLearningObject(id: string) {
        return await prisma.learningNodeTransition.delete({
            where: {
                id: id,
            }
        })
    }
}