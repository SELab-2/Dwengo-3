import { Prisma } from '@prisma/client';
import { classSelectShort } from './class.select';
import { groupSelectShort } from './group.select';

export const studentSelectShort: Prisma.StudentSelect = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const studentSelectDetail: Prisma.StudentSelect = {
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
  groups: {
    select: groupSelectShort,
  },
};
