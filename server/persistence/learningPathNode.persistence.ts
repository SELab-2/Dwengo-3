import { PrismaClient } from '@prisma/client';
import { LearningPathNodeJson } from './types';

const prisma = new PrismaClient();


/* This function takes in all the info about a learningPathNode and the learningPathId, creates a new LearningPathNode and connects 
it to the existing learningPath */
export const createLearningPathNodePersistence = async (learningPathNodeJson: LearningPathNodeJson, lp_id: string) => {

    const learningPathNode = await prisma.learningPathNode.create({
        data: {
            instruction: learningPathNodeJson.instruction,
            startNode: learningPathNodeJson.startNode,
            learningPath: {
                connect: { id: lp_id }
            },
            learningObject: {
                connect: { id: learningPathNodeJson.loId }  // learningObject has to exist before this point
            }
        }
    });

    // todo transitions have to be added 


    return learningPathNode;
}