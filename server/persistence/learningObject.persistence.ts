import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";
import {
  LearningObjectFilterParams,
  LearningObjectUpdateWithoutKeywords,
  LearningObjectWithoutKeywords,
} from "../util/types/learningObject.types";
import { PaginationParams } from "../util/types/pagination.types";
import { searchAndPaginate } from "../util/pagination/pagination.util";

export class LearningObjectPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async getLearningObjects(
    paginationParams: PaginationParams,
    filters: LearningObjectFilterParams,
  ) {
    const where: Prisma.LearningObjectWhereInput = {
      AND: [
        filters.keywords && filters.keywords.length > 0
          ? {
              keywords: {
                some: {
                  keyword: {
                    in: filters.keywords, // Match any of the keywords
                    mode: Prisma.QueryMode.insensitive, // Case-insensitive search
                  },
                },
              },
            }
          : {},
        filters.targetAges && filters.targetAges.length > 0
          ? {
              targetAges: {
                hasSome: filters.targetAges, // Match any of the target ages
              },
            }
          : {},
      ].filter(Boolean), // Remove empty objects from the AND array
    };

    return searchAndPaginate(
      this.prisma.learningObject,
      where,
      paginationParams,
      {
        // TODO: geef gewoon een array van keywords mee ipv object met keyword property
        keywords: {
          select: {
            keyword: true,
          },
        },
      },
    );
  }

  public async createLearningObject(data: LearningObjectWithoutKeywords) {
    const learningObject = await this.prisma.learningObject.create({
      data: data,
      include: {
        keywords: {
          select: {
            // TODO: analoog met hierboven
            keyword: true,
          },
        },
      },
    });
    return learningObject;
  }

  public async updateLearningObject(
    id: string,
    data: LearningObjectUpdateWithoutKeywords,
  ) {
    return await this.prisma.learningObject.update({
      where: { id: id },
      data: data,
    });
  }

  public async getLearningObjectById(id: string) {
    const learningObject = await this.prisma.learningObject.findUnique({
      where: { id: id },
      include: {
        keywords: {
          select: {
            keyword: true,
          },
        },
        learningPathNodes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!learningObject) {
      throw new Error(`LearningObject with id: ${id} not found`);
    }

    return learningObject;
  }

  public async deleteLearningObject(id: string) {
    return await this.prisma.learningObject.delete({
      where: { id: id },
    });
  }
}
