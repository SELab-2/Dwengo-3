import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../server/app';

// Domain mock
const { mockDiscussionDomain } = vi.hoisted(() => {
  return {
    mockDiscussionDomain: {
      getDiscussions: vi.fn(),
      getDiscussionById: vi.fn(),
      createDiscussion: vi.fn(),
    },
  };
});
vi.mock('../../server/domain/discussion.domain', () => {
  return {
    DiscussionDomain: vi.fn().mockImplementation(() => {
      return mockDiscussionDomain;
    }),
  };
});

const route = '/discussion';
const agent = request.agent(app);

describe('discussion routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /discussion', () => {
    test('Responds on getDiscussions', async () => {
      const query = { groupIds: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getDiscussions' };
      mockDiscussionDomain.getDiscussions.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockDiscussionDomain.getDiscussions).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('GET /discussion/:id', () => {
    test('Responds on getDiscussionById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getDiscussionById' };
      mockDiscussionDomain.getDiscussionById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockDiscussionDomain.getDiscussionById).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });

  describe('PUT /discussion', () => {
    test('Responds on createDiscussion', async () => {
      const body = {
        groupId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expected = { endpoint: 'createDiscussion' };
      mockDiscussionDomain.createDiscussion.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockDiscussionDomain.createDiscussion).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });
});
