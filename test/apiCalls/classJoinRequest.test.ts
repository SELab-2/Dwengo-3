import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createClassJoinRequestStudent,
  createClassJoinRequestTeacher,
  getClassJoinRequestsStudent,
  getClassJoinRequestsTeacher,
  handleClassJoinRequestStudent,
  handleClassJoinRequestTeacher,
} from '../../client/src/api/classJoinRequest';
import { Decision } from '../../client/src/util/interfaces/classJoinRequest.interfaces';

describe('Test classJoinRequestapi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create classJoinRequest student', async () => {
    const expected = { data: 'Create classJoinRequest student' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockRequest = {
      classId: '123',
    };

    const response = await createClassJoinRequestStudent(mockRequest);

    expect(apiClient.put).toHaveBeenCalledWith(
      ApiRoutes.classJoinRequest.student.create,
      mockRequest,
    );
    expect(response).toEqual(expected.data);
  });

  test('Create classJoinRequest teacher', async () => {
    const expected = { data: 'Create classJoinRequest teacher' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockRequest = {
      classId: '123',
    };

    const response = await createClassJoinRequestTeacher(mockRequest);

    expect(apiClient.put).toHaveBeenCalledWith(
      ApiRoutes.classJoinRequest.teacher.create,
      mockRequest,
    );
    expect(response).toEqual(expected.data);
  });

  test('Fetch classJoinRequests student', async () => {
    const expected = { data: 'Fetch classJoinRequests student' };
    (apiClient.get as any).mockResolvedValue(expected);
    const classId = '123';
    const userId = '456';
    const page = 1;
    const pageSize = 10;

    const response = await getClassJoinRequestsStudent(classId, userId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.classJoinRequest.student.list, {
      params: {
        classId,
        userId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch classJoinRequests teacher', async () => {
    const expected = { data: 'Fetch classJoinRequests teacher' };
    (apiClient.get as any).mockResolvedValue(expected);
    const classId = '123';
    const userId = '456';
    const page = 1;
    const pageSize = 10;

    const response = await getClassJoinRequestsTeacher(classId, userId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.classJoinRequest.teacher.list, {
      params: {
        classId,
        userId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Handle classJoinRequest student', async () => {
    const expected = { data: 'Handle classJoinRequest student' };
    (apiClient.post as any).mockResolvedValue(expected);
    const requestId = '123';
    const decision = Decision.accept;

    const response = await handleClassJoinRequestStudent({ requestId, decision });

    expect(apiClient.post).toHaveBeenCalledWith(ApiRoutes.classJoinRequest.student.reply, {
      requestId,
      decision,
    });
    expect(response).toEqual(expected.data);
  });

  test('Handle classJoinRequest teacher', async () => {
    const expected = { data: 'Handle classJoinRequest teacher' };
    (apiClient.post as any).mockResolvedValue(expected);
    const requestId = '123';
    const decision = Decision.accept;

    const response = await handleClassJoinRequestTeacher({ requestId, decision });

    expect(apiClient.post).toHaveBeenCalledWith(ApiRoutes.classJoinRequest.teacher.reply, {
      requestId,
      decision,
    });
    expect(response).toEqual(expected.data);
  });
});
