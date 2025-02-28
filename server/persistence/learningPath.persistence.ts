import { Prisma, PrismaClient } from "@prisma/client";
import { LearningPathByFilterParams } from "../domain/types";

const prisma = new PrismaClient();

export class LearningPathPersistence {

    public async getLearningPaths(
        params: LearningPathByFilterParams
    ) {

        prisma.learningPath.findMany({
            where: {
                AND: [
                    params.keywords && params.keywords.length > 0
                        ? {
                            learningPathNodes: {
                                some: {
                                    learningObject: {
                                        learningObjectsKeywords: {
                                            some: {
                                                keyword: {
                                                    in: params.keywords, // Match any of the keywords
                                                    mode: Prisma.QueryMode.insensitive, // Case-insensitive search
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        }
                        : {},
                    params.age && params.age.length > 0
                        ? {
                            learningPathNodes: {
                                some: {
                                    learningObject: {
                                        targetAges: {
                                            hasSome: params.age, // Match any of the target ages
                                        },
                                    },
                                },
                            },
                        }
                        : {},
                ].filter(Boolean), // Remove empty objects from the AND array
            },
            include: {
                learningPathNodes: {
                    include: {
                        learningObject: true, // include learningObjects in response.
                    },
                },
            },
        },
        );
    }
}