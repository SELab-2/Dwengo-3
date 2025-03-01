import { Prisma, PrismaClient } from "@prisma/client";
import { LearningPathByFilterParams, LearningPathCreateParams } from "../domain/types";

const prisma = new PrismaClient();

export class LearningPathPersistence {

    public async getLearningPaths(
        params: LearningPathByFilterParams
    ) {
        const learningPaths = await prisma.learningPath.findMany({
            where: {
                AND: [
                    params.keywords && params.keywords.length > 0
                        ? {
                            learningPathNodes: {
                                some: {
                                    learningObject: {
                                        learningObjectsKeywords: {
                                            some: {
                                                // TODO is a separate table for keywords necessary?
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

                    params.id ? { id: params.id } : {},
                ].filter(Boolean), // Remove empty objects from the AND array
            },
            include: {
                learningPathNodes: {
                    include: {
                        learningObject: true,
                    },
                },
            },
        },
        );

        return learningPaths;
    }

    public async createLearningPath(data: LearningPathCreateParams) {
        // create a learningPath without any connected nodes
        const learningPath = await prisma.learningPath.create({
            data: data,
        });
        return learningPath;
    }
}