import { LearningPathShort } from './learningPath.interfaces';
import { UserShort } from './user.interfaces';

export interface FavoriteShort {
  id: string;
  userId: string;
  currentNodeIndex: number;
  progress: number[];
  learningPath: LearningPathShort;
}

export interface FavoriteDetail {
  id: string;
  currentNodeIndex: number;
  progress: number[];
  learningPath: LearningPathShort;
  user: UserShort;
}

export interface FavoriteCreate {
  learningPathId: string;
}
