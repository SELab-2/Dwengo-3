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
              learningObjectsKeywords: {
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

        filters.id ? { id: filters.id } : {},
      ].filter(Boolean), // Remove empty objects from the AND array
    };

    return searchAndPaginate(
      this.prisma.learningObject,
      where,
      paginationParams,
      {
        learningObjectsKeywords: true,
      },
    );
  }

  public async createLearningObject(data: LearningObjectWithoutKeywords) {
    const learningObject = await this.prisma.learningObject.create({
      data: data,
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
    return await this.prisma.learningObject.findUnique({
      where: { id: id },
      include: {
        learningPathNodes: true,
      },
    });
  }

  public async deleteLearningObject(id: string) {
    return await this.prisma.learningObject.delete({
      where: { id: id },
    });
  }
}
