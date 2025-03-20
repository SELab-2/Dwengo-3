import { LearningPathNodeCreateParams } from '../util/types/learningPathNode.types';
import { PrismaSingleton } from './prismaSingleton';

export class LearningPathNodePersistence {
  public async createLearningPathNode(
    learningPathNode: LearningPathNodeCreateParams,
    index: number,
  ) {
    // create a learningPathNode without transitions and connect it to the learningPath
    const { learningPathId, learningObjectId, ...data } = learningPathNode;
    const createdLearningPathNode =
      await PrismaSingleton.instance.learningPathNode.create({
        data: {
          ...data,
          index,
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

  public async getLearningPathNodeById(id: string) {
    const learningPathNode =
      await PrismaSingleton.instance.learningPathNode.findUnique({
        where: { id: id },
        include: {
          transitions: true,
        },
      });

    if (!learningPathNode) {
      throw new Error(`LearningPathNode with id: ${id} was not found`);
    }

    return learningPathNode;
  }

  public async getLearningPathNodeCount(
    learningPathNode: LearningPathNodeCreateParams,
  ) {
    const { learningPathId, learningObjectId, ..._ } = learningPathNode;
    return await PrismaSingleton.instance.learningPathNode.count({
      where: {
        learningPathId: learningPathId,
      },
    });
  }
}
