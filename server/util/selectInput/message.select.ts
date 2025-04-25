import { userSelectShort } from './user.select';

export const messageSelectDetail = {
  id: true,
  content: true,
  sender: {
    select: userSelectShort,
  },
  discussionId: true,
  createdAt: true,
};

export const messageSelectShort = {
  id: true,
  content: true,
  sender: {
    select: userSelectShort,
  },
  createdAt: true,
};
