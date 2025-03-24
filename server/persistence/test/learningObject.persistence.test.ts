import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { LearningObjectDetail } from "../../util/types/learningObject.types";
import { LearningObjectPersistence } from "../learningObject.persistence";
import { deleteAllData, insertLearningObjects } from "./testData";
import { PrismaSingleton } from "../prismaSingleton";

let learningObjects: LearningObjectDetail[] = [];
const learningObjectPersistence: LearningObjectPersistence = new LearningObjectPersistence();

describe("learningObject persistence test", () => {
    beforeAll(async () => {
        learningObjects = await insertLearningObjects();
    });

    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("test get learningObject by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const learningObject of learningObjects) {
                const req = learningObjectPersistence.getLearningObjectById(learningObject.id);
                await expect(req).resolves.toStrictEqual(learningObject);
            }
        });

        test("request with unexisting id responds with an error", async () => {
            const req = learningObjectPersistence.getLearningObjectById("qsdkfljqkslf");
            await expect(req).rejects.toThrow();
        })
    });

    describe("test get learningObjects", () => {
        test("request all learning objects", async () => {
            const req = learningObjectPersistence.getLearningObjects({page: 1, pageSize: 10, skip: 0}, {});
            const expectedObjects = learningObjects.map((object) => ({
                id: object.id, 
                title: object.title,
                language: object.language,
                estimatedTime: object.estimatedTime,
                keywords: object.keywords,
                targetAges: object.targetAges
            }));
            await expect(req).resolves.toEqual({data: expect.arrayContaining(expectedObjects), totalPages: 1});
        });

        test("request all learning objects with target ages", async () => {
            const req = learningObjectPersistence.getLearningObjects({page: 1, pageSize: 10, skip: 0}, {targetAges: [10, 15]});
            const expectedObjects = learningObjects.filter((object) => object.targetAges.includes(10) || object.targetAges.includes(15)).map((object) => ({
                id: object.id, 
                title: object.title,
                language: object.language,
                estimatedTime: object.estimatedTime,
                keywords: object.keywords,
                targetAges: object.targetAges
            }));
            expect(expectedObjects).not.toEqual([]);
            await expect(req).resolves.toEqual({data: expect.arrayContaining(expectedObjects), totalPages: 1});
        });

        test("request all learing object with keywords", async () => {
            const req = learningObjectPersistence.getLearningObjects({page: 1, pageSize: 10, skip: 0}, {keywords: ["test4"]});
            const expectedObjects = learningObjects.filter((object) => object.keywords.some((keyword) => keyword.keyword === "test4")).map((object) => ({
                id: object.id, 
                title: object.title,
                language: object.language,
                estimatedTime: object.estimatedTime,
                keywords: object.keywords,
                targetAges: object.targetAges
            }));
            expect(expectedObjects).not.toEqual([]);
            await expect(req).resolves.toEqual({data: expect.arrayContaining(expectedObjects), totalPages: 1});
        })
    });

    describe("test update learning object", () => {
        test("request with existing id should update learningObject correctly", async () => {
            const learningObject = learningObjects[0];
            learningObject.content = "new content";
            const data = {
                version: learningObject.version,
                title: learningObject.title,
                description: learningObject.description || undefined,
                contentType: learningObject.contentType || undefined,
                targetAges: learningObject.targetAges,
                difficulty: learningObject.difficulty?.toNumber(),
                estimatedTime: learningObject.estimatedTime?.toNumber(),
                content: learningObject.content,
                teacherExclusive: learningObject.teacherExclusive,
                available: learningObject.available
            }
            const req = learningObjectPersistence.updateLearningObject(learningObject.id, data);
            const { updatedAt: _, ...expectedData } = learningObject;
            const { updatedAt: __, ...receivedData } = await req;
            expect(receivedData).toStrictEqual(expectedData);

        });
    });
});