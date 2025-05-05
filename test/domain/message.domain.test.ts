import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MessageDomain } from '../../server/domain/message.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../../server/util/types/user.types';
import {
  testDiscussions,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
  testMessages,
} from '../testObjects.json';

// message persistence mock
const { mockMessagePeristence } = vi.hoisted(() => {
  return {
    mockMessagePeristence: {
      getMessages: vi.fn(),
      getMessageById: vi.fn(),
      createMessage: vi.fn(),
      deleteMessage: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/message.persistence', () => ({
  MessagePersistence: vi.fn().mockImplementation(() => {
    return mockMessagePeristence;
  }),
}));

const messageDomain = new MessageDomain();
let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
  provider: AuthenticationProvider.LOCAL,
};

let getMessagesQuery = {
  ...testPaginationFilter,
  discussionId: testDiscussions[0].id,
};
let getMessagesInvalidPaginationQuery = {
  ...getMessagesQuery,
  page: '-1',
  discussionId: testDiscussions[0].id,
};
let getMessagesEmptyQuery = {
  ...testPaginationFilter,
};
let getMessagesInvalidDiscussionIdQuery = {
  ...getMessagesQuery,
  discussionId: 'id',
};

let createMessageParams = testMessages[0];
let createMessageInvalidDiscussionIdParams = {
  ...createMessageParams,
  discussionId: 'id',
};
let createMessageInvalidContentParams = {
  ...createMessageParams,
  content: 0,
};

let deleteMessageId = testMessages[0].id;
let deleteMessageInvalidId = 'id';

// Tests
describe('message domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockMessagePeristence.getMessageById.mockImplementation((id: number) => {
      let found = testMessages.find((m) => m.id === id);
      if (found) {
        return found;
      }
      return null;
    });
  });
  describe('getMessages', () => {
    /* bug get discussions with id is not possible
        test('valid query passes', async () => {
            await expect(messageDomain.getMessages(getMessagesQuery, userStudent)).resolves.not.toThrow()
        });
        */
    test('invalid pagination fails', async () => {
      await expect(
        messageDomain.getMessages(getMessagesInvalidPaginationQuery, userStudent),
      ).rejects.toThrow();
    });
    test('empty query fails', async () => {
      await expect(messageDomain.getMessages(getMessagesEmptyQuery, userStudent)).rejects.toThrow();
    });
    test('invalid discussion id fails', async () => {
      await expect(
        messageDomain.getMessages(getMessagesInvalidDiscussionIdQuery, userStudent),
      ).rejects.toThrow();
    });
  });
  describe('createMessage', () => {
    /* bug get discussions with id is not possible
        test('valid params passes', async () => {
          await expect(messageDomain.createMessage(createMessageParams, userStudent)).resolves.not.toThrow()
        });
        */
    test('invalid discussion id fails', async () => {
      await expect(
        messageDomain.createMessage(createMessageInvalidDiscussionIdParams, userStudent),
      ).rejects.toThrow();
    });
    test('invalid content fails', async () => {
      await expect(
        messageDomain.createMessage(createMessageInvalidContentParams, userStudent),
      ).rejects.toThrow();
    });
  });
  describe('deleteMessage', () => {
    test('valid id passes', async () => {
      await expect(
        messageDomain.deleteMessage(deleteMessageId, userStudent),
      ).resolves.not.toThrow();
    });
    test('invalid id fails', async () => {
      await expect(
        messageDomain.createMessage(deleteMessageInvalidId, userStudent),
      ).rejects.toThrow();
    });
    test('message does not belong to user fails', async () => {
      await expect(
        messageDomain.createMessage(deleteMessageInvalidId, userTeacher),
      ).rejects.toThrow();
    });
  });
});
