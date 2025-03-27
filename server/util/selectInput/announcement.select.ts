import { Prisma } from '@prisma/client';
import { teacherSelectShort } from './teacher.select';

export const announcementSelectDetail: Prisma.AnnouncementSelect = {
  id: true,
  title: true,
  content: true,
  teacher: {
    select: teacherSelectShort,
  },
};

export const announcementSelectShort: Prisma.AnnouncementSelect = {
  id: true,
  title: true,
};
