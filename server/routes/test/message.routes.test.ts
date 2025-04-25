import request from 'supertest';
import { describe, beforeEach, test, vi, expect, beforeAll } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockMessageDomain } = vi.hoisted(() => {
  return {
    mockMessageDomain: {
      getMessages: vi.fn(),
      createMessage: vi.fn(),
      deleteMessage: vi.fn(),
    },
  };
});
vi.mock('../../domain/message.domain', () => {
  return {
    MessageDomain: vi.fn().mockImplementation(() => {
      return mockMessageDomain;
    }),
  };
});

const route = '/message';
const agent = request.agent(app);

describe('message routes test', () => {
  beforeAll(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /message', () => {
    test('Responds on getMessages', async () => {
      const query = { discussionId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getMessages' };
      mockMessageDomain.getMessages.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockMessageDomain.getMessages).toHaveBeenCalledWith(query, expect.any(Object));
    });
  });

  describe('PUT /message', () => {
    test('Responds on createMessage', async () => {
      const body = {
        discussionId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Hello, how are you?',
      };
      const expected = { endpoint: 'createMessage' };
      mockMessageDomain.createMessage.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockMessageDomain.createMessage).toHaveBeenCalledWith(body, expect.any(Object));
    });
  });

  describe('DELETE /message/:id', () => {
    test('Responds on deleteMessage', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'deleteMessage' };
      mockMessageDomain.deleteMessage.mockResolvedValue(expected);

      await agent.delete(`${route}/${id}`).expect(200, expected);

      expect(mockMessageDomain.deleteMessage).toHaveBeenCalledWith(id, expect.any(Object));
    });
  });
});
