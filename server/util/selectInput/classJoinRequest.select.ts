import { classSelectShort } from './class.select';
import { userSelectShort } from './user.select';

export const classJoinRequestSelectDetail = {
  id: true,
  class: {
    select: classSelectShort,
  },
  user: {
    select: userSelectShort, // The role is given in the user object
  },
};
