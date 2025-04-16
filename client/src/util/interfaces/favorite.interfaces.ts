import { LearningPathShort } from './learningPath.interfaces';
import { UserShort } from './user.interfaces';

export interface FavoriteShort {
  id: string;
  userId: string;
  progress: number[];
  learningPath: LearningPathShort;
}

export interface FavoriteDetail {
  id: string;
  progres: number[];
  learningPath: LearningPathShort;
  user: UserShort;
}
