import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchGroupByGroupId } from '../api/group.ts';
import apiClient from '../api/apiClient.ts';
import { ApiRoutes } from '../api/api.routes.ts';
import { UpdateIndexParams } from '../util/interfaces/group.interfaces.ts';

/**
 * Hook to fetch a group by its ID or the ID of a favorite.
 *
 * @param groupId - The ID of the group to be fetched.
 * @returns The query object containing the group details.
 */
export function useGroup(groupId?: string) {
  return useQuery({
    queryKey: ['group'],
    queryFn: async () => {
      if (groupId) return await fetchGroupByGroupId(groupId);

      throw new Error('No groupId or favoriteId provided');
    },
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to update the current index for a group.
 *
 * @returns The mutation object that can be used to update the current index for a group.
 */
export function useUpdateCurrentIndexForGroup() {
  return useMutation({
    mutationFn: async (data: UpdateIndexParams) => {
      const response = await apiClient.patch(ApiRoutes.group.updateIndex, data);
      return response.data;
    },
  });
}
