import { TeacherShort } from './teacher.interfaces';

export interface AnnouncementShort {
  id: string;
  title: string;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  teacher: TeacherShort;
}

export interface AnnouncementCreate {
  title: string;
  content: string;
  classId: string;
}

export interface AnnouncementUpdate {
  title?: string;
  content?: string;
}
