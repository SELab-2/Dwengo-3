import request from 'supertest';
import { describe, beforeEach, test, vi, expect } from 'vitest';
import { app } from '../../app';

// Domain mock
const { mockAnnouncementDomain } = vi.hoisted(() => {
  return {
    mockAnnouncementDomain: {
      getAnnouncements: vi.fn(),
      getAnnouncementById: vi.fn(),
      createAnnouncement: vi.fn(),
      updateAnnouncement: vi.fn(),
    },
  };
});
vi.mock('../../domain/announcement.domain', () => {
  return {
    AnnouncementDomain: vi.fn().mockImplementation(() => {
      return mockAnnouncementDomain;
    }),
  };
});

const route = '/announcement';
const agent = request.agent(app);

describe('announcement routes test', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    await agent
      .post('/auth/teacher/login/local')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);
  });

  describe('GET /announcement', () => {
    test('Responds on getAnnouncements', async () => {
      const query = { teacherId: '550e8400-e29b-41d4-a716-446655440000' };
      const expected = { endpoint: 'getAnnouncements' };
      mockAnnouncementDomain.getAnnouncements.mockResolvedValue(expected);

      await agent.get(`${route}`).query(query).expect(200, expected);

      expect(mockAnnouncementDomain.getAnnouncements).toHaveBeenCalledWith(
        query,
        expect.any(Object),
      );
    });
  });

  describe('GET /announcement/:id', () => {
    test('Responds on getAnnouncementById', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const expected = { endpoint: 'getAnnouncementById' };
      mockAnnouncementDomain.getAnnouncementById.mockResolvedValue(expected);

      await agent.get(`${route}/${id}`).expect(200, expected);

      expect(mockAnnouncementDomain.getAnnouncementById).toHaveBeenCalledWith(
        id,
        expect.any(Object),
      );
    });
  });

  describe('PUT /announcement', () => {
    test('Responds on createAnnouncement', async () => {
      const body = {
        title: 'Important announcement',
        content: 'This is an important announcement.',
        classId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expected = { endpoint: 'createAnnouncement' };
      mockAnnouncementDomain.createAnnouncement.mockResolvedValue(expected);

      await agent.put(`${route}`).send(body).expect(200, expected);

      expect(mockAnnouncementDomain.createAnnouncement).toHaveBeenCalledWith(
        body,
        expect.any(Object),
      );
    });
  });

  describe('PATCH /announcement/:id', () => {
    test('Responds on updateAnnouncement', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const body = {
        title: 'Important announcement',
        content: 'This is an important announcement.',
      };
      const expected = { endpoint: 'createAnnouncement' };
      mockAnnouncementDomain.updateAnnouncement.mockResolvedValue(expected);

      await agent.patch(`${route}/${id}`).send(body).expect(200, expected);

      expect(mockAnnouncementDomain.updateAnnouncement).toHaveBeenCalledWith(
        id,
        body,
        expect.any(Object),
      );
    });
  });
});
