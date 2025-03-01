import { Prisma, PrismaClient } from "@prisma/client";
import { LearningPathByFilterParams, LearningPathCreateParams } from "../domain/types";

const prisma = new PrismaClient();

export class LearningPathPersistence {

    public async getLearningPaths(
        params: LearningPathByFilterParams
    ) {

        console.log("params", params);

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

        return learningPaths;
    }

    // TODO: to be uniform, wrap the id in a params object?
    public async getLearningPathById(id: string) {
        return await prisma.learningPath.findUnique({
            where: {
                id: id,
            },
            include: {
                learningPathNodes: true,
            },
        });
    }


    // TODO : not that clean with type any, maybe make it more uniform with other functions
    public async createLearningPath(data: any) {
        return await prisma.learningPath.create({
            data: data, // TODO this probably will not work with nested learningPathNodes
        });
    }
}