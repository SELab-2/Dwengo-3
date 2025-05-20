import { AnnouncementCreate, AnnouncementDetail } from '../util/interfaces/announcement.interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAnnouncement, fetchAnnouncementById, fetchAnnouncements } from '../api/announcement';
import { fetchNestedData } from '../api/util';

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
    queryKey: ['announcements', classId, teacherId, studentId, page, pageSize],
    queryFn: async () => {
      return await fetchAnnouncements(classId, teacherId, studentId, page, pageSize);
    },
    enabled: !!classId || !!teacherId || !!studentId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a list of announcements
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param classId - The id of the class whose announcements are to be fetched
 * @param teacherId - The id of the teacher whose announcements are to be fetched
 * @param studentId - The id of the student whose announcements are to be fetched
 * @returns A list of announcements
 */
export function useAnnouncementDetails(
  classId?: string,
  teacherId?: string,
  studentId?: string,
  page?: number,
  pageSize?: number,
) {
  return useQuery({
    queryKey: ['announcementDetails', classId, teacherId, studentId, page, pageSize],
    queryFn: async () => {
      const paginatedData = await fetchAnnouncements(classId, teacherId, studentId, page, pageSize);

      const announcementDetails: AnnouncementDetail[] = await fetchNestedData(
        paginatedData.data.map((announcementShort) => announcementShort.id),
        (announcementId) => fetchAnnouncementById(announcementId),
      );

      return {
        ...paginatedData,
        data: announcementDetails, // Replace the data with populated classes
      };
    },
    enabled: !!studentId || !!teacherId, // Enable the query only if studentId or teacherId is provided
    refetchOnWindowFocus: false,
  });
}

export function useAnnouncementCreate() {
  return useMutation({
    mutationFn: async (data: AnnouncementCreate) => {
      return await createAnnouncement(data);
    },
  });
}

export function useLatestsAnnouncements({
  studentId,
  teacherId,
}: {
  studentId?: string;
  teacherId?: string;
}) {
  return useQuery({
    queryKey: ['latestAnnouncements', studentId, teacherId],
    queryFn: async () => {
      const paginatedAnnouncements = await fetchAnnouncements(undefined, teacherId, studentId);
      const announcements = paginatedAnnouncements.data;

      // Fetch the details of each announcement
      const detailedAnnouncements = await Promise.all(
        announcements.map((announcement) => fetchAnnouncementById(announcement.id)),
      );

      // Sort the announcements by date in descending order
      detailedAnnouncements.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Sort in descending order
      });

      return detailedAnnouncements;
    },
    enabled: !!studentId || !!teacherId,
    refetchOnWindowFocus: false,
  });
}
