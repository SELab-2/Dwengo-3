import { beforeEach, describe, expect, test, vi } from 'vitest';
import { testLearningObject, testKeywords } from '../../testObjects.json';
import { LearningObjectDomain } from '../../../server/domain/learningObject.domain';
import { ClassRoleEnum, UserEntity } from '../../../server/util/types/user.types';

/*
// learningObject persistence mock
const { mockLearningObjectPeristence } = vi.hoisted(() => {
  return {
    mockLearningObjectPeristence: {
      getLearningObjects: vi.fn(),
      createLearningObject: vi.fn(),
      updateLearningObject: vi.fn(),
      getLearningObjectById: vi.fn(),
      deleteLearningObject: vi.fn(),
    },
  };
});
vi.mock('../../../server/persistence/learningObject.persistence', () => ({
  LearningObjectPersistence: vi.fn().mockImplementation(() => {
    return mockLearningObjectPeristence;
  })
}));

// learningObjectKeyword persistence mock
const { mockLearningObjectKeywordPeristence } = vi.hoisted(() => {
  return {
    mockLearningObjectKeywordPeristence: {
      updateLearningObjectKeywords: vi.fn(),
    },
  };
});
vi.mock('../../../server/persistence/learningObjectKeyword.persistence', () => ({
  LearningObjectKeywordPersistence: vi.fn().mockImplementation(() => {
    return mockLearningObjectKeywordPeristence;
  })
}));


const learningObjectDomain = new LearningObjectDomain()
let createId = 'id';
let createParams = { ...testLearningObject, keywords: testKeywords };
let createResult = { ...testLearningObject, id: createId};

// Tests
describe('learningObject domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('createLearningObject', () => {
    beforeEach(() => {
      createParams = { ...testLearningObject, keywords: testKeywords };
      createResult = { ...testLearningObject, id: createId};
      mockLearningObjectPeristence.createLearningObject.mockImplementation(() => {
        return createResult;
      });
      mockLearningObjectKeywordPeristence.updateLearningObjectKeywords(() => {
        return testKeywords
      });
    });
    test('valid user role and params passes', async () => {
      const testUser = { role: ClassRoleEnum.TEACHER }
      await expect(learningObjectDomain.createLearningObject(createParams, testUser)).resolves.toBeDefined()
    });
    test('invalid user role fails', async () => {
      const testUser = { role: ClassRoleEnum.STUDENT }
      await expect(learningObjectDomain.createLearningObject(createParams, testUser)).rejects.toThrow()
    });
    // describe('invalid params', () => {});
  });
});
*/