import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFavorite,
  deleteFavorite,
  ensureFavorite,
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
export function useFavorite(
  learningPathId?: string,
  userID?: string,
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ['favorite', learningPathId, userID, page, pageSize],
    queryFn: async () => {
      return await fetchFavorites(userID, page, pageSize, learningPathId);
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Ensures a favorite exists for the given learningPathId and userID (creates it if it doesn't exist).
 *
 * @returns A mutation object that can be used to trigger the ensureFavorite logic.
 */
export function useEnsureFavorite() {
  return useMutation({
    mutationFn: async ({
      learningPathId,
      userID,
    }: {
      learningPathId?: string;
      userID?: string;
    }) => {
      return await ensureFavorite(learningPathId, userID);
    },
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
 * Creates a favorite.
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
