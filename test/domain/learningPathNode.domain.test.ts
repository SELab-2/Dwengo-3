import { beforeEach, describe, expect, test, vi } from 'vitest';
import { testLearningPathNodes, testStudents, testTeachers, testUsers } from '../testObjects.json';
import { LearningPathNodeDomain } from '../../server/domain/learningPathNode.domain';
import { UserEntity } from '../../server/util/types/user.types';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';

// learningPathNode persistence mock
const { mockLearningPathNodePeristence } = vi.hoisted(() => {
  return {
    mockLearningPathNodePeristence: {
      createLearningPathNode: vi.fn(),
      getLearningPathNodeById: vi.fn(),
      getLearningPathNodeCount: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/learningPathNode.persistence', () => ({
  LearningPathNodePersistence: vi.fn().mockImplementation(() => {
    return mockLearningPathNodePeristence;
  }),
}));

const learningPathNodeDomain = new LearningPathNodeDomain();
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

let createLearningPathNodeParams = testLearningPathNodes[0];
let createLearningPathNodeInvalidPathIdParams = {
  ...createLearningPathNodeParams,
  learningPathId: 0,
};
let createLearningPathNodeInvalidObjectIdParams = {
  ...createLearningPathNodeParams,
  learningObjectId: 0,
};

// Tests
describe('learningPathNode domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('createLearningPathNode', () => {
    test('valid params and user is teacher passes', async () => {
      await expect(
        learningPathNodeDomain.createLearningPathNode(createLearningPathNodeParams, userTeacher),
      ).resolves.not.toThrow();
    });
    test('user is student fails', async () => {
      await expect(
        learningPathNodeDomain.createLearningPathNode(createLearningPathNodeParams, userStudent),
      ).rejects.toMatchObject({ _errorCode: 40009 });
    });
    test('invalid learningpath id fails', async () => {
      await expect(
        learningPathNodeDomain.createLearningPathNode(
          createLearningPathNodeInvalidPathIdParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('invalid learningobject id fails', async () => {
      await expect(
        learningPathNodeDomain.createLearningPathNode(
          createLearningPathNodeInvalidObjectIdParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
  });
});
