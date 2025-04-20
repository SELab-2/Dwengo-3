import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncementById, fetchAnnouncements } from '../api/announcement';

/**
 * Fetches an announcement by its ID.
 *
 * @param id - The ID of the announcement to be fetched.
 * @returns The query object containing the announcement data.
 */
export function useAnnouncementById(id: string) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      return await fetchAnnouncementById(id);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a list of announcements based on the provided student and teacher IDs.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param classId - The id of the class whose announcements are to be fetched
 * @param teacherId - The id of the teacher whose announcements are to be fetched
 * @param studentId - The id of the student whose announcements are to be fetched
 * @returns The query object containing the announcements data.
 */
export function useAnnouncements(
  classId?: string,
  teacherId?: string,
  studentId?: string,
  page?: number,
  pageSize?: number,
) {
  return useQuery({
    queryKey: ['class', classId, teacherId, studentId, page, pageSize],
    queryFn: async () => {
      return await fetchAnnouncements(classId, teacherId, studentId, page, pageSize);
    },
    enabled: !!classId || !!teacherId || !!studentId,
    refetchOnWindowFocus: false,
  });
}
