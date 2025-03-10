import { Prisma, PrismaClient } from "@prisma/client";
import {
  LearningObjectFilterParams,
  LearningObjectUpdateWithoutKeywords,
  LearningObjectWithoutKeywords,
} from "../util/types/learningObject.types";

const prisma = new PrismaClient();

export class LearningObjectPersistence {
  public async getLearningObjects(filters: LearningObjectFilterParams) {
    const whereClause: Prisma.LearningObjectWhereInput = {
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

    return await prisma.learningObject.findMany({
      where: whereClause,
      include: {
        learningObjectsKeywords: true,
      },
    });
  }

  public async createLearningObject(data: LearningObjectWithoutKeywords) {
    const learningObject = await prisma.learningObject.create({
      data: data,
    });
    return learningObject;
  }

  public async updateLearningObject(
    id: string,
    data: LearningObjectUpdateWithoutKeywords,
  ) {
    return await prisma.learningObject.update({
      where: { id: id },
      data: data,
    });
  }

  public async deleteLearningObject(id: string) {
    return await prisma.learningNodeTransition.delete({
      where: {
        id: id,
      },
    });
  }
}
