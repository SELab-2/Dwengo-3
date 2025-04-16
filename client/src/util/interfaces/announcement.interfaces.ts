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
