import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export class LearningPathNodeTransitionPersistence {

    public async createLearningPathNodeTransition(
        data: any,
    ) {

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