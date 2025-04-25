import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { LearningPathDetail } from '../../util/types/learningPath.types';
import { LearningPathPersistence } from '../learningPath.persistence';
import { deleteAllData, insertLearningPaths } from './testData';
import { PrismaSingleton } from '../prismaSingleton';

let learningPaths: LearningPathDetail[];
const learningPathPersistence: LearningPathPersistence = new LearningPathPersistence();

describe('learningPath persistence test', () => {
  beforeAll(async () => {
    learningPaths = await insertLearningPaths();
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get learningPath by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const learningPath of learningPaths) {
        const req = learningPathPersistence.getLearningPathById(learningPath.id);
        const { learningPathNodes, ...data } = learningPath;
        await expect(req).resolves.toStrictEqual({
          ...data,
          learningPathNodes: expect.arrayContaining(learningPath.learningPathNodes),
        });
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = learningPathPersistence.getLearningPathById('qskfqskjf');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get learningPaths', () => {
    test('request all learning paths', async () => {
      const req = learningPathPersistence.getLearningPaths({}, { page: 1, pageSize: 10, skip: 0 });
      const expectedPaths = learningPaths.map((path) => ({
        id: path.id,
        title: path.title,
        learningPathNodes: expect.arrayContaining(path.learningPathNodes),
        image: path.image,
        description: path.description,
      }));
      expect(expectedPaths).not.toEqual([]);
      await expect(req).resolves.toEqual({
        data: expect.arrayContaining(expectedPaths),
        totalPages: 1,
      });
    });

    test('request all learning paths with target ages', async () => {
      const req = learningPathPersistence.getLearningPaths(
        { age: [10] },
        { page: 1, pageSize: 10, skip: 0 },
      );
      const expectedPaths = learningPaths
        .filter((path) =>
          path.learningPathNodes.some((node) => node.learningObject.targetAges.includes(10)),
        )
        .map((path) => ({
          id: path.id,
          title: path.title,
          learningPathNodes: expect.arrayContaining(path.learningPathNodes),
          image: path.image,
          description: path.description,
        }));
      expect(expectedPaths).not.toEqual([]);
      await expect(req).resolves.toEqual({
        data: expect.arrayContaining(expectedPaths),
        totalPages: 1,
      });
    });

    test('request all learning paths with target ages', async () => {
      const req = learningPathPersistence.getLearningPaths(
        { keywords: ['test4'] },
        { page: 1, pageSize: 10, skip: 0 },
      );
      const expectedPaths = learningPaths
        .filter((path) =>
          path.learningPathNodes.some((node) =>
            node.learningObject.keywords.some((keyword) => keyword.keyword === 'test4'),
          ),
        )
        .map((path) => ({
          id: path.id,
          title: path.title,
          learningPathNodes: expect.arrayContaining(path.learningPathNodes),
          image: path.image,
          description: path.description,
        }));
      expect(expectedPaths).not.toEqual([]);
      await expect(req).resolves.toEqual({
        data: expect.arrayContaining(expectedPaths),
        totalPages: 1,
      });
    });
  });
});
