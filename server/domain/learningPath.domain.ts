import { LearningPathPersistence } from '../persistence/learningPath.persistence';
import {
  LearningPathByFilterParams,
  LearningPathCreateParams,
  LearningPathCreateSchema,
  LearningPathFilterSchema,
} from '../util/types/learningPath.types';
import { PaginationFilterSchema } from '../util/types/pagination.types';
import { UserEntity } from '../util/types/user.types';
import { BadRequestError } from '../util/types/error.types';
import { ClassRoleEnum } from '../util/types/enums.types';

export class LearningPathDomain {
  private learningPathPersistence;

  constructor() {
    this.learningPathPersistence = new LearningPathPersistence();
  }

  public async getLearningPaths(query: LearningPathByFilterParams) {
    if (typeof query.keywords === 'string') {
      query.keywords = [query.keywords];
    }

    const paginationParse = PaginationFilterSchema.parse(query);
    const filters = LearningPathFilterSchema.parse(query);

    return this.learningPathPersistence.getLearningPaths(filters, paginationParse);
  }

  public async getLearningPathById(id: string) {
    return this.learningPathPersistence.getLearningPathById(id);
  }

  public async createLearningPath(body: LearningPathCreateParams, user: UserEntity) {
    const data = LearningPathCreateSchema.parse(body);

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new BadRequestError(40009);
    }
    return this.learningPathPersistence.createLearningPath(data);
  }
}
