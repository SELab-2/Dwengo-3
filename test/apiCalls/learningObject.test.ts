import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createLearningObject,
  deleteLearningObject,
  fetchLearningObjectById,
  fetchLearningObjects,
  updateLearningObject,
} from '../../client/src/api/learningObject';

describe('Test learningObjectApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create learningObject', async () => {
    const expected = { data: 'Create learningObject' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockLearningObject = {
      hruid: 'hruid',
      string: 'string',
      version: 5,
      language: 'nl',
      title: 'title',
      content: 'content',
    };

    const response = await createLearningObject(mockLearningObject);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.learningObject.create, mockLearningObject);
    expect(response).toEqual(expected.data);
  });

  test('Fetch learingObjects', async () => {
    const expected = { data: 'Fetch learningObjects' };
    (apiClient.get as any).mockResolvedValue(expected);
    const keywords = ['word'];
    const targetAges = [12];
    const page = 1;
    const pageSize = 10;

    const response = await fetchLearningObjects(keywords, targetAges, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningObject.list, {
      params: {
        keywords,
        targetAges,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a learningObject by its id', async () => {
    const expected = { data: 'Fetch learningObject id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchLearningObjectById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.learningObject.get(id), {
      signal: undefined,
    });
    expect(response).toEqual(expected.data);
  });

  test('Update learningObject', async () => {
    const expected = { data: 'Update learningObject' };
    (apiClient.patch as any).mockResolvedValue(expected);
    const mockLearningObject = {
      title: 'title',
      content: 'content',
    };
    const id = '456';

    const response = await updateLearningObject(id, mockLearningObject);

    expect(apiClient.patch).toHaveBeenCalledWith(
      ApiRoutes.learningObject.update(id),
      mockLearningObject,
    );
    expect(response).toEqual(expected.data);
  });

  test('Delete learningObject', async () => {
    const expected = { data: 'Delete learningObject' };
    (apiClient.delete as any).mockResolvedValue(expected);
    const id = '123';

    const response = await deleteLearningObject(id);

    expect(apiClient.delete).toHaveBeenCalledWith(ApiRoutes.learningObject.delete(id));
    expect(response).toEqual(expected.data);
  });
});
