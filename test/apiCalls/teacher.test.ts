import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import { fetchTeacherById, fetchTeachers } from '../../client/src/api/teacher';

describe('Test teacherApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Fetch teachers', async () => {
    const expected = { data: 'Fetch teachers' };
    (apiClient.get as any).mockResolvedValue(expected);
    const userId = '123';
    const classId = '456';
    const groupId = '789';
    const page = 1;
    const pageSize = 10;

    const response = await fetchTeachers(userId, classId, groupId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.teacher.list, {
      params: {
        userId,
        classId,
        groupId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a teacher by its id', async () => {
    const expected = { data: 'Fetch teacher id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchTeacherById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.teacher.get(id));
    expect(response).toEqual(expected.data);
  });
});
