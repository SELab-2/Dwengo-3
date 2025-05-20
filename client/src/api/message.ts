import { MessageCreate, MessageShort } from '../util/interfaces/message.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of messages based on the provided filters.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param discussionId - The discussionId of the discussion of which the messages need to be fetched
 * @returns Paginated data containing the list of messages.
 */
export async function fetchMessages(discussionId?: string, page?: number, pageSize?: number) {
  const response = await apiClient.get(ApiRoutes.message.list, {
    params: {
      page,
      pageSize,
      discussionId,
    },
  });

  const result: PaginatedData<MessageShort> = response.data;

  return result;
}

/**
 * Create a message
 *
 * @param data - The data of the message to be created
 * @returns The messagedetails
 */
export async function createMessage(data: MessageCreate) {
  const response = await apiClient.put(ApiRoutes.message.create, data);

  return response.data;
}

/**
 * Delete a message by its Id
 *
 * @param id - The id of the message to be deleted
 * @returs The messagedetails
 */
export async function deleteMessage(id: string) {
  const response = await apiClient.delete(ApiRoutes.message.delete(id));

  return response.data;
}
