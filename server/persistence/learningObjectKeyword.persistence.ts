import { PrismaClient, LearningObject } from '@prisma/client';
import {  } from '../domain/types';
const prisma = new PrismaClient();

export class LearningObjectKeywordPersistence {
    public async getLearningObjectKeywords() {
        return await prisma.learningObjectKeyword.findMany();
    }

    public async getLearningObjectKeywordsByLoId(loId: string) {
        return await prisma.learningObjectKeyword.findMany({
            where: { 
                loId: loId
            }
        });
    }

    // TODO create

    // TODO update

    // TODO delete
}


