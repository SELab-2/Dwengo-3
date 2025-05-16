import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createAssignment,
  fetchAssignmentById,
  fetchAssignments,
} from '../../client/src/api/assignment';

describe('Test assignmentApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create assignment', async () => {
    const expected = { data: 'Create assignment' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockAssignment = {
      name: 'testname',
      description: 'testdescription',
      groups: [['testgroup']],
      learningPathId: '456',
      classId: '123',
      teacherId: '789',
    };

    const response = await createAssignment(mockAssignment);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.assignment.create, mockAssignment);
    expect(response).toEqual(expected.data);
  });

  test('Fetch Assignments', async () => {
    const expected = { data: 'Fetch assignments' };
    (apiClient.get as any).mockResolvedValue(expected);
    const classId = '123';
    const teacherId = '456';
    const studentId = '789';
    const groupId = '012';
    const page = 1;
    const pageSize = 10;

    const response = await fetchAssignments({
      classId,
      groupId,
      studentId,
      teacherId,
      page,
      pageSize,
    });

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.assignment.list, {
      params: {
        classId,
        groupId,
        studentId,
        teacherId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch an assignment by its id', async () => {
    const expected = { data: 'Fetch assignment id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchAssignmentById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.assignment.get(id));
    expect(response).toEqual(expected.data);
  });
});
