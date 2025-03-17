import { LearningPathPersistence } from "../persistence/learningPath.persistence";
import {
  LearningPathByFilterParams,
  LearningPathCreateParams,
  LearningPathCreateSchema,
  LearningPathFilterSchema,
} from "../util/types/learningPath.types";
import { PaginationFilterSchema } from "../util/types/pagination.types";
import { ClassRoleEnum, UserEntity } from "../util/types/user.types";

export class LearningPathDomain {
  private learningPathPersistence;

  constructor() {
    this.learningPathPersistence = new LearningPathPersistence();
  }

  public async getLearningPaths(query: LearningPathByFilterParams) {
    if (typeof query.keywords === "string") {
      query.keywords = [query.keywords];
    }

    const paginationParseResult = PaginationFilterSchema.safeParse(query);
    if (!paginationParseResult.success) {
      throw paginationParseResult.error;
    }

    const filtersResult = LearningPathFilterSchema.safeParse(query);
    if (!filtersResult.success) {
      throw filtersResult.error;
    }

    return this.learningPathPersistence.getLearningPaths(
      filtersResult.data,
      paginationParseResult.data,
    );
  }

  public async getLearningPathById(id: string) {
    return this.learningPathPersistence.getLearningPathById(id);
  }

  public async createLearningPath(
    body: LearningPathCreateParams,
    user: UserEntity,
  ) {
    const parseResult = LearningPathCreateSchema.safeParse(body);
    if (!parseResult.success) {
      throw parseResult.error;
    }

    if (user.role !== ClassRoleEnum.TEACHER) {
      throw new Error("User must be a teacher to create a learning path.");
    }
    return this.learningPathPersistence.createLearningPath(parseResult.data);
  }
}
