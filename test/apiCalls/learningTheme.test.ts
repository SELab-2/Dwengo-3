import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import { fetchLearningThemeById, fetchLearningThemes } from '../../client/src/api/learningTheme';

describe('Test announcementApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Fetch learningThemes', async () => {
    const expected = { data: 'Fetch learningThemes' };
    (apiClient.get as any).mockResolvedValue(expected);
    const page = 1;
    const pageSize = 10;

    const response = await fetchLearningThemes(page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningTheme.list, {
      params: {
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a learningTheme by its id', async () => {
    const expected = { data: 'Fetch learningTheme id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchLearningThemeById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningTheme.get(id));
    expect(response).toEqual(expected.data);
  });
});
