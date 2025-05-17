import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createClass,
  deleteStudentFromClass,
  deleteTeacherFromClass,
  fetchClassById,
  fetchClasses,
  updateClass,
} from '../../client/src/api/class';

describe('Test classApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create class', async () => {
    const expected = { data: 'Create class' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockClass = {
      name: 'testClass',
    };

    const response = await createClass(mockClass);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.class.create, mockClass);
    expect(response).toEqual(expected.data);
  });

  test('Fetch Classes', async () => {
    const expected = { data: 'Fetch classes' };
    (apiClient.get as any).mockResolvedValue(expected);
    const teacherId = '456';
    const studentId = '789';
    const page = 1;
    const pageSize = 10;

    const response = await fetchClasses(studentId, teacherId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.class.list, {
      params: {
        studentId,
        teacherId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch a class by its id', async () => {
    const expected = { data: 'Fetch class id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchClassById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.class.get(id));
    expect(response).toEqual(expected.data);
  });

  test('Update class', async () => {
    const expected = { data: 'Update class' };
    (apiClient.patch as any).mockResolvedValue(expected);
    const mockClass = {
      name: 'classupdate',
    };
    const id = '456';

    const response = await updateClass(id, mockClass);

    expect(apiClient.patch).toHaveBeenCalledWith(ApiRoutes.class.update(id), mockClass);
    expect(response).toEqual(expected.data);
  });

  test('Delete teacher', async () => {
    const expected = { data: 'Delete teacher' };
    (apiClient.delete as any).mockResolvedValue(expected);
    const classId = '123';
    const teacherId = '456';

    const response = await deleteTeacherFromClass(classId, teacherId);

    expect(apiClient.delete).toHaveBeenCalledWith(
      ApiRoutes.class.deleteTeacher(classId, teacherId),
    );
    expect(response).toEqual(expected.data);
  });

  test('Delete student', async () => {
    const expected = { data: 'Delete student' };
    (apiClient.delete as any).mockResolvedValue(expected);
    const classId = '123';
    const studentId = '456';

    const response = await deleteStudentFromClass(classId, studentId);

    expect(apiClient.delete).toHaveBeenCalledWith(
      ApiRoutes.class.deleteStudent(classId, studentId),
    );
    expect(response).toEqual(expected.data);
  });
});
