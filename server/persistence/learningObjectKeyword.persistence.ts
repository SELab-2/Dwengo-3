import { PrismaClient, LearningObject } from "@prisma/client";
import { PrismaSingleton } from "./prismaSingleton";

export class LearningObjectKeywordPersistence {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = PrismaSingleton.instance;
  }

  public async createLearningObjectKeyword(data: {
    loId: string;
    keyword: string;
  }) {
    return await this.prisma.learningObjectKeyword.create({
      data: data,
    });
  }

  public async deleteLearningObjectKeyword(data: {
    loId: string;
    keyword: string;
  }) {
    return await this.prisma.learningObjectKeyword.delete({
      where: {
        loId_keyword: {
          loId: data.loId,
          keyword: data.keyword,
        },
      },
    });
  }
}
