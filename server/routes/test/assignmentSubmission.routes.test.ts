import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockAssignmentSubmissionDomain } = vi.hoisted(() => {
  return {
    mockAssignmentSubmissionDomain: {
      getAssignmentSubmissions: vi.fn(),
      getAssignmentSubmissionById: vi.fn(),
      createAssignmentSubmission: vi.fn(),
      updateAssignmentSubmission: vi.fn(),
    },
  };
});
vi.mock('../../domain/assignmentSubmission.domain', () => {
  return {
    AssignmentSubmissionDomain: vi.fn().mockImplementation(() => {
      return mockAssignmentSubmissionDomain;
    }),
  };
});

const route = '/api/assignmentSubmission';

describe('assignmentSubmission routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /assignmentSubmission', () => {
    test('Responds on getAssignmentSubmissions', async () => {
      const query = { groupId: '880e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getAssignmentSubmissions' };
      mockAssignmentSubmissionDomain.getAssignmentSubmissions.mockResolvedValue(expected);

      await request(app).get(`${route}`).query(query).expect(200, expected);

      expect(mockAssignmentSubmissionDomain.getAssignmentSubmissions).toHaveBeenCalledWith(
        query,
        expect.any(Object),
      );
    });
  });

  describe('GET /assignmentSubmission/:id', () => {
    test('Responds on getAssignmentSubmissionById', async () => {
      const id = '880e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getAssignmentSubmissionById' };
      mockAssignmentSubmissionDomain.getAssignmentSubmissionById.mockResolvedValue(expected);

      await request(app).get(`${route}/${id}`).expect(200, expected);

      expect(mockAssignmentSubmissionDomain.getAssignmentSubmissionById).toHaveBeenCalledWith(
        id,
        expect.any(Object),
      );
    });
  });

  describe('PUT /assignmentSubmission', () => {
    test('Responds on createAssignmentSubmission', async () => {
      const body = {
        groupId: '880e8400-e29b-41d4-a716-446655440000',
        nodeId: '110e8400-e29b-41d4-a716-446655440000',
        submissionType: 'MULTIPLE_CHOICE',
        submission: 'multiplechoice',
      };
      const expected = { endpoint: 'createAssignmentSubmission' };
      mockAssignmentSubmissionDomain.createAssignmentSubmission.mockResolvedValue(expected);

      await request(app).put(`${route}`).send(body).expect(200, expected);

      expect(mockAssignmentSubmissionDomain.createAssignmentSubmission).toHaveBeenCalledWith(
        expect.objectContaining({ body }),
        expect.any(Object),
      );
    });
  });

  describe('PATCH /assignmentSubmission', () => {
    test('Responds on updateAssignmentSubmission', async () => {
      const body = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        submissionType: 'MULTIPLE_CHOICE',
        submission: 'multiplechoice',
      };
      const expected = { endpoint: 'updateAssignmentSubmission' };
      mockAssignmentSubmissionDomain.updateAssignmentSubmission.mockResolvedValue(expected);

      await request(app).patch(`${route}`).send(body).expect(200, expected);

      expect(mockAssignmentSubmissionDomain.updateAssignmentSubmission).toHaveBeenCalledWith(
        expect.objectContaining({ body }),
        expect.any(Object),
      );
    });
  });
});
