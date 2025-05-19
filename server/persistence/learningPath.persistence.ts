import { Prisma, PrismaClient } from '@prisma/client';
import {
  LearningPathByFilterParams,
  LearningPathCreateParams,
} from '../util/types/learningPath.types';
import { PaginationParams } from '../util/types/pagination.types';
import { PrismaSingleton } from './prismaSingleton';
import { searchAndPaginate } from '../util/pagination/pagination.util';

import { NotFoundError } from '../util/types/error.types';
import { learningPathSelectDetail, learningPathSelectShort } from '../util/selectInput/select';
import { title } from 'node:process';

export class LearningPathPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  private buildWhereClause(filters: LearningPathByFilterParams): Prisma.LearningPathWhereInput {
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
        filters.searchTitle
          ? {
              title: {
                startsWith: filters.searchTitle,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},
        filters.searchKeyword
          ? {
              learningPathNodes: {
                some: {
                  learningObject: {
                    keywords: {
                      some: {
                        keyword: {
                          startsWith: filters.searchKeyword,
                          mode: Prisma.QueryMode.insensitive,
                        },
                      },
                    },
                  },
                },
              },
            }
          : {},
      ],
    };
  }

  public async getLearningPaths(
    filters: LearningPathByFilterParams,
    paginationParams: PaginationParams,
  ) {
    const whereClause: Prisma.LearningPathWhereInput = this.buildWhereClause(filters);

    return searchAndPaginate(
      this.prisma.learningPath,
      whereClause,
      paginationParams,
      undefined,
      learningPathSelectShort,
    );
  }

  public async getLearningPathById(id: string) {
    const learningPath = await this.prisma.learningPath.findUnique({
      where: {
        id: id,
      },
      select: learningPathSelectDetail,
    });

    if (!learningPath) {
      throw new NotFoundError(40409);
    }

    return learningPath;
  }

  public async createLearningPath(data: LearningPathCreateParams) {
    // create a learningPath without any connected nodes
    const learningPath = await this.prisma.learningPath.create({
      data: data,
      select: learningPathSelectDetail,
    });
    return learningPath;
  }
}
