import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import { fetchStudentById, fetchStudents } from '../../client/src/api/student';

describe('Test studentApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Fetch students', async () => {
    const expected = { data: 'Fetch students' };
    (apiClient.get as any).mockResolvedValue(expected);
    const userId = '123';
    const classId = '456';
    const groupId = '789';
    const page = 1;
    const pageSize = 10;

    const response = await fetchStudents(userId, classId, groupId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.student.list, {
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

  test('Fetch a student by its id', async () => {
    const expected = { data: 'Fetch student id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchStudentById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.student.get(id));
    expect(response).toEqual(expected.data);
  });
});
