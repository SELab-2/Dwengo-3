import { GroupShort } from './group.types';
import { LearningPathNodeShort } from './learningPathNode.types';

export interface AssignmentSubmissionShort {
  id: string;
}

export interface AssignmentSubmissionDetail extends AssignmentSubmissionShort {
  submission: JSON;
  group: GroupShort;
  node: LearningPathNodeShort;
}
