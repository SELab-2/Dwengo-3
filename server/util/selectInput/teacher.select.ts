import { classSelectShort } from './class.select';

export const teacherSelectShort = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const teacherSelectDetail = {
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
