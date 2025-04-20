import {
  AnnouncementCreate,
  AnnouncementDetail,
  AnnouncementShort,
  AnnouncementUpdate,
} from '../util/interfaces/announcement.interfaces';
import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import { PaginatedData } from '../util/interfaces/general.interfaces';

/**
 * Creates a new announcement
 *
 * @param announcement - The data of the new announcement.
 * @returns The announcementdetails
 */
export async function createAnnouncement(announcement: AnnouncementCreate) {
  const response = await apiClient.put(ApiRoutes.announcement.create, {
    announcement,
  });

  return response.data;
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
export async function fetchAnnouncements(
  classId?: string,
  teacherId?: string,
  studentId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.announcement.list, {
    params: {
      page,
      pageSize,
      classId,
      teacherId,
      studentId,
    },
  });

  const result: PaginatedData<AnnouncementShort> = response.data;

  return result;
}

/**
 * Fetch an announcement by its ID
 *
 * @param announcementId - The id of the announcement to be fetched
 * @returns The announcementdata
 */
export async function fetchAnnouncementById(announcementId: string) {
  const response = await apiClient.get(ApiRoutes.announcement.get(announcementId));

  const result: AnnouncementDetail = response.data;
  return result;
}

/**
 * Update an announcement by its Id
 *
 * @param announcementId - The id of the announcement to be updated
 * @param data - The new data for the announcement
 * @returns The announcementdetails
 */
export async function updateAnnouncement(announcementId: string, data: AnnouncementUpdate) {
  const response = await apiClient.patch(ApiRoutes.announcement.update(announcementId), {
    data,
  });

  return response.data;
}
