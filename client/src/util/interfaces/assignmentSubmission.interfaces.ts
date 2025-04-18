import { FavoriteShort } from './favorite.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';

export interface AssignmentSubmissionShort {
  id: string;
}

export interface AssignmentSubmissionDetail {
  id: string;
  submission: JSON;
  group: GroupShort;
  node: LearningPathNodeShort;
  favorite: FavoriteShort;
}
