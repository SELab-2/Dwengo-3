import { learningPathSelectShort } from './learningPath.select';
import { userSelectShort } from './user.select';

export const FavoriteSelectDetail = {
  id: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};

export const FavoriteSelectShort = {
  id: true,
  userId: true,
  learningPathId: true,
  progress: true,
};
