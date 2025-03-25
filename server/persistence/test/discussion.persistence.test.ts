import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { DiscussionPersistence } from '../discussion.persistence';
import { PrismaSingleton } from '../prismaSingleton';
import { deleteAllData, insertDiscussions } from './testData';

const discussionPersistence: DiscussionPersistence =
  new DiscussionPersistence();
let discussions;

describe('discussion persistence test', () => {
  beforeAll(async () => {
    discussions = await insertDiscussions();
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get discussion by id', () => {
    test('discussion with existing id responds with discussion', async () => {
      for (const discussion of discussions) {
        const req = discussionPersistence.getDiscussionById(discussion.id);
        await expect(req).resolves.toEqual(discussion);
      }
    });

    test('discussion with non-existing id responds with null', async () => {
      const req = discussionPersistence.getDiscussionById('nonexistent-id');
      await expect(req).resolves.toBeNull();
    });
  });

  describe('test get discussions', () => {
    test('request with existing class id responds with array of discussions', async () => {
      for (const discussion of discussions) {
        const classId = discussion.class.id;
        const req = discussionPersistence.getDiscussions(
          { page: 1, pageSize: 10, skip: 0 },
          { classId },
        );
        const expectedDiscussions = discussions.filter(
          (d) => d.class.id === classId,
        );
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining(expectedDiscussions),
          totalPages: 1,
        });
      }
    });

    test('request with existing user id responds with array of discussions', async () => {
      for (const discussion of discussions) {
        const userId = discussion.user.id;
        const req = discussionPersistence.getDiscussions(
          { page: 1, pageSize: 10, skip: 0 },
          { userId },
        );
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining([discussion]),
          totalPages: 1,
        });
      }
    });
  });

  describe('test get discussions by class id and user', () => {
    test('request with existing class id and user id responds with array of discussions', async () => {
      for (const discussion of discussions) {
        const classId = discussion.class.id;
        const userId = discussion.user.id;
        const req = discussionPersistence.getDiscussions(
          { page: 1, pageSize: 10, skip: 0 },
          { classId, userId },
        );
        await expect(req).resolves.toEqual({
          data: expect.arrayContaining([discussion]),
          totalPages: 1,
        });
      }
    });
  });
});
