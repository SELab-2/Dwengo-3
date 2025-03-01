import { PrismaClient } from "@prisma/client";
import { LearningPathNodeCreateParams } from "../domain/types";
import { LearningPathNodeTransitionPersistence } from "./learningPathNodeTransition.persistence";

const prisma = new PrismaClient();


export class LearningPathNodePersistence {
    private learningPathNodeTransitionPersistence;

    constructor() {
        this.learningPathNodeTransitionPersistence = new LearningPathNodeTransitionPersistence();
    }


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

        // create the outgoing transitions
        await Promise.all(
            learningPathOutgoingTransitions.map(async (transition: any) => {
                this.learningPathNodeTransitionPersistence.createLearningPathNodeTransition(transition, createdLearningPathNode.id);
            }
            ));

        return createdLearningPathNode;
    }
}