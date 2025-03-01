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
        learningPathNode: any,
    ) {
        // create a learnigPathNode without transitions and connect it to the learningPath
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