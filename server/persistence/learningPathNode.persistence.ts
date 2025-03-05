import { PrismaClient } from "@prisma/client";
import { LearningPathNodeCreateParams } from "../util/types/learningPathNode.types";

const prisma = new PrismaClient();


export class LearningPathNodePersistence {

    public async createLearningPathNode(
        learningPathNode: LearningPathNodeCreateParams,
    ) {
        // create a learningPathNode without transitions and connect it to the learningPath
        const { lpId, loId, ...data } = learningPathNode;
        const createdLearningPathNode = await prisma.learningPathNode.create({
            data: {
                ...data,
                learningPath: {
                    connect: {
                        id: lpId
                    },
                },
                learningObject: {
                    connect: {
                        id: loId
                    },
                },
            },
        });
        return createdLearningPathNode;
    }
}