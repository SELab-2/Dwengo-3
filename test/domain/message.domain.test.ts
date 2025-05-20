import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MessageDomain } from '../../server/domain/message.domain';
import { UserEntity } from '../../server/util/types/user.types';
import {
  testDiscussions,
  testMessages,
  testPaginationFilter,
  testStudents,
  testTeachers,
  testUsers,
  testGroups,
} from '../testObjects.json';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

const { mockMessagePeristence, mockDiscussionPeristence, mockGroupPersistence } = vi.hoisted(() => {
  return {
    mockMessagePeristence: {
      getMessages: vi.fn(),
      getMessageById: vi.fn(),
      createMessage: vi.fn(),
      deleteMessage: vi.fn(),
    },
    mockDiscussionPeristence: {
      getDiscussions: vi.fn(),
      getDiscussionById: vi.fn(),
      createDiscussion: vi.fn(),
    },
    mockGroupPersistence: {
      getGroupById: vi.fn(),
      getGroupByIdWithCustomIncludes: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/message.persistence', () => ({
  MessagePersistence: vi.fn().mockImplementation(() => {
    return mockMessagePeristence;
  }),
}));
vi.mock('../../server/persistence/discussion.persistence', () => ({
  DiscussionPersistence: vi.fn().mockImplementation(() => {
    return mockDiscussionPeristence;
  }),
}));
vi.mock('../../server/persistence/group.persistence', () => ({
  GroupPersistence: vi.fn().mockImplementation(() => {
    return mockGroupPersistence;
  }),
}));

const messageDomain = new MessageDomain();
let userTeacherNotOfGroup: UserEntity = {
  ...testUsers[2],
  role: testUsers[2].role as ClassRoleEnum,
  teacher: testTeachers[2],
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
    mockMessagePeristence.getMessages.mockImplementation((id: number) => {
      let found = testMessages.find((m) => m.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockDiscussionPeristence.getDiscussionById.mockImplementation((id: string) => {
      let found = testDiscussions.find((d) => d.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockGroupPersistence.getGroupByIdWithCustomIncludes.mockImplementation((id: string) => {
      let found = testGroups.find((g) => g.id === id);
      if (found) {
        return found;
      }
      return null;
    });
  });
  describe('getMessages', () => {
    test('valid query passes', async () => {
      await expect(messageDomain.getMessages(getMessagesQuery, userStudent)).resolves.not.toThrow();
    });
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
    test('user does not belong to group fails', async () => {
      await expect(
        messageDomain.getMessages(getMessagesQuery, userTeacherNotOfGroup),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
  });
  describe('createMessage', () => {
    test('valid params passes', async () => {
      await expect(
        messageDomain.createMessage(createMessageParams, userStudent),
      ).resolves.not.toThrow();
    });

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
        messageDomain.deleteMessage(deleteMessageInvalidId, userStudent),
      ).rejects.toThrow();
    });
    test('user id is not sender id fails', async () => {
      await expect(
        messageDomain.deleteMessage(deleteMessageId, userTeacherNotOfGroup),
      ).rejects.toMatchObject({ _errorCode: 40008 });
    });
  });
});
