import { UUID } from 'crypto';
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
 * @returns Succesfully created or not.
 */
export async function createAnnouncement(announcement: AnnouncementCreate) {
  const response = await apiClient.put(ApiRoutes.announcement.create, {
    announcement,
  });

  if (response.status == 200 || response.status == 201) {
    return true;
  }
  return false;
}

/**
 * Fetches a list of announcements
 *
 * @param classId - The id of the class whose announcements are to be fetched
 * @param teacherId - The id of the teacher whose announcements are to be fetched
 * @param studentID - The id of the student whose announcements are to be fetched
 * @returns A list of announcements
 */
export async function fetchAnnouncements(classId?: UUID, teacherId?: UUID, studentId?: UUID) {
  const response = await apiClient.get(ApiRoutes.announcement.list, {
    params: {
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
export async function fetchAnnouncementById(announcementId: UUID) {
  const response = await apiClient.get(ApiRoutes.class.get(announcementId));

  const result: AnnouncementDetail = response.data;
  return result;
}

/**
 * Update an announcement by its Id
 *
 * @param announcementId - The id of the announcement to be updated
 * @param data - The new data for the announcement
 * @returns Succesfully updated or not
 */
export async function updateAnnouncement(announcementId: UUID, data: AnnouncementUpdate) {
  const response = await apiClient.patch(ApiRoutes.class.update(announcementId), {
    data,
  });

  if (response.status == 200) {
    return true;
  }
  return false;
}
