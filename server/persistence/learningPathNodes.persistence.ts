import { PrismaClient } from "@prisma/client";
import { LearningPathNodeCreateParams } from "../domain/types";

const prisma = new PrismaClient();


export class learningPathNodePersistence {

    // function is only called when creating a new learningPath
    public async createLearningPathNode(
        learningPathNode: any, lp_id: string
    ) {
        const { learningPathOutgoingTransitions, loId, ...data } = learningPathNode;
        const createdLearningPathNode = await prisma.learningPathNode.create({
            data: {
                ...data,
                learningPath: {
                    connect: {
                        id: lp_id
                    }
                },
                learningObject: {
                    connect: {
                        id: loId
                    }
                }
            },
        });

        return createdLearningPathNode;
    }
}