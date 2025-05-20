import { PrismaClient } from '@prisma/client';
import { PrismaSingleton } from './prismaSingleton';

export class LearningObjectKeywordPersistence {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async updateLearningObjectKeywords(
    learningObjectId: string,
    newKeywords: {
      keyword: string;
    }[],
  ) {
    // Remove old keywords first
    await this.prisma.learningObjectKeyword.deleteMany({
      where: { learningObjectId: learningObjectId },
    });

    // Add new keywords
    const newKeywordEntries = newKeywords.map((keyword) => ({
      learningObjectId: learningObjectId,
      keyword: keyword.keyword,
    }));

    // Create new keyword records in the database
    await this.prisma.learningObjectKeyword.createMany({
      data: newKeywordEntries,
    });
    return newKeywordEntries;
  }
}
