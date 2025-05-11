import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  testLearningPathNodes,
  testLearningPathNodeTransitions,
  testTeachers,
  testStudents,
  testUsers,
  testLearningPaths,
} from '../testObjects.json';
import { LearningPathNodeTransitionDomain } from '../../server/domain/learningPathNodeTransition.domain';
import { ClassRoleEnum, UserEntity } from '../../server/util/types/user.types';

// learningPathNodeTransition persistence mock
const { mockLearningPathNodeTransitionPeristence } = vi.hoisted(() => {
  return {
    mockLearningPathNodeTransitionPeristence: {
      createLearningPathNodeTransition: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/learningPathNodeTransition.persistence', () => ({
  LearningPathNodeTransitionPersistence: vi.fn().mockImplementation(() => {
    return mockLearningPathNodeTransitionPeristence;
  }),
}));

const learningPathNodeTransitionDomain = new LearningPathNodeTransitionDomain();
let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
};
let userStudent: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
};

let createLearningPathNodeTransitionParams = testLearningPathNodeTransitions[0];
let createLearningPathNodeTransitionInvalidPathNodeIdParams = {
  ...createLearningPathNodeTransitionParams,
  learningPathNodeId: 0,
};
let createLearningPathNodeTransitionInvalidNodeIndexParams = {
  ...createLearningPathNodeTransitionParams,
  toNodeIndex: 'index',
};

// Tests
describe('learningPathNodeTransition domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('createLearningPathNodeTransition', () => {
    test('valid params and user is teacher passes', async () => {
      await expect(
        learningPathNodeTransitionDomain.createLearningPathNodeTransition(
          createLearningPathNodeTransitionParams,
          userTeacher,
        ),
      ).resolves.not.toThrow();
    });
    test('user is student fails', async () => {
      await expect(
        learningPathNodeTransitionDomain.createLearningPathNodeTransition(
          createLearningPathNodeTransitionParams,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('invalid pathnode id fails', async () => {
      await expect(
        learningPathNodeTransitionDomain.createLearningPathNodeTransition(
          createLearningPathNodeTransitionInvalidPathNodeIdParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
    test('invalid tonodeindex fails', async () => {
      await expect(
        learningPathNodeTransitionDomain.createLearningPathNodeTransition(
          createLearningPathNodeTransitionInvalidNodeIndexParams,
          userTeacher,
        ),
      ).rejects.toThrow();
    });
  });
});
