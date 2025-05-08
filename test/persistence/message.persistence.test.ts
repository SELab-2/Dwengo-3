import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { MessageDetail } from '../../server/util/types/message.types';
import { MessagePersistence } from '../../server/persistence/message.persistence';
import { deleteAllData, insertMessages } from './testData';
import { PrismaSingleton } from '../../server/persistence/prismaSingleton';

let messages: MessageDetail[] = [];
const messagePersistence: MessagePersistence = new MessagePersistence();

describe('message persitence test', () => {
  beforeAll(async () => {
    messages = await insertMessages();
    expect(messages).not.toEqual([]);
  });

  afterAll(async () => {
    await deleteAllData();
    const count = PrismaSingleton.instance.message.count();
    expect(count).resolves.toBe(0);
    await PrismaSingleton.instance.$disconnect();
  });

  describe('test get message by id', () => {
    test('request with existing id responds correctly', async () => {
      for (const message of messages) {
        const req = messagePersistence.getMessageById(message.id);
        await expect(req).resolves.toStrictEqual(message);
      }
    });

    test('request with unexisting id responds with an error', async () => {
      const req = messagePersistence.getMessageById(10000);
      await expect(req).rejects.toThrow();
    });
  });

  describe('test get messages', () => {
    test('request with existing discussionId responds correctly', async () => {
      for (const message of messages) {
        const req = messagePersistence.getMessages(
          { discussionId: message.discussionId },
          { page: 1, pageSize: 10, skip: 0 },
        );
        const expectedMessages = messages
          .filter((m) => m.discussionId === message.discussionId)
          .map((m) => ({
            id: m.id,
            content: m.content,
            sender: m.sender,
            createdAt: m.createdAt,
          }));
        expect(expectedMessages).not.toEqual([]);
        await expect(req).resolves.toStrictEqual({
          data: expect.arrayContaining(expectedMessages),
          totalPages: 1,
        });
      }
    });
  });
});
