import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createLearningPath,
  fetchLearningPathById,
  fetchLearningPaths,
} from '../../client/src/api/learningPath';

describe('Test learningPathApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create learningPath', async () => {
    const expected = { data: 'Create learningPath' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockLearningPath = {
      title: 'title',
      hruid: 'hruid',
      language: 'nl',
    };

    const response = await createLearningPath(mockLearningPath);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.learningPath.create, mockLearningPath);
    expect(response).toEqual(expected.data);
  });

  test('Fetch learningPaths', async () => {
    const expected = { data: 'Fetch learningPaths' };
    (apiClient.get as any).mockResolvedValue(expected);
    const keywords = ['word'];
    const ages = [12];
    const page = 1;
    const pageSize = 10;

    const response = await fetchLearningPaths(keywords, ages, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningPath.list, {
      params: {
        keywords,
        ages,
        page,
        pageSize,
      },
      paramsSerializer: expect.any(Function),
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a learningPath by its id', async () => {
    const expected = { data: 'Fetch learningPath id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchLearningPathById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningPath.get(id));
    expect(response).toEqual(expected.data);
  });
});
