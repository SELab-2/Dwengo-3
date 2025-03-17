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

    const { keywords, ...dataWithoutKeywords } = parseResult.data;

    const dataToUpdate = {
      ...dataWithoutKeywords,
    };

    const learningObject =
      await this.learningObjectPersistence.createLearningObject(dataToUpdate);

    if (keywords) {
      const k =
        await this.learningObjectKeywordPersistence.updateLearningObjectKeywords(
          learningObject.id,
          keywords,
        );
      learningObject.keywords.push(...k);
    }

    return learningObject;
  }

  public async getLearningObjects(query: LearningObjectFilterParams) {
    if (typeof query.keywords === "string") {
      query.keywords = [query.keywords];
    }

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

  public async getLearningObjectById(id: string) {
    const { learningPathNodes, ...learningObject } =
      await this.learningObjectPersistence.getLearningObjectById(id);
    return learningObject;
  }

  public async updateLearningObject(
    id: string,
    body: LearningObjectUpdateParams,
    user: UserEntity,
  ) {
    // TODO: Check if user is owner of learning object once there is an owner attribute
    // Validate the request body using Zod schema
    const parseResult = LearningObjectUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    const { learningObjectsKeywords, ...dataWithoutKeywords } =
      parseResult.data;

    const dataToUpdate = {
      ...dataWithoutKeywords,
    };

    await this.learningObjectPersistence.updateLearningObject(id, dataToUpdate);

    if (learningObjectsKeywords) {
      await this.learningObjectKeywordPersistence.updateLearningObjectKeywords(
        id,
        learningObjectsKeywords,
      );
    }
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
