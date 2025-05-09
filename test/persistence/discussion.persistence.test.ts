import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { DiscussionPersistence } from '../../server/persistence/discussion.persistence';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';
import { deleteAllData, insertDiscussions } from './testData';
import { DiscussionDetail } from '../../server/util/types/discussion.types';

const discussionPersistence: DiscussionPersistence = new DiscussionPersistence();
let discussions: DiscussionDetail[] = [];

describe('discussion persistence test', () => {
  beforeAll(async () => {
    discussions = await insertDiscussions();
    expect(discussions).not.toEqual([]);
  });

  afterAll(async () => {
    await deleteAllData();
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get discussion by id', () => {
    test('discussion with existing id responds with discussion', async () => {
      for (const discussion of discussions) {
        const req = discussionPersistence.getDiscussionById(discussion.id);
        await expect(req).resolves.toStrictEqual(discussion);
      }
    });

    test('discussion with non-existing id responds with an error', async () => {
      const req = discussionPersistence.getDiscussionById('nonexistent-id');
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get discussions', () => {
    test('request with existing user id responds with array of discussions', async () => {
      for (const discussion of discussions) {
        for (const user of discussion.members) {
          const req = discussionPersistence.getDiscussions(
            { userId: user.id },
            { page: 1, pageSize: 20, skip: 0 },
          );
          const expectedDiscussions = discussions
            .filter((d) => d.members.some((member) => member.id === user.id))
            .map((d) => ({
              id: d.id,
            }));
          expect(expectedDiscussions).not.toEqual([]);
          await expect(req).resolves.toEqual({
            data: expect.arrayContaining(expectedDiscussions),
            totalPages: 1,
          });
        }
      }
    });
  });
});
