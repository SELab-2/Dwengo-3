import { beforeEach, describe, expect, test, vi } from 'vitest';
import { testClasses, testPaginationFilter, testTeachers, testStudents, testUsers, testLearningObjects } from '../../testObjects.json';
import { LearningObjectDomain } from '../../../server/domain/learningObject.domain';
import { ClassRoleEnum, UserEntity } from '../../../server/util/types/user.types';

// learningObject persistence mock
const { mockLearningObjectPeristence, mockLearningObjectKeywordPeristence } = vi.hoisted(() => {
  return {
    mockLearningObjectPeristence: {
      getLearningObjects: vi.fn(),
      createLearningObject: vi.fn(),
      updateLearningObject: vi.fn(),
      getLearningObjectById: vi.fn(),
      deleteLearningObject: vi.fn(),
    },
    mockLearningObjectKeywordPeristence: {
      updateLearningObjectKeywords: vi.fn(),
    },
  };
});
vi.mock('../../../server/persistence/learningObject.persistence', () => ({
  LearningObjectPersistence: vi.fn().mockImplementation(() => {
    return mockLearningObjectPeristence;
  })
}));
vi.mock('../../../server/persistence/learningObjectKeyword.persistence', () => ({
  LearningObjectKeywordPersistence: vi.fn().mockImplementation(() => {
    return mockLearningObjectKeywordPeristence;
  })
}));

const learningObjectDomain = new LearningObjectDomain()
let userTeacher: UserEntity = { 
  ...testUsers[0], 
  role: testUsers[0].role as ClassRoleEnum ,
  teacher: testTeachers[0]
};
let userStudent: UserEntity = { 
  ...testUsers[5], 
  role: testUsers[5].role as ClassRoleEnum, 
  student: testStudents[0]
};

let getLearningObjectsQuery = {
  ...testPaginationFilter,
  keywords: ['keyword0', 'keyword1'],
  targetAges: ['0', '1'],
};
let getLearningObjectsInvalidPaginationQuery = {
  ...getLearningObjectsQuery,
  page: '-1',
};
let getLearningObjectsInvalidKeywordsQuery = {
  ...getLearningObjectsQuery,
  keywords: [1],
};
let getLearningObjectsInvalidTargetAgesQuery = {
  ...getLearningObjectsQuery,
  targetAges: [1],
};

let learningObjectId = testLearningObjects[0].id;
let createLearningObjectParams = testLearningObjects[0];
let updateLearningObjectParams = testLearningObjects[0];

let deleteLearningObjectId = testLearningObjects[0].id;
let deleteLearningObjectUnexistingId = '3388e211-d585-4ee0-8556-34958491fcd5';

// Tests
describe('learningObject domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLearningObjectPeristence.getLearningObjects.mockImplementation((pag, data) => {
      return {};
    });
    mockLearningObjectPeristence.getLearningObjectById.mockImplementation((id: string) => {
      let found = testLearningObjects.find(lo => lo.id === id)
          if (found) {
              return found;
          }
      return null;
    });
  });
  describe('getLearningObjects', () => {
    test('valid query passes', async () => {
      await expect(learningObjectDomain.getLearningObjects(getLearningObjectsQuery)).resolves.not.toThrow()
    });
    test('invalid pagination fails', async () => {
      await expect(learningObjectDomain.getLearningObjects(getLearningObjectsInvalidPaginationQuery)).rejects.toThrow()
    });
    test('invalid keywords fails', async () => {
      await expect(learningObjectDomain.getLearningObjects(getLearningObjectsInvalidKeywordsQuery)).rejects.toThrow()
    });
    test('invalid target ages fails', async () => {
      await expect(learningObjectDomain.getLearningObjects(getLearningObjectsInvalidTargetAgesQuery)).rejects.toThrow()
    });
  });
  describe('createLearningObject', () => {
    test('valid params and user is teacher passes', async () => {
      await expect(learningObjectDomain.createLearningObject(createLearningObjectParams, userTeacher)).resolves.not.toThrow()
    });
    test('user is student fails', async () => {
      await expect(learningObjectDomain.createLearningObject(createLearningObjectParams, userStudent)).rejects.toThrow()
    });
  });
  describe('updateLearningObject', () => {
    test('valid params and user is teacher passes', async () => {
      await expect(learningObjectDomain.updateLearningObject(learningObjectId, updateLearningObjectParams, userTeacher)).resolves.not.toThrow()
    });
    /* geen user check
    test('user is student fails', async () => {
      await expect(learningObjectDomain.updateLearningObject(learningObjectId, updateLearningObjectParams, userStudent)).rejects.toThrow()
    });
    */
  });
  /* geen id uuid check
  describe('getLearningObjectById', () => {

  });
  */
  describe('deleteLearningObject', () => {
    test('existing learningobject and no nodes passes', async () => {
      await expect(learningObjectDomain.deleteLearningObject(deleteLearningObjectId, userTeacher)).resolves.not.toThrow()
    });
    test('nonexisting learningobject fails', async () => {
      await expect(learningObjectDomain.deleteLearningObject(deleteLearningObjectUnexistingId, userStudent)).rejects.toThrow()
    });
    test('existing nodes fails', async () => {
      mockLearningObjectPeristence.getLearningObjectById.mockImplementation((id: string) => {
        return { ...testLearningObjects[0], learningPathNodes: ['node'] };
      });
      await expect(learningObjectDomain.deleteLearningObject(deleteLearningObjectUnexistingId, userStudent)).rejects.toThrow()
    });
  });
});