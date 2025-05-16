import { FavoriteShort } from './favorite.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';

export enum SubmissionType {
  'FILE' = 'FILE',
  'MULTIPLE_CHOICE' = 'MULTIPLE_CHOICE',
  'READ' = 'READ',
}

export interface FileSubmission {
  fileName: string;
  filePath: string;
}

export interface MultipleChoiceSubmission {
  answer: number;
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
  submission?: MultipleChoiceSubmission;
  file?: File;
}

export interface AssignmentSubmissionUpdate {
  submissionType?: SubmissionType;
  submission?: MultipleChoiceSubmission;
  file?: File;
}
