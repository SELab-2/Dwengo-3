import { learningPathNodeTransitionSelectDetail } from '../util/selectInput/select';
import { LearningPathNodeTransitionCreateParams } from '../util/types/learningPathNodeTransition.types';
import { PrismaSingleton } from './prismaSingleton';

export class LearningPathNodeTransitionPersistence {
  public async createLearningPathNodeTransition(data: LearningPathNodeTransitionCreateParams) {
    const { learningPathNodeId, ...rest } = data;
    // Create a transition and connect it from previous to next node
    const transition = await PrismaSingleton.instance.learningNodeTransition.create({
      data: {
        ...rest,
        learningPathNode: {
          connect: { id: data.learningPathNodeId },
        },
      },
      select: learningPathNodeTransitionSelectDetail,
    });
    return transition;
  }
}
