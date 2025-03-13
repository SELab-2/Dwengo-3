import { PrismaClient } from "@prisma/client";
import { LearningPathNodeCreateParams } from "../util/types/learningPathNode.types";
import { PrismaSingleton } from "./prismaSingleton";

export class LearningPathNodePersistence {
  public async createLearningPathNode(
    learningPathNode: LearningPathNodeCreateParams,
  ) {
    // create a learningPathNode without transitions and connect it to the learningPath
    const { learningPathId, learningObjectId, ...data } = learningPathNode;
    const createdLearningPathNode =
      await PrismaSingleton.instance.learningPathNode.create({
        data: {
          ...data,
          learningPath: {
            connect: {
              id: learningPathId,
            },
          },
          learningObject: {
            connect: {
              id: learningObjectId,
            },
          },
        },
      });
    return createdLearningPathNode;
  }
}
