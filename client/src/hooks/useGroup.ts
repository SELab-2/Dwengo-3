import { useQuery } from '@tanstack/react-query';
import { fetchGroupByFavoriteId, fetchGroupByGroupId } from '../api/group.ts';

export function useGroup(groupId?: string, favoriteId?: string) {
  return useQuery({
    queryKey: ['group'],
    queryFn: async () => {
      if (groupId) return await fetchGroupByGroupId(groupId);

      // todo:
      // if (favoriteId) await fetchGroupByFavoriteId(favoriteId);
      throw new Error('No groupId or favoriteId provided');
    },
    enabled: !!groupId || !!favoriteId,
    refetchOnWindowFocus: false,
  });
}
