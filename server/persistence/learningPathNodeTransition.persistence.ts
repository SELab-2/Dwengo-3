import { PrismaClient } from "@prisma/client";
import { LearningPathNodeTransitionCreateParams } from "../util/types/learningPathNodeTransition.types";


const prisma = new PrismaClient();

export class LearningPathNodeTransitionPersistence {

    public async createLearningPathNodeTransition(
        data: LearningPathNodeTransitionCreateParams,
    ) {
        // Create a transition and connect it from previous to next node

        const { fromNodeId, toNodeId, ...transitionData } = data;
        const transition = await prisma.learningNodeTransition.create({
            data: {
                ...transitionData,
                fromNode: {
                    connect: {
                        id: fromNodeId,
                    },
                },
                nextNode: {
                    connect: {
                        id: toNodeId,
                    },
                },
            },
        });
        return transition;
    }
}