import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "../prismaSingleton";
import {
  LearningPathByFilterParams,
  LearningPathCreateParams,
  PaginationParams,
} from "../domain/types";

export class LearningPathPersistence {
  public async getLearningPaths(
    filters: LearningPathByFilterParams,
    paginationParams: PaginationParams
  ) {
    const whereClause: Prisma.LearningPathWhereInput = {
      AND: [
        filters.keywords && filters.keywords.length > 0
          ? {
            learningPathNodes: {
              some: {
                learningObject: {
                  learningObjectsKeywords: {
                    some: {
                      // TODO is a separate table for keywords necessary?
                      keyword: {
                        in: filters.keywords, // Match any of the keywords
                        mode: Prisma.QueryMode.insensitive, // Case-insensitive search
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
      ].filter(Boolean), // Remove empty objects from the AND array
    };

    const [learningPaths, totalCount] = await PrismaSingleton.instance.$transaction([
      PrismaSingleton.instance.learningPath.findMany({
        where: whereClause,
        include: {
          learningPathNodes: {
            include: {
              learningObject: true,
            },
          },
        },
        skip: paginationParams.skip,
        take: paginationParams.take,
      }),
      PrismaSingleton.instance.learningPath.count({
        where: whereClause,
      }),
    ]);

    return {
      data: learningPaths,
      totalPages: Math.ceil(totalCount / paginationParams.take),
    };
  }

  public async createLearningPath(data: LearningPathCreateParams) {
    // create a learningPath without any connected nodes
    const learningPath = await PrismaSingleton.instance.learningPath.create({
      data: data,
    });
    return learningPath;
  }
}
