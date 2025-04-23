import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { LearningPathNodeDetail } from "../../util/types/learningPathNode.types";
import { LearningPathNodePersistence } from "../learningPathNode.persistence";
import { deleteAllData, insertLearningPathNodes } from "./testData";
import { PrismaSingleton } from "../prismaSingleton";

let learningPathNodes: LearningPathNodeDetail[] = [];
const learningPathNodePersistence: LearningPathNodePersistence = new LearningPathNodePersistence();

describe("learningPathNode persistence test", () => {
    beforeAll(async () => {
        learningPathNodes = await insertLearningPathNodes();
    });

    afterAll(async () => {
        await deleteAllData();
        await PrismaSingleton.instance.$disconnect();
    });

    describe("test get learningPathNode by id", () => {
        test("request with existing id responds correctly", async () => {
            for (const learningPathNode of learningPathNodes) {
                const req = learningPathNodePersistence.getLearningPathNodeById(learningPathNode.id);
                await expect(req).resolves.toStrictEqual(learningPathNode);
            }
        });

        test("request with unexisting id responds with an error", async () => {
            const req = learningPathNodePersistence.getLearningPathNodeById("kfqljqlmkjf");
            await expect(req).rejects.toThrow();
        });
    });

    describe("test get learningPathNode count", () => {
        test("request with existing id responds correctly", async () => {
            for (const learningPathNode of learningPathNodes) {
                const req = learningPathNodePersistence.getLearningPathNodeCount(learningPathNode.learningPathId);
                await expect(req).resolves.toBe(3);
            }
        });
    });
})