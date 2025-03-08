import { PrismaClient, LearningObject } from '@prisma/client';
import {  } from '../domain/types';
const prisma = new PrismaClient();

export class LearningObjectKeywordPersistence {

    public async getLearningObjectKeywordsByLoId(loId: string) {
        return await prisma.learningObjectKeyword.findMany({
            where: { 
                loId: loId
            }
        });
    }

    public async createLearningObjectKeyword(data: {loId: string, keyword: string}) {
        return await prisma.learningObjectKeyword.create({
            data: data
        });
    }

    public async deleteLearningObjectKeyword(data: {loId: string, keyword: string}) {
        return await prisma.learningObjectKeyword.delete({
            where: {
                loId_keyword: {
                    loId: data.loId,
                    keyword: data.keyword
                }
            }
        })
    }
}


