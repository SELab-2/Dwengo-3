import request from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { app } from '../../server/app';

// Domain mock
const { mockAssignmentDomain } = vi.hoisted(() => {
  return {
    mockAssignmentDomain: {
      getAssignments: vi.fn(),
      getAssignmentById: vi.fn(),
      createAssignment: vi.fn(),
    },
  };
});
vi.mock('../../server/domain/assignment.domain', () => {
  return {
    AssignmentDomain: vi.fn().mockImplementation(() => {
      return mockAssignmentDomain;
    }),
  };
});

const route = '/assignment';
const agent = request.agent(app);

describe('assignment routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /assignment', () => {
    test('Responds on getAssignment', async () => {
      const query = { teacherId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getAssignment' };
      mockAssignmentDomain.getAssignments.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockAssignmentDomain.getAssignments).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /assignment/:id', () => {
    test('Responds on getAssignmentById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getAssignmentById' };
      mockAssignmentDomain.getAssignmentById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockAssignmentDomain.getAssignmentById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });

  describe('PUT /assignment', () => {
    test('Responds on createAssignment', async () => {
      const body = {
        groups: [['550e8400-e29b-41d4-a716-446655440000']],
        learningPathId: '550e8400-e29b-41d4-a716-446655440000',
        classId: '550e8400-e29b-41d4-a716-446655440000',
        teacherId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expected = { endpoint: 'createAssignment' };
      mockAssignmentDomain.createAssignment.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockAssignmentDomain.createAssignment).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });
});
