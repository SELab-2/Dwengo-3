import { beforeEach, describe, expect, test, vi } from 'vitest';
import apiClient from '../../client/src/api/apiClient';
import { ApiRoutes } from '../../client/src/api/api.routes';
import {
  createAnnouncement,
  fetchAnnouncementById,
  fetchAnnouncements,
  updateAnnouncement,
} from '../../client/src/api/announcement';

describe('Test announcementApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Create announcement', async () => {
    const expected = { data: 'Create announcement' };
    (apiClient.put as any).mockResolvedValue(expected);
    const mockAnnouncement = {
      title: 'title',
      content: 'content',
      classId: '123',
    };

    const response = await createAnnouncement(mockAnnouncement);

    expect(apiClient.put).toHaveBeenCalledWith(ApiRoutes.announcement.create, mockAnnouncement);
    expect(response).toEqual(expected.data);
  });

  test('Fetch Announcements', async () => {
    const expected = { data: 'Fetch announcements' };
    (apiClient.get as any).mockResolvedValue(expected);
    const classId = '123';
    const teacherId = '456';
    const studentId = '789';
    const page = 1;
    const pageSize = 10;

    const response = await fetchAnnouncements(classId, teacherId, studentId, page, pageSize);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.announcement.list, {
      params: {
        classId,
        teacherId,
        studentId,
        page,
        pageSize,
      },
    });
    expect(response).toEqual(expected.data);
  });

  test('Fetch an announcement by its id', async () => {
    const expected = { data: 'Fetch announcement id' };
    (apiClient.get as any).mockResolvedValue(expected);
    const id = '123';

    const response = await fetchAnnouncementById(id);

    expect(apiClient.get).toHaveBeenCalledWith(ApiRoutes.announcement.get(id));
    expect(response).toEqual(expected.data);
  });

  test('Update announcement', async () => {
    const expected = { data: 'Update announcement' };
    (apiClient.patch as any).mockResolvedValue(expected);
    const mockAnnouncement = {
      title: 'title',
      content: 'content',
    };
    const id = '456';

    const response = await updateAnnouncement(id, mockAnnouncement);

    expect(apiClient.patch).toHaveBeenCalledWith(
      ApiRoutes.announcement.update(id),
      mockAnnouncement,
    );
    expect(response).toEqual(expected.data);
  });
});
