import { LearningPathNodePersistence } from '../persistence/learningPathNode.persistence';
import {
  LearningPathNodeCreateParams,
  LearningPathNodeCreateSchema,
} from '../util/types/learningPathNode.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';

export class LearningPathNodeDomain {
  private learningPathNodePersistence;

  constructor() {
    this.learningPathNodePersistence = new LearningPathNodePersistence();
  }

  public async createLearningPathNode(body: LearningPathNodeCreateParams, user: UserEntity) {
    const data = LearningPathNodeCreateSchema.parse(body);

    // TODO: CHECK if teacher is owner of the path!!!
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40009);
    }
    return this.learningPathNodePersistence.createLearningPathNode(
      data,
      await this.learningPathNodePersistence.getLearningPathNodeCount(data.learningPathId),
    );
  }

  public async getLearningPathNodeById(id: string) {
    return this.learningPathNodePersistence.getLearningPathNodeById(id);
  }
}
