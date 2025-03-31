import { LearningObjectShort } from './learningObject';
import { LearningPathNodeTransitionDetail } from './LearningPathNodeTransition.types';

export interface LearningPathNodeShort {
  id: string;
  learningObject: LearningObjectShort;
}

export interface LearningPathNodeDetail {
  id: string;
  learningPathId: string;
  learningObjectId: string;
  instruction: string;
  index: number;
  transitions: LearningPathNodeTransitionDetail[];
}
