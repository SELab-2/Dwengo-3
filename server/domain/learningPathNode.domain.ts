import { LearningPathNodePersistence } from '../persistence/learningPathNode.persistence';
import {
  LearningPathNodeCreateParams,
  LearningPathNodeCreateSchema,
} from '../util/types/learningPathNode.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';

export class LearningPathNodeDomain {
  private learningPathNodePersistence;

  constructor() {
    this.learningPathNodePersistence = new LearningPathNodePersistence();
  }

  public async createLearningPathNode(
    body: LearningPathNodeCreateParams,
    user: UserEntity,
  ) {
    const parseResult = LearningPathNodeCreateSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    // TODO: CHECK if teacher is owner of the path!!!
    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error('User must be a teacher to create a learning path.');
    }
    return this.learningPathNodePersistence.createLearningPathNode(
      parseResult.data,
      await this.learningPathNodePersistence.getLearningPathNodeCount(
        parseResult.data,
      ),
    );
  }

  public async getLearningPathNodeById(id: string) {
    return this.learningPathNodePersistence.getLearningPathNodeById(id);
  }
}
