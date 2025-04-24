import { useMutation, useQuery } from '@tanstack/react-query';
import { createDiscussion, fetchDiscussionById, fetchDiscussions } from '../api/discussion';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { DiscussionDetail } from '../util/interfaces/discussion.interfaces';

/**
 * Fetches a list of discussions based on the provided group IDs.
 *
 * @param groupIds - A list of the groupIds of which the discussions need to be fetched
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @returns Paginated data containing the list of discussions.
 */
export function useDetailedDiscussionsByGroupIds(
  groupIds: string[],
  page?: number,
  pageSize?: number,
) {
  return useQuery({
    queryKey: ['discussions', groupIds, page, pageSize],
    queryFn: async () => {
      const discussions = await fetchDiscussions(groupIds, page, pageSize);

      const detailedDiscussions: PaginatedData<DiscussionDetail> = {
        data: await Promise.all(
          discussions.data.map(async (discussion) => {
            const detailedDiscussion = await fetchDiscussionById(discussion.id);
            return detailedDiscussion;
          }),
        ),
        totalPages: discussions.totalPages,
      };

      return detailedDiscussions;
    },
    enabled: !!groupIds,
    refetchOnWindowFocus: false,
  });
}

export function useCreateDiscussion() {
  return useMutation({
    mutationFn: async ({ groupId, message }: { groupId: string; message: string }) => {
      //TODO: update the created discussion with the message as soon as the endpoint is available
      return await createDiscussion({ groupId });
    },
  });
}
