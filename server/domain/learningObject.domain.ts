import { LearningObjectPersistence } from "../persistence/learningObject.persistence";
import { LearningObjectKeywordPersistence } from "../persistence/learningObjectKeyword.persistence";
import {
  LearningObjectCreateParams,
  LearningObjectCreateSchema,
  LearningObjectFilterParams,
  LearningObjectFilterSchema,
  LearningObjectUpdateParams,
  LearningObjectUpdateSchema,
} from "../util/types/learningObject.types";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class LearningObjectDomain {
  private learningObjectPersistence;
  private learningObjectKeywordPersistence;

  constructor() {
    this.learningObjectPersistence = new LearningObjectPersistence();
    this.learningObjectKeywordPersistence =
      new LearningObjectKeywordPersistence();
  }

  public async createLearningObject(
    query: LearningObjectCreateParams,
    user: UserEntity,
  ) {
    if (user.role != ClassRoleEnum.TEACHER) {
      throw new Error("User must be a teacher to create a learning object");
    }

    const parseResult = LearningObjectCreateSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { learningObjectsKeywords, ...dataWithoutKeywords } =
      parseResult.data;
    const learningObject =
      await this.learningObjectPersistence.createLearningObject(
        dataWithoutKeywords,
      );
    learningObjectsKeywords?.map(({ keyword }) =>
      this.learningObjectKeywordPersistence.createLearningObjectKeyword({
        loId: learningObject.id,
        keyword: keyword,
      }),
    );
    return learningObject;
  }

  public async getLearningObjects(query: LearningObjectFilterParams) {
    const paginationResult = PaginationFilterSchema.safeParse(query);
    if (!paginationResult.success) {
      throw paginationResult.error;
    }

    const parseResult = LearningObjectFilterSchema.safeParse(query);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    return this.learningObjectPersistence.getLearningObjects(
      paginationResult.data,
      parseResult.data,
    );
  }

  public async updateLearningObject(
    id: string,
    body: LearningObjectUpdateParams,
    user: UserEntity,
  ) {
    /* const learningObject = this.learningObjectPersistence.getLearningObjects({id: id});
    if (learningObject.owner != user.userId) {
      throw new Error("You can only update your own learning object");
    } */

    const parseResult = LearningObjectUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }
    const { learningObjectsKeywords, ...dataWithoutKeywords } =
      parseResult.data;
    await this.learningObjectPersistence.updateLearningObject(
      id,
      dataWithoutKeywords,
    );
    // TODO: Update keywords
  }

  public async deleteLearningObject(id: string, user: UserEntity) {
    // TODO: Check if user is owner of learning object once there is an owner attribute
    const learningObject =
      await this.learningObjectPersistence.getLearningObjectById(id);

    if (!learningObject) {
      throw new Error("Learning object not found");
    }

    // If the LearningObject is linked to any LearningPathNode, prevent deletion
    if (learningObject.learningPathNodes.length > 0) {
      throw new Error(
        "Cannot delete a learning object linked to a learning path.",
      );
    }

    // Proceed with deletion
    return this.learningObjectPersistence.deleteLearningObject(id);
  }
}
