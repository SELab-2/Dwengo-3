import {
  DiscussionCreate,
  DiscussionDetail,
  DiscussionShort,
} from '../util/interfaces/discussion.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of discussions based on the provided filters.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param groupIds - A list of the groupIds of which the discussions need to be fetched
 * @returns Paginated data containing the list of discussions.
 */
export async function fetchDiscussions(groupIds?: string[], page?: number, pageSize?: number) {
  const response = await apiClient.get(ApiRoutes.discussion.list, {
    params: {
      page,
      pageSize,
      ...(groupIds && groupIds.length > 0 ? { groupIds } : {}),
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      if (params.page !== undefined) searchParams.append('page', params.page);
      if (params.pageSize !== undefined) searchParams.append('pageSize', params.pageSize);
      if (params.groupIds) {
        (Array.isArray(params.groupIds) ? params.groupIds : [params.groupIds]).forEach(
          (id: string) => searchParams.append('groupIds', id),
        );
      }
      return searchParams.toString();
    },
  });

  const result: PaginatedData<DiscussionShort> = response.data;

  return result;
}

/**
 * Fetches a discussion by its ID.
 *
 * @param id - The ID of the disussion to be fetched.
 * @returns The discussion details.
 */
export async function fetchDiscussionById(id: string) {
  const response = await apiClient.get(ApiRoutes.discussion.get(id));

  const result: DiscussionDetail = response.data;

  return result;
}

/**
 * Create a discussion
 *
 * @param data - The data of the discussion to be created
 * @returns The discussiondetails
 */
export async function createDiscussion(data: DiscussionCreate) {
  const response = await apiClient.put(ApiRoutes.discussion.create, data);

  return response.data;
}

/**
 * Update a discussion
 *
 * @param id - The ID of the discussion to be updated
 * @param data - The data of the discussion to be updated
 * @returns The discussiondetails
 */
export async function updateDiscussion(id: string, data: DiscussionCreate) {
  const response = await apiClient.put(ApiRoutes.discussion.update(id), {
    data,
  });

  return response.data;
}
