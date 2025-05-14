import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  testClasses,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
  testLearningPaths,
} from '../testObjects.json';
import { LearningPathDomain } from '../../server/domain/learningPath.domain';
import {
  AuthenticationProvider,
  ClassRoleEnum,
  UserEntity,
} from '../../server/util/types/user.types';

// learningPath persistence mock
const { mockLearningPathPeristence } = vi.hoisted(() => {
  return {
    mockLearningPathPeristence: {
      getLearningPaths: vi.fn(),
      createLearningPath: vi.fn(),
      getLearningPathById: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/learningPath.persistence', () => ({
  LearningPathPersistence: vi.fn().mockImplementation(() => {
    return mockLearningPathPeristence;
  }),
}));

const learningPathDomain = new LearningPathDomain();
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

let getLearningPathsQuery = {
  ...testPaginationFilter,
  keywords: ['keyword0', 'keyword1'],
  age: ['0', '1'],
};
let getLearningPathsInvalidPaginationQuery = {
  ...getLearningPathsQuery,
  page: '-1',
};
let getLearningPathsInvalidKeywordsQuery = {
  ...getLearningPathsQuery,
  keywords: [1],
};
let getLearningPathsInvalidAgeQuery = {
  ...getLearningPathsQuery,
  age: [1],
};

let createLearningPathParams = testLearningPaths[0];
let createLearningPathInvalidHruidParams = {
  ...createLearningPathParams,
  hruid: 0,
};
let createLearningPathInvalidLanguageParams = {
  ...createLearningPathParams,
  language: 0,
};
let createLearningPathInvalidTitleParams = {
  ...createLearningPathParams,
  title: 0,
};

// Tests
describe('learningPath domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLearningPathPeristence.getLearningPaths.mockImplementation((data, pag) => {
      return {};
    });
  });
  describe('getLearningPaths', () => {
    test('valid query passes', async () => {
      await expect(
        learningPathDomain.getLearningPaths(getLearningPathsQuery),
      ).resolves.not.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        learningPathDomain.getLearningPaths(getLearningPathsInvalidPaginationQuery),
      ).rejects.toThrow();
    });
    test('invalid keywords fails', async () => {
      await expect(
        learningPathDomain.getLearningPaths(getLearningPathsInvalidKeywordsQuery),
      ).rejects.toThrow();
    });
    test('invalid age fails', async () => {
      await expect(
        learningPathDomain.getLearningPaths(getLearningPathsInvalidAgeQuery),
      ).rejects.toThrow();
    });
  });
  describe('createLearningObject', () => {
    test('valid params and user is teacher passes', async () => {
      await expect(
        learningPathDomain.createLearningPath(createLearningPathParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('user is student fails', async () => {
      await expect(
        learningPathDomain.createLearningPath(createLearningPathParams, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40009 });
    });
    test('invalid hruid fails', async () => {
      await expect(
        learningPathDomain.createLearningPath(createLearningPathInvalidHruidParams, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid language fails', async () => {
      await expect(
        learningPathDomain.createLearningPath(createLearningPathInvalidLanguageParams, userTeacher),
      ).rejects.toThrow();
    });
    test('invalid title fails', async () => {
      await expect(
        learningPathDomain.createLearningPath(createLearningPathInvalidTitleParams, userTeacher),
      ).rejects.toThrow();
    });
  });
});
