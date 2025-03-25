import { classSelectShort } from './class.select';
import { groupSelectShort } from './group.select';

export const studentSelectShort = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const studentSelectDetail = {
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
