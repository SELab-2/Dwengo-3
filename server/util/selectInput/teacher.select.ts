import { Prisma } from '@prisma/client';
import { classSelectShort } from './class.select';

export const teacherSelectShort: Prisma.TeacherSelect = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const teacherSelectDetail: Prisma.TeacherSelect = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
  classes: {
    select: classSelectShort,
  },
};
