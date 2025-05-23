import {
  FavoriteCreate,
  FavoriteDetail,
  FavoriteShort,
} from '../util/interfaces/favorite.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of favorites based on the provided filters.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param userId - The userId of the user of which the favorites need to be fetched
 * @returns Paginated data containing the list of favorites.
 */
export async function fetchFavorites(userId?: string, page?: number, pageSize?: number) {
  const response = await apiClient.get(ApiRoutes.favorites.list, {
    params: {
      page,
      pageSize,
      userId,
    },
  });

  const result: PaginatedData<FavoriteShort> = response.data;

  return result;
}

/**
 * Ensures a favorite exists for the given learningPathId and userID (creates it if it doesn't exist).
 *
 * @param learningPathId - The ID of the learning path to be checked.
 * @param userId - The ID of the user to be checked.
 * @returns The favorite.
 */
export async function ensureFavorite(learningPathId?: string, userId?: string) {
  const favorite = await apiClient.get(ApiRoutes.favorites.list, {
    params: {
      userId,
      learningPathId,
    },
  });

  const result: PaginatedData<FavoriteShort> = favorite.data;
  if (result.data.length > 0) {
    return result.data[0];
  }

  return createFavorite({
    learningPathId: learningPathId!,
  });
}

/**
 * Fetches a favorite by its ID.
 *
 * @param id - The ID of the favorite to be fetched.
 * @returns The favorite details.
 */
export async function fetchFavoriteById(id: string) {
  const response = await apiClient.get(ApiRoutes.favorites.get(id));

  const result: FavoriteDetail = response.data;

  return result;
}

/**
 * Create a favorite
 *
 * @param data - The data of the favorite to be created
 * @returns The favoritedetails
 */
export async function createFavorite(data: FavoriteCreate) {
  const response = await apiClient.put(ApiRoutes.favorites.create, data);

  return response.data;
}

/**
 * Delete a favorite by its Id
 *
 * @param id - The id of the favorite to be deleted
 * @returs The favoritedetails
 */
export async function deleteFavorite(id: string) {
  const response = await apiClient.delete(ApiRoutes.favorites.delete(id));

  return response.data;
}
