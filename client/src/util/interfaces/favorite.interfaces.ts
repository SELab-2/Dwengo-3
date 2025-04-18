import { UUID } from 'crypto';
import { LearningPathShort } from './learningPath.interfaces';
import { UserShort } from './user.interfaces';

export interface FavoriteShort {
  id: UUID;
  userId: UUID;
  progress: number[];
  learningPath: LearningPathShort;
}

export interface FavoriteDetail {
  id: UUID;
  progress: number[];
  learningPath: LearningPathShort;
  user: UserShort;
}

export interface FavoriteCreate {
  learningPathId: UUID;
}
