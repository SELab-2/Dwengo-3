import { UUID } from 'crypto';
import { FavoriteShort } from './favorite.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';

enum submissionType {
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
  groupId?: UUID;
  favoriteId?: UUID;
  nodeId: UUID;
  submissionType: submissionType;
  submission: string | object;
  file?: string;
}

export interface AssignmentSubmissionUpdate {
  submissionType?: submissionType;
  submission?: string | object;
}
