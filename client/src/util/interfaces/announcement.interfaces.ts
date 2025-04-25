import { TeacherShort } from './teacher.interfaces';
import { ClassShort } from './class.interfaces.ts';

export interface AnnouncementShort {
  id: string;
  title: string;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  teacher: TeacherShort;
  class: ClassShort;
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
