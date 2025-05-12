import {
  useAnnouncementById,
  useAnnouncementDetails,
  useAnnouncements,
} from '../../client/src/hooks/useAnnouncement';
import { fetchAnnouncementById, fetchAnnouncements } from '../../client/src/api/announcement';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { useQuery } from '../../client/node_modules/@tanstack/react-query';
import { mockUseQuery } from './setUpHookMocks';

vi.mock('../../client/src/api/announcement', () => {
  return {
    fetchAnnouncementById: vi.fn(),
    fetchAnnouncements: vi.fn(),
  };
});

describe('useAnnouncement', () => {
  beforeAll(() => {
    mockUseQuery();
  });

  it('useAnnouncementById', async () => {
    const mockId = '123';
    const mockData = { id: '123', title: 'Test title', content: 'Test content' };
    (fetchAnnouncementById as any).mockResolvedValue(mockData);

    const { data } = await useAnnouncementById(mockId);

    expect(fetchAnnouncementById).toHaveBeenCalledWith(mockId);

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['announcement', mockId],
      queryFn: expect.any(Function),
      enabled: true,
      refetchOnWindowFocus: false,
    });

    expect(data).toEqual(mockData);
  });

  it('useAnnouncements', async () => {
    const classId = '123';
    const teacherId = '456';
    const studentId = '789';
    const page = 1;
    const pageSize = 10;
    const mockData = { endpoint: 'useAnnouncements' };
    (fetchAnnouncements as any).mockResolvedValue(mockData);

    const { data } = await useAnnouncements(classId, teacherId, studentId, page, pageSize);

    expect(fetchAnnouncements).toHaveBeenCalledWith(classId, teacherId, studentId, page, pageSize);

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['announcements', classId, teacherId, studentId, page, pageSize],
      queryFn: expect.any(Function),
      enabled: true,
      refetchOnWindowFocus: false,
    });

    expect(data).toEqual(mockData);
  });

  it('useAnnouncements', async () => {
    const classId = '123';
    const teacherId = '456';
    const studentId = '789';
    const page = 1;
    const pageSize = 10;
    const mockData = { endpoint: 'useAnnouncementDetails' };
    (fetchAnnouncements as any).mockResolvedValue({ data: [{ id: '123' }] });
    (fetchAnnouncementById as any).mockResolvedValue(mockData);

    const { data } = await useAnnouncementDetails(classId, teacherId, studentId, page, pageSize);

    expect(fetchAnnouncements).toHaveBeenCalledWith(classId, teacherId, studentId, page, pageSize);
    expect(fetchAnnouncementById).toHaveBeenCalledWith('123');

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['announcementDetails', classId, teacherId, studentId, page, pageSize],
      queryFn: expect.any(Function),
      enabled: true,
      refetchOnWindowFocus: false,
    });

    expect(data).toEqual({ data: [mockData] });
  });
});
