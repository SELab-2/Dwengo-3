import { LearningPathNodeTransitionPersistence } from '../persistence/learningPathNodeTransition.persistence';
import {
  LearningPathNodeTransitionCreateParams,
  LearningPathNodeTransitionCreateSchema,
} from '../util/types/learningPathNodeTransition.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';

export class LearningPathNodeTransitionDomain {
  private learningPathNodeTransitionPersistence;

  constructor() {
    this.learningPathNodeTransitionPersistence = new LearningPathNodeTransitionPersistence();
  }

  public async createLearningPathNodeTransition(
    body: LearningPathNodeTransitionCreateParams,
    user: UserEntity,
  ) {
    const data = LearningPathNodeTransitionCreateSchema.parse(body);

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40009);
    }
    return this.learningPathNodeTransitionPersistence.createLearningPathNodeTransition(data);
  }
}
