import { PrismaSingleton } from "./prismaSingleton";
import { LearningPathNodeCreateParams } from "../domain/types";

export class LearningPathNodePersistence {
  public async createLearningPathNode(
    learningPathNode: LearningPathNodeCreateParams
  ) {
    // create a learningPathNode without transitions and connect it to the learningPath
    const { lpId, loId, ...data } = learningPathNode;
    const createdLearningPathNode =
      await PrismaSingleton.instance.learningPathNode.create({
        data: {
          ...data,
          learningPath: {
            connect: {
              id: lpId,
            },
          },
          learningObject: {
            connect: {
              id: loId,
            },
          },
        },
      });
    return createdLearningPathNode;
  }
}
