import { learningPathNodeSelectDetail } from '../util/selectInput/learningPathNode.select';
import { LearningPathNodeCreateParams } from '../util/types/learningPathNode.types';
import { PrismaSingleton } from './prismaSingleton';
import { NotFoundError } from '../util/types/error.types';

export class LearningPathNodePersistence {
  public async createLearningPathNode(
    learningPathNode: LearningPathNodeCreateParams,
    index: number,
  ) {
    // create a learningPathNode without transitions and connect it to the learningPath
    const { learningPathId, learningObjectId, ...data } = learningPathNode;
    const createdLearningPathNode = await PrismaSingleton.instance.learningPathNode.create({
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
      select: learningPathNodeSelectDetail,
    });
    return createdLearningPathNode;
  }

  public async getLearningPathNodeById(id: string) {
    const learningPathNode = await PrismaSingleton.instance.learningPathNode.findUnique({
      where: { id: id },
      select: learningPathNodeSelectDetail,
    });

    if (!learningPathNode) {
      throw new NotFoundError(40412);
    }

    return learningPathNode;
  }

  public async getLearningPathNodeCount(learningPathId: string) {
    return await PrismaSingleton.instance.learningPathNode.count({
      where: {
        learningPathId: learningPathId,
      },
    });
  }
}
