import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createFavorite,
  deleteFavorite,
  fetchFavoriteById,
  fetchFavorites,
} from '../../client/src/api/favorites';

describe('Test favoritesApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create favorite', async () => {
    const expected = { data: 'Create favorite' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockFavorite = {
      learningPathId: '123',
    };

    const response = await createFavorite(mockFavorite);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.favorites.create, mockFavorite);
    expect(response).toEqual(expected.data);
  });

  test('Fetch favorites', async () => {
    const expected = { data: 'Fetch favorites' };
    (apiClient.get as any).mockResolvedValue(expected);
    const userId = '123';
    const page = 1;
    const pageSize = 10;

    const response = await fetchFavorites(userId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.favorites.list, {
      params: {
        userId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a favorite by its id', async () => {
    const expected = { data: 'Fetch favorite id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchFavoriteById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.favorites.get(id));
    expect(response).toEqual(expected.data);
  });

  test('Delete favorite', async () => {
    const expected = { data: 'Delete favorite' };
    (apiClient.delete as any).mockResolvedValue(expected);
    const id = '123';

    const response = await deleteFavorite(id);

    expect(apiClient.delete).toHaveBeenCalledWith(ApiRoutes.favorites.delete(id));
    expect(response).toEqual(expected.data);
  });
});
