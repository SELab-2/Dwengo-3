import { classSelectShort } from './class.select';
import { teacherSelectShort } from './teacher.select';

export const announcementSelectDetail = {
  id: true,
  title: true,
  content: true,
  class: {
    select: classSelectShort
  },
  teacher: {
    select: teacherSelectShort,
  },
};

export const announcementSelectShort = {
  id: true,
  title: true,
};
