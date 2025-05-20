import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DiscussionDomain } from '../../server/domain/discussion.domain';
import { UserEntity } from '../../server/util/types/user.types';
import {
  testDiscussions,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
  testGroups,
  testAssignments,
  testLearningPaths,
} from '../testObjects.json';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

const {
  mockDiscussionPeristence,
  mockGroupPersistence,
  mockStudentPersistence,
  mockTeacherPersistence,
} = vi.hoisted(() => {
  return {
    mockDiscussionPeristence: {
      getDiscussions: vi.fn(),
      getDiscussionById: vi.fn(),
      createDiscussion: vi.fn(),
    },
    mockGroupPersistence: {
      getGroupById: vi.fn(),
      getGroupByIdWithCustomIncludes: vi.fn(),
    },
    mockStudentPersistence: {
      getStudentUserIdsByGroupId: vi.fn(),
    },
    mockTeacherPersistence: {
      getTeacherUserIdsByGroupId: vi.fn(),
    },
  };
});
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
vi.mock('../../server/persistence/student.persistence', () => ({
  StudentPersistence: vi.fn().mockImplementation(() => {
    return mockStudentPersistence;
  }),
}));
vi.mock('../../server/persistence/teacher.persistence', () => ({
  TeacherPersistence: vi.fn().mockImplementation(() => {
    return mockTeacherPersistence;
  }),
}));

const discussionDomain = new DiscussionDomain();
let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userTeacherOtherGroup: UserEntity = {
  ...testUsers[1],
  role: testUsers[1].role as ClassRoleEnum,
  teacher: testTeachers[1],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
  provider: AuthenticationProvider.LOCAL,
};

let getDiscussionsQuery = {
  ...testPaginationFilter,
  userId: userTeacher.id,
};
let getDiscussionsInvalidPaginationQuery = {
  ...getDiscussionsQuery,
  page: '-1',
};
let getDiscussionsEmptyQuery = {
  ...testPaginationFilter,
};

let getDiscussionByIdId = testDiscussions[0].id;

let createDiscussionParams = { groupId: testDiscussions[0].groupId };
let createDiscussionInvalidGroupIdParams = {
  ...createDiscussionParams,
  groupId: 'id',
};

// Tests
describe('discussion domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockGroupPersistence.getGroupByIdWithCustomIncludes.mockImplementation((id: string) => {
      let found = testGroups.find((g) => g.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockDiscussionPeristence.getDiscussions.mockImplementation((filter, pag) => {
      return {};
    });
    mockDiscussionPeristence.getDiscussionById.mockImplementation((id) => {
      let found = testDiscussions.find((d) => d.id === id);
      if (found) {
        return found;
      }
      return null;
    });
    mockTeacherPersistence.getTeacherUserIdsByGroupId.mockImplementation((id) => {
      return [userTeacher.id];
    });
    mockStudentPersistence.getStudentUserIdsByGroupId.mockImplementation((id) => {
      return [userStudent.id];
    });
  });
  describe('getDiscussions', () => {
    test('valid query passes', async () => {
      await expect(
        discussionDomain.getDiscussions(getDiscussionsQuery, userTeacher),
      ).resolves.not.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        discussionDomain.getDiscussions(getDiscussionsInvalidPaginationQuery, userTeacher),
      ).rejects.toThrow();
    });
    test('user id is not query user id fails', async () => {
      await expect(
        discussionDomain.getDiscussions(getDiscussionsQuery, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40049 });
    });
  });
  describe('getDiscussionById', () => {
    test('user belongs to group passes', async () => {
      await expect(
        discussionDomain.getDiscussionById(getDiscussionByIdId, userTeacher),
      ).resolves.not.toThrow();
    });
    test('user does not belong to group fails', async () => {
      await expect(
        discussionDomain.getDiscussionById(getDiscussionByIdId, userTeacherOtherGroup),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
  });
  describe('createDiscussion', () => {
    test('valid params and user belongs to group passes', async () => {
      await expect(
        discussionDomain.createDiscussion(createDiscussionParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('user does not belong to group fails', async () => {
      await expect(
        discussionDomain.createDiscussion(createDiscussionParams, userTeacherOtherGroup),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
    test('invalid group id fails', async () => {
      await expect(
        discussionDomain.createDiscussion(createDiscussionInvalidGroupIdParams, userTeacher),
      ).rejects.toThrow();
    });
  });
});
