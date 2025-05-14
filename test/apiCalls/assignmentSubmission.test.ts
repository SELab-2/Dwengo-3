import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createAssignmentSubmission,
  fetchAssignmentSubmissions,
  fetchAssignmentSubmissionById,
  updateAssignmentSubmission,
} from '../../client/src/api/assignmentSubmission';
import { SubmissionType } from '../../client/src/util/interfaces/assignmentSubmission.interfaces';

describe('Test announcementApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create assignmentSubmission', async () => {
    const expected = { data: 'Create assignmentSubmission' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockAssignmentSubmission = {
      favoriteId: '456',
      nodeId: '123',
      submissionType: SubmissionType.FILE,
    };

    const response = await createAssignmentSubmission(mockAssignmentSubmission);

    expect(apiClient.put).toHaveBeenCalledOnce();
    expect(response).toEqual(expected.data);
  });

  test('Fetch AssignmentSubmissions', async () => {
    const expected = { data: 'Fetch assignmentSubmissions' };
    (apiClient.get as any).mockResolvedValue(expected);
    const groupId = '123';
    const favoriteId = '456';
    const nodeId = '789';
    const page = 1;
    const pageSize = 10;

    const response = await fetchAssignmentSubmissions(groupId, favoriteId, nodeId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.assignmentSubmission.list, {
      params: {
        groupId,
        favoriteId,
        nodeId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch an assignmentSubmission by its id', async () => {
    const expected = { data: 'Fetch assignmentSubmission id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchAssignmentSubmissionById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.assignmentSubmission.get(id));
    expect(response).toEqual(expected.data);
  });

  test('Update assignmentSubmission', async () => {
    const expected = { data: 'Update assignmentSubmission' };
    (apiClient.patch as any).mockResolvedValue(expected);
    const mockAssignmentSubmission = {
      SubmissionType: SubmissionType.MULTIPLE_CHOICE,
      submission: 'submission',
    };
    const id = '456';

    const response = await updateAssignmentSubmission(id, mockAssignmentSubmission);

    expect(apiClient.patch).toHaveBeenCalledOnce();
    expect(response).toEqual(expected.data);
  });
});
