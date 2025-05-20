import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AssignmentSubmissionDomain } from '../../server/domain/assignmentSubmission.domain';
import { UserEntity } from '../../server/util/types/user.types';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';
import {
  testFavorites,
  testGroups,
  testLearningPathNodes,
  testLearningPaths,
  testPaginationFilter,
  testStudents,
  testTeachers,
  testUsers,
} from '../testObjects.json';

const {
  mockAssignmentSubmissionPersistence,
  mockFavoritesPersistence,
  mockGroupPersistence,
  mockLearningPathNodePeristence,
} = vi.hoisted(() => {
  return {
    mockAssignmentSubmissionPersistence: {
      getAssignmentSubmissions: vi.fn(),
      getAssignmentSubmissionById: vi.fn(),
      createAssignmentSubmission: vi.fn(),
      updateAssignmentSubmission: vi.fn(),
    },
    mockFavoritesPersistence: {
      getFavorites: vi.fn(),
      getFavoriteById: vi.fn(),
      createFavorite: vi.fn(),
      deleteFavorite: vi.fn(),
      updateProgress: vi.fn(),
    },
    mockGroupPersistence: {
      getGroupById: vi.fn(),
      getGroupByIdWithCustomIncludes: vi.fn(),
    },
    mockLearningPathNodePeristence: {
      createLearningPathNode: vi.fn(),
      getLearningPathNodeById: vi.fn(),
      getLearningPathNodeCount: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/assignmentSubmission.persistence', () => ({
  AssignmentSubmissionPersistence: vi.fn().mockImplementation(() => {
    return mockAssignmentSubmissionPersistence;
  }),
}));
vi.mock('../../server/persistence/favorites.persistence', () => ({
  FavoritesPersistence: vi.fn().mockImplementation(() => {
    return mockFavoritesPersistence;
  }),
}));
vi.mock('../../server/persistence/group.persistence', () => ({
  GroupPersistence: vi.fn().mockImplementation(() => {
    return mockGroupPersistence;
  }),
}));
vi.mock('../../server/persistence/learningPathNode.persistence', () => ({
  LearningPathNodePersistence: vi.fn().mockImplementation(() => {
    return mockLearningPathNodePeristence;
  }),
}));

const assignmentSubmissionDomain = new AssignmentSubmissionDomain();

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
let userStudentOtherGroup: UserEntity = {
  ...testUsers[7],
  role: testUsers[7].role as ClassRoleEnum,
  student: testStudents[2],
  provider: AuthenticationProvider.LOCAL,
};
let userStudentOtherFavorite: UserEntity = {
  ...testUsers[6],
  role: testUsers[6].role as ClassRoleEnum,
  student: testStudents[1],
  provider: AuthenticationProvider.LOCAL,
};

let nonexistingId = '48216c8c-dad4-46a3-aa31-67984512db5a';

let getAssignmentSubmissionsQuery = {
  ...testPaginationFilter,
  groupId: testGroups[0].id,
  nodeId: testLearningPathNodes[0].id,
  favoriteId: testFavorites[0].id,
};
let getAssignmentSubmissionsEmptyQuery = {
  ...testPaginationFilter,
};
let getAssignmentSubmissionsInvalidGroupIdQuery = {
  ...testPaginationFilter,
  groupId: 'id',
};
let getAssignmentSubmissionsInvalidNodeIdQuery = {
  ...testPaginationFilter,
  nodeId: '',
};
let getAssignmentSubmissionsInvalidFavoriteIdQuery = {
  ...testPaginationFilter,
  favoriteId: 'id',
};
let getAssignmentSubmissionsInvalidPaginationQuery = {
  ...testPaginationFilter,
  groupId: testGroups[0].id,
  page: '-1',
};
let getAssignmentSubmissionsNonexistentGroupQuery = {
  ...testPaginationFilter,
  groupId: nonexistingId,
};

let createFavoriteBody = { learningPathId: testLearningPaths[0].id };
let createFavoriteInvalidIdBody = { learningPathId: 'id' };

let deleteFavoriteId = testFavorites[0].id;
let deleteFavoriteNonexistingId = nonexistingId;

describe('assignmentSubmission domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFavoritesPersistence.getFavoriteById.mockImplementation((id: string) => {
      let found = testFavorites.find((f) => f.id === id);
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
  describe('getAssignmentSubmissions', () => {
    test('valid query passes', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsQuery,
          userStudent,
        ),
      ).resolves.not.toThrow();
    });
    test('empty query fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsEmptyQuery,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('invalid group id fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsInvalidGroupIdQuery,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('invalid node id fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsInvalidNodeIdQuery,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('invalid favorite id fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsInvalidFavoriteIdQuery,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsInvalidPaginationQuery,
          userStudent,
        ),
      ).rejects.toThrow();
    });
    test('group does not exist fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsNonexistentGroupQuery,
          userStudent,
        ),
      ).rejects.toMatchObject({ _errorCode: 40413 });
    });
    test('user is not teacher of group fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsQuery,
          userTeacherOtherGroup,
        ),
      ).rejects.toMatchObject({ _errorCode: 40001 });
    });
    test('user is not student of group fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsQuery,
          userStudentOtherGroup,
        ),
      ).rejects.toMatchObject({ _errorCode: 40002 });
    });
    test('favorite does not belong to user fails', async () => {
      await expect(
        assignmentSubmissionDomain.getAssignmentSubmissions(
          getAssignmentSubmissionsQuery,
          userStudentOtherFavorite,
        ),
      ).rejects.toMatchObject({ _errorCode: 40043 });
    });
  });
});
