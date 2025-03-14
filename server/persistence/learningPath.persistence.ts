import { Prisma, PrismaClient } from "@prisma/client";
import {
  LearningPathByFilterParams,
  LearningPathCreateParams,
} from "../util/types/learningPath.types";
import { PaginationParams } from "../util/types/pagination.types";
import { PrismaSingleton } from "./prismaSingleton";
import { searchAndPaginate } from "../util/pagination/pagination.util";

export class LearningPathPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  private buildWhereClause(
    filters: LearningPathByFilterParams,
  ): Prisma.LearningPathWhereInput {
    return {
      AND: [
        filters.keywords && filters.keywords.length > 0
          ? {
              learningPathNodes: {
                some: {
                  learningObject: {
                    keywords: {
                      some: {
                        keyword: {
                          in: filters.keywords,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    },
                  },
                },
              },
            }
          : {},
        filters.age && filters.age.length > 0
          ? {
              learningPathNodes: {
                some: {
                  learningObject: {
                    targetAges: {
                      hasSome: filters.age, // Match any of the target ages
                    },
                  },
                },
              },
            }
          : {},
        filters.id ? { id: filters.id } : {},
      ],
    };
  }

  public async getLearningPaths(
    filters: LearningPathByFilterParams,
    paginationParams: PaginationParams,
  ) {
    const whereClause: Prisma.LearningPathWhereInput =
      this.buildWhereClause(filters);

    return searchAndPaginate(
      this.prisma.learningPath,
      whereClause,
      paginationParams,
      {
        learningPathNodes: {
          include: {
            learningObject: true,
          },
        },
      },
    );
  }

  public async createLearningPath(data: LearningPathCreateParams) {
    // create a learningPath without any connected nodes
    const learningPath = await this.prisma.learningPath.create({
      data: data,
    });
    return learningPath;
  }
}
