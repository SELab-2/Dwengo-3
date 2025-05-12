import { FavoriteShort } from './favorite.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';
import { SubmissionType } from './learningObject.interfaces.ts';

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
  submission?: string | object;
  file?: string;
}

export interface AssignmentSubmissionUpdate {
  submissionType?: SubmissionType;
  submission?: string | object;
}
