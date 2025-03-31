import { Prisma } from '@prisma/client';
import { learningPathSelectShort } from './learningPath.select';
import { userSelectShort } from './user.select';

export const FavoriteSelectDetail: Prisma.FavoriteSelect = {
  id: true,
  userId: true,
  learningPathId: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};

export const FavoriteSelectShort: Prisma.FavoriteSelect = {
  id: true,
  userId: true,
  learningPathId: true,
  progress: true,
};
