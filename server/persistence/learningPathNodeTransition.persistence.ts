import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export class LearningPathNodeTransitionPersistence {

    public async createLearningPathNodeTransition(
        data: any,
        fromNodeId: string,
    ) {

        const transition = await prisma.learningNodeTransition.create({
            data: {
                ...data,
                fromNode: {
                    connect: {
                        id: fromNodeId,
                    },
                },
            },
        });

        return transition;
    }
}