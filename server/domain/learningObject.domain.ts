import { LearningObjectPersistence } from '../persistence/learningObject.persistence';
import { LearningObjectKeywordPersistence } from '../persistence/learningObjectKeyword.persistence';
import {
  LearningObjectCreateParams,
  LearningObjectCreateSchema,
  LearningObjectFilterParams,
  LearningObjectFilterSchema,
  LearningObjectUpdateParams,
  LearningObjectUpdateSchema,
} from '../util/types/learningObject.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { ClassRoleEnum, UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';

export class LearningObjectDomain {
  private learningObjectPersistence;
  private learningObjectKeywordPersistence;

  constructor() {
    this.learningObjectPersistence = new LearningObjectPersistence();
    this.learningObjectKeywordPersistence = new LearningObjectKeywordPersistence();
  }

  public async createLearningObject(query: LearningObjectCreateParams, user: UserEntity) {
    if (user.role != ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40009);
    }

    const { keywords, ...dataWithoutKeywords } = LearningObjectCreateSchema.parse(query);

    const dataToUpdate = {
      ...dataWithoutKeywords,
    };

    const learningObject = await this.learningObjectPersistence.createLearningObject(dataToUpdate);

    if (keywords) {
      await this.learningObjectKeywordPersistence.updateLearningObjectKeywords(
        learningObject.id,
        keywords,
      );
    }

    return learningObject;
  }

  public async getLearningObjects(query: any) {
    if (typeof query.keywords === 'string') {
      query.keywords = [query.keywords];
    }

    const pagination = PaginationFilterSchema.parse(query);
    const filters = LearningObjectFilterSchema.parse(query);

    return this.learningObjectPersistence.getLearningObjects(pagination, filters);
  }

  public async getLearningObjectById(id: string) {
    return await this.learningObjectPersistence.getLearningObjectById(id);
  }

  public async updateLearningObject(
    id: string,
    body: LearningObjectUpdateParams,
    user: UserEntity,
  ) {
    // TODO: Check if user is owner of learning object once there is an owner attribute
    // Validate the request body using Zod schema
    const { learningObjectsKeywords, ...dataWithoutKeywords } =
      LearningObjectUpdateSchema.parse(body);

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
    const learningObject = await this.learningObjectPersistence.getLearningObjectById(id);

    if (!learningObject) {
      throw new BadRequestError(40029);
    }

    const nodes = (await this.learningObjectPersistence.getLearningPathNodes(id))
      ?.learningPathNodes;

    // If the LearningObject is linked to any LearningPathNode, prevent deletion
    if (!nodes || nodes.length > 0) {
      throw new BadRequestError(40030);
    }

    // Proceed with deletion
    return this.learningObjectPersistence.deleteLearningObject(id);
  }
}
