import { LearningPathNodePersistence } from "../persistence/learningPathNode.persistence";
import {
  LearningPathNodeCreateParams,
  LearningPathNodeCreateSchema,
} from "../util/types/learningPathNode.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class LearningPathNodeDomain {
  private learningPathNodePersistence;

  constructor() {
    this.learningPathNodePersistence = new LearningPathNodePersistence();
  }

  public async createLearningPathNode(
    query: LearningPathNodeCreateParams,
    user: UserEntity,
  ) {
    const parseResult = LearningPathNodeCreateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error("User must be a teacher to create a learning path.");
    }
    return this.learningPathNodePersistence.createLearningPathNode(
      parseResult.data,
    );
  }
}
