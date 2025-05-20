import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import { createMessage, deleteMessage, fetchMessages } from '../../client/src/api/message';

describe('Test messageApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create message', async () => {
    const expected = { data: 'Create message' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockMessage = {
      discussionId: '123',
      content: 'content',
    };

    const response = await createMessage(mockMessage);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.message.create, mockMessage);
    expect(response).toEqual(expected.data);
  });

  test('Fetch messages', async () => {
    const expected = { data: 'Fetch messages' };
    (apiClient.get as any).mockResolvedValue(expected);
    const discussionId = '123';
    const page = 1;
    const pageSize = 10;

    const response = await fetchMessages(discussionId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.message.list, {
      params: {
        discussionId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Delete message', async () => {
    const expected = { data: 'Delete message' };
    (apiClient.delete as any).mockResolvedValue(expected);
    const id = '123';

    const response = await deleteMessage(id);

    expect(apiClient.delete).toHaveBeenCalledWith(ApiRoutes.message.delete(id));
    expect(response).toEqual(expected.data);
  });
});
