import { TeacherShort } from './user.types';

export interface AnnouncementShort {
  id: string;
  title: string;
}

export interface AnnouncementDetail extends AnnouncementShort {
  content: string;
  teacher: TeacherShort;
}
