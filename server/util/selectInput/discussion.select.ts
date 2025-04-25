import { Prisma } from '@prisma/client';
import { groupSelectShort } from './group.select';
import { userSelectShort } from './user.select';
import { messageSelectDetail } from './message.select';

export const discussionSelectShort = {
  id: true,
};

export const discussionSelectDetail = {
  id: true,
  group: {
    select: groupSelectShort,
  },
  members: {
    select: userSelectShort,
  },
  messages: {
    select: messageSelectDetail,
  },
};
