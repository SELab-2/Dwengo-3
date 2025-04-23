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
  progress: number[];
  learningPath: LearningPathShort;
  user: UserShort;
}

export interface FavoriteCreate {
  learningPathId: string;
}
