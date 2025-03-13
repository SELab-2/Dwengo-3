import { LearningPathNodeTransitionPersistence } from "../persistence/learningPathNodeTransition.persistence";
import {
  LearningPathNodeTransitionCreateParams,
  LearningPathNodeTransitionCreateSchema,
} from "../util/types/learningPathNodeTransition.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class LearningPathNodeTransitionDomain {
  private learningPathNodeTransitionPersistence;

  constructor() {
    this.learningPathNodeTransitionPersistence =
      new LearningPathNodeTransitionPersistence();
  }

  public async createLearningPathNodeTransition(
    body: LearningPathNodeTransitionCreateParams,
    user: UserEntity,
  ) {
    const parseResult = LearningPathNodeTransitionCreateSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error("User must be a teacher to create a learning path.");
    }
    return this.learningPathNodeTransitionPersistence.createLearningPathNodeTransition(
      parseResult.data,
    );
  }
}
