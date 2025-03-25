import { beforeEach, describe, expect, test, vi } from 'vitest';
import { testLearningObject } from '../../testObjects.json';
import { LearningObjectDomain } from '../../../server/domain/learningObject.domain';
import { ClassRoleEnum, UserEntity } from '../../../server/util/types/user.types';


// Persistence mock
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
  vi.mock('../../persistence/learningObject.persistence', () => {
    return {
      ClassPersistence: vi.fn().mockImplementation(() => {
        return mockLearningObjectPeristence;
      }),
    };
  });

const learningObjectDomain = new LearningObjectDomain()
let testCreateParams = testLearningObject

// Tests
describe('learningObject domain', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });
    describe('createLearningObject', () => {
        beforeEach(() => {
            mockLearningObjectPeristence.createLearningObject.mockImplementation(() => {

            });
            testCreateParams = testLearningObject
        });
        test('valid user role and params passes', async () => {
            const testUser = { role: ClassRoleEnum.TEACHER }
            await expect(learningObjectDomain.createLearningObject(testLearningObject, testUser)).resolves.toBeDefined()
        });
        test('invalid user role fails', async () => {
            const testUser = { role: ClassRoleEnum.STUDENT }
            await expect(learningObjectDomain.createLearningObject(testLearningObject, testUser)).rejects.toThrow()
        });
        // describe('invalid params', () => {});
    });
});