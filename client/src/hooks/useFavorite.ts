import { useQuery } from '@tanstack/react-query';
import {
  createFavorite,
  deleteFavorite,
  fetchFavoriteById,
  fetchFavorites,
} from '../api/favorites';
import { FavoriteCreate } from '../util/interfaces/favorite.interfaces';

/**
 * Fetches a list of favorites based on userID, page, and pageSize.
 *
 * @param userID - The userID to filter the favorites.
 * @param page - The page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @returns The query object containing the favorites data.
 */
export function useFavorite(userID?: string, page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['favorite', userID, page, pageSize],
    queryFn: async () => {
      return await fetchFavorites(userID, page, pageSize);
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a favorite by its ID.
 *
 * @param id - The ID of the favorite to be fetched.
 * @returns The query object containing the favorite data.
 */
export function useFavoriteById(id?: string) {
  return useQuery({
    queryKey: ['favorite', id],
    queryFn: async () => {
      return await fetchFavoriteById(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

/**
 * Creates a favoirte.
 *
 * @param data - The data of the favorite to be created.
 * @returns The query object containing the favorite data.
 */
export function useCreateFavorite(data?: FavoriteCreate) {
  return useQuery({
    queryKey: ['favorite', data],
    queryFn: async () => {
      return await createFavorite(data!);
    },
    enabled: !!data,
    refetchOnWindowFocus: false,
  });
}

/**
 * Deletes a favorite by its ID.
 *
 * @param id - The ID of the favorite to be deleted.
 * @returns The query object containing the favorite data.
 */
export function useDeleteFavorite(id?: string) {
  return useQuery({
    queryKey: ['favorite', id],
    queryFn: async () => {
      return await deleteFavorite(id!);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
