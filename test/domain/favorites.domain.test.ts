import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FavoritesDomain } from '../../server/domain/favorites.domain';
import { UserEntity } from '../../server/util/types/user.types';
import { AuthenticationProvider, ClassRoleEnum } from '../../server/util/types/enums.types';
import {
  testDiscussions,
  testPaginationFilter,
  testTeachers,
  testStudents,
  testUsers,
  testLearningPaths,
  testFavorites,
} from '../testObjects.json';

const { mockFavoritesPersistence } = vi.hoisted(() => {
  return {
    mockFavoritesPersistence: {
      getFavorites: vi.fn(),
      getFavoriteById: vi.fn(),
      createFavorite: vi.fn(),
      deleteFavorite: vi.fn(),
      updateProgress: vi.fn(),
    },
  };
});
vi.mock('../../server/persistence/favorites.persistence', () => ({
  FavoritesPersistence: vi.fn().mockImplementation(() => {
    return mockFavoritesPersistence;
  }),
}));

const favoritesDomain = new FavoritesDomain();

let userTeacher: UserEntity = {
  ...testUsers[0],
  role: testUsers[0].role as ClassRoleEnum,
  teacher: testTeachers[0],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent1: UserEntity = {
  ...testUsers[5],
  role: testUsers[5].role as ClassRoleEnum,
  student: testStudents[0],
  provider: AuthenticationProvider.LOCAL,
};
let userStudent2: UserEntity = {
  ...testUsers[6],
  role: testUsers[6].role as ClassRoleEnum,
  student: testStudents[1],
  provider: AuthenticationProvider.LOCAL,
};

let getFavoritesQuery = {
  ...testPaginationFilter,
  userId: testFavorites[0].userId,
  learningPathId: testFavorites[0].learningPathId,
};
let getFavoritesInvalidUserIdQuery = {
  ...testPaginationFilter,
  ...getFavoritesQuery,
  userId: 'id',
};
let getFavoritesInvalidPaginationQuery = {
  ...testPaginationFilter,
  ...getFavoritesQuery,
  page: '-1',
};
let nonexistingId = 'f3a7a542-c213-4708-9c86-b8c835a65f6b';
let getFavoriteByIdId = testFavorites[0].id;
let getFavoriteByIdNonexistingId = nonexistingId;

let createFavoriteBody = { learningPathId: testLearningPaths[0].id };
let createFavoriteInvalidIdBody = { learningPathId: '' };

let deleteFavoriteId = testFavorites[0].id;
let deleteFavoriteNonexistingId = nonexistingId;

describe('favorites domain', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFavoritesPersistence.getFavoriteById.mockImplementation((id: string) => {
      let found = testFavorites.find((f) => f.id === id);
      if (found) {
        return found;
      }
      return null;
    });
  });
  describe('getFavorites', () => {
    test('valid params passes', async () => {
      await expect(
        favoritesDomain.getFavorites(getFavoritesQuery, userStudent1),
      ).resolves.not.toThrow();
    });
    test('invalid id fails', async () => {
      await expect(
        favoritesDomain.getFavorites(getFavoritesInvalidUserIdQuery, userStudent1),
      ).rejects.toThrow();
    });
    test('invalid pagination fails', async () => {
      await expect(
        favoritesDomain.getFavorites(getFavoritesInvalidPaginationQuery, userStudent1),
      ).rejects.toThrow();
    });
    test('user id is not params user id fails', async () => {
      await expect(
        favoritesDomain.getFavorites(getFavoritesQuery, userStudent2),
      ).rejects.toMatchObject({ _errorCode: 40042 });
    });
  });
  describe('getFavoriteById', () => {
    test('valid params passes', async () => {
      await expect(
        favoritesDomain.getFavoriteById(getFavoriteByIdId, userStudent1),
      ).resolves.not.toThrow();
    });
    test('user id is not params user id fails', async () => {
      await expect(
        favoritesDomain.getFavoriteById(getFavoriteByIdId, userStudent2),
      ).rejects.toMatchObject({ _errorCode: 40042 });
    });
    test('non existing id fails', async () => {
      await expect(
        favoritesDomain.getFavoriteById(getFavoriteByIdNonexistingId, userStudent1),
      ).rejects.toMatchObject({ _errorCode: 40414 });
    });
  });
  describe('createFavorite', () => {
    test('valid params passes', async () => {
      await expect(
        favoritesDomain.createFavorite(createFavoriteBody, userStudent1),
      ).resolves.not.toThrow();
    });
    test('invalid learning path id fails', async () => {
      await expect(
        favoritesDomain.createFavorite(createFavoriteInvalidIdBody, userStudent2),
      ).rejects.toThrow();
    });
  });
  describe('deleteFavorite', () => {
    test('valid params passes', async () => {
      await expect(
        favoritesDomain.deleteFavorite(deleteFavoriteId, userStudent1),
      ).resolves.not.toThrow();
    });
    test('user id is not params user id fails', async () => {
      await expect(
        favoritesDomain.deleteFavorite(deleteFavoriteId, userStudent2),
      ).rejects.toMatchObject({ _errorCode: 40042 });
    });
    test('non existing id fails', async () => {
      await expect(
        favoritesDomain.deleteFavorite(deleteFavoriteNonexistingId, userStudent1),
      ).rejects.toMatchObject({ _errorCode: 40414 });
    });
  });
});
