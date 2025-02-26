import { PrismaClient } from '@prisma/client';
import { LearningNodeTransitionJson } from './types';

const prisma = new PrismaClient();


// this function takes in all the info about a learningNodeTransition, creates a new LearningNodeTransition and connects it with the existing learningNode
export const createLearningNodeTransitionPersistence = async (learningNodeTransitionJson: LearningNodeTransitionJson) => {

    // todo 
    // eerst moet in de database nextNode optional gemaakt worden.

}
