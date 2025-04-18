import { MessageShort, MessageCreate } from '../util/interfaces/message.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';

/**
 * Fetches a list of messages based on the provided filters.
 *
 * @param discussionId - The discussionId of the discussion of which the messages need to be fetched
 * @returns Paginated data containing the list of messages.
 */
export async function fetchMessages(discussionId?: string) {
  const response = await apiClient.get(ApiRoutes.message.list, {
    params: {
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
 * @returns The messagedetails or false
 */
export async function createMessage(data: MessageCreate) {
  const response = await apiClient.put(ApiRoutes.message.create, {
    data,
  });

  if (response.status == 200 || response.status == 201) {
    return response.data;
  }
  return false;
}

/**
 * Delete a message by its Id
 *
 * @param id - The id of the message to be deleted
 * @returs The messagedetails or false
 */
export async function deleteMessage(id: string) {
  const response = await apiClient.delete(ApiRoutes.message.delete(id));

  if (response.status == 200) {
    return response.data;
  }
  return false;
}
