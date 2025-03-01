import { Prisma, PrismaClient } from "@prisma/client";
import { LearningPathByFilterParams, LearningPathCreateParams } from "../domain/types";
import { LearningPathNodePersistence } from "./learningPathNode.persistence";

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
                        learningObject: {
                            include: {
                                learningObjectsKeywords: true,
                            },
                        },
                        learningPathOutgoingTransitions: true, // include learningObjects in response.
                        learningPathIncomingTransitions: true,
                    },
                },
            },
        },
        );

        return learningPaths;
    }

    // TODO: to be uniform, wrap the id in a params object?
    // public async getLearningPathById(id: string) {
    //     return await prisma.learningPath.findUnique({
    //         where: {
    //             id: id,
    //         },
    //         include: {
    //             learningPathNodes: true,
    //         },
    //     });
    // }


    // TODO : not that clean with type any, maybe make it more uniform with other functions
    public async createLearningPath(data: any) {
        // create a learningPath without any connected nodes
        const learningPath = await prisma.learningPath.create({
            data: data,
        });
        return learningPath;
    }

    // TESTING PURPOSE ONLY, THIS SHOULD NOT BE IN PRODUCTION
    public async deleteLearningPath() {
        return await prisma.learningPath.deleteMany({});
    }

}



// CODE TO CREATE LEARNING OBJECT

// await prisma.learningObject.create({
//     data: {
//         hruid: "LO1",
//         uuid: "2eab514a-5bf7-48ea-88f1-2e1caf77df40",
//         version: 1,
//         language: "en",
//         title: "Learning Object 1",
//         description: "Learning Object 1 Description",
//         targetAges: {
//             set: [3, 4, 5],
//         },
//         teacherExclusive: false,
//         skosConcepts: ["Math.com", "Science.com"],
//         available: true,
//         content: "Learning Object 1 Content",
//         canUploadSubmission: true,
//         learningObjectsKeywords: {
//             create: [
//                 {
//                     keyword: "Math",
//                 },
//                 {
//                     keyword: "Science",
//                 },
//             ],
//         },
//     },
// });