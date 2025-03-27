import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockClassJoinRequestDomain } = vi.hoisted(() => {
  return {
    mockClassJoinRequestDomain: {
      createClassJoinRequest: vi.fn(),
      getJoinRequests: vi.fn(),
      handleJoinRequest: vi.fn(),
    },
  };
});
vi.mock('../../domain/classJoinRequest.domain', () => {
  return {
    ClassJoinRequestDomain: vi.fn().mockImplementation(() => {
      return mockClassJoinRequestDomain;
    }),
  };
});

const studentRoute = '/api/class/studentRequest';
const teacherRoute = '/api/class/teacherRequest';

describe('announcement routes test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /class/studentRequest', () => {
    test('Responds on getStudentJoinRequests', async () => {
      const query = { classId: '660e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getStudentJoinRequests' };
      mockClassJoinRequestDomain.getJoinRequests.mockResolvedValue(expected);

      await request(app).get(`${studentRoute}`).query(query).expect(200, expected);

      expect(mockClassJoinRequestDomain.getJoinRequests).toHaveBeenCalledWith(
        query,
        expect.any(Object),
      );
    });
  });

  describe('GET /class/teacherRequest', () => {
    test('Responds on getTeacherJoinRequests', async () => {
      const query = { classId: '660e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getTeacherJoinRequests' };
      mockClassJoinRequestDomain.getJoinRequests.mockResolvedValue(expected);

      await request(app).get(`${teacherRoute}`).query(query).expect(200, expected);

      expect(mockClassJoinRequestDomain.getJoinRequests).toHaveBeenCalledWith(
        query,
        expect.any(Object),
      );
    });
  });

  describe('PUT /class/studentRequest', () => {
    test('Responds on createStudentClassJoinRequest', async () => {
      const body = { classId: '660e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'createStudentClassJoinRequest' };
      mockClassJoinRequestDomain.createClassJoinRequest.mockResolvedValue(expected);

      await request(app).put(`${studentRoute}`).send(body).expect(200, expected);

      expect(mockClassJoinRequestDomain.createClassJoinRequest).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });

  describe('PUT /class/teacherRequest', () => {
    test('Responds on createSTeacherClassJoinRequest', async () => {
      const body = { classId: '660e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'createTeacherClassJoinRequest' };
      mockClassJoinRequestDomain.createClassJoinRequest.mockResolvedValue(expected);

      await request(app).put(`${teacherRoute}`).send(body).expect(200, expected);

      expect(mockClassJoinRequestDomain.createClassJoinRequest).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });

  describe('PUT /class/studentRequest', () => {
    test('Responds on handleStudentJoinRequest', async () => {
      const body = {
        requestId: 'a1b2c3d4-e5f6-7890-gh12-i34j56k78l90',
        decision: 'accept',
      };
      const expected = { endpoint: 'handleStudentJoinRequest' };
      mockClassJoinRequestDomain.handleJoinRequest.mockResolvedValue(expected);

      await request(app).post(`${studentRoute}`).send(body).expect(200, expected);

      expect(mockClassJoinRequestDomain.handleJoinRequest).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });

  describe('PUT /class/teacherRequest', () => {
    test('Responds on handleTeacherJoinRequest', async () => {
      const body = {
        requestId: 'a1b2c3d4-e5f6-7890-gh12-i34j56k78l90',
        decision: 'accept',
      };
      const expected = { endpoint: 'handleTeacherJoinRequest' };
      mockClassJoinRequestDomain.handleJoinRequest.mockResolvedValue(expected);

      await request(app).post(`${teacherRoute}`).send(body).expect(200, expected);

      expect(mockClassJoinRequestDomain.handleJoinRequest).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });
});
