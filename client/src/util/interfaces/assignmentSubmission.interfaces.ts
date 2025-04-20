import { FavoriteShort } from './favorite.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';

enum SubmissionType {
  'FILE',
  'MULTIPLE_CHOICE',
}

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

export interface AssignmentSubmissionCreate {
  groupId?: string;
  favoriteId?: string;
  nodeId: string;
  submissionType: SubmissionType;
  submission: string | object;
  file?: string;
}

export interface AssignmentSubmissionUpdate {
  submissionType?: SubmissionType;
  submission?: string | object;
}
