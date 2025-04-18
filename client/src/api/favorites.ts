import { UUID } from 'crypto';
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
 * @param userId - The userId of the user of which the favorites need to be fetched
 * @returns Paginated data containing the list of favorites.
 */
export async function fetchFavorites(userId?: UUID) {
  const response = await apiClient.get(ApiRoutes.favorites.list, {
    params: {
      userId,
    },
  });

  const result: PaginatedData<FavoriteShort> = response.data;

  return result;
}

/**
 * Fetches a favorite by its ID.
 *
 * @param id - The ID of the favorite to be fetched.
 * @returns The favorite details.
 */
export async function fetchFavoriteById(id: UUID) {
  const response = await apiClient.get(ApiRoutes.favorites.get(id));

  const result: FavoriteDetail = response.data;

  return result;
}

/**
 * Create a favorite
 *
 * @param data - The data of the favorite to be created
 * @returns The favoritedetails or false
 */
export async function createFavorite(data: FavoriteCreate) {
  const response = await apiClient.put(ApiRoutes.favorites.create, {
    data,
  });

  if (response.status == 200 || response.status == 201) {
    return response.data;
  }
  return false;
}

/**
 * Delete a favorite by its Id
 *
 * @param id - The id of the favorite to be deleted
 * @returs The favoritedetails or false
 */
export async function deleteFavorite(id: UUID) {
  const response = await apiClient.delete(ApiRoutes.favorites.delete(id));

  if (response.status == 200) {
    return response.data;
  }
  return false;
}
