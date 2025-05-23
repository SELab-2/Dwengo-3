import { LearningObjectShort } from './learningObject.interfaces';
import { LearningPathNodeTransitionDetail } from './LearningPathNodeTransition.interfaces';

export interface LearningPathNodeShort {
  id: string;
  learningObject: LearningObjectShort;
}

export interface LearningPathNodeDetail {
  id: string;
  learningPathId: string;
  learningObject: LearningObjectShort;
  instruction: string;
  index: number;
  transitions: LearningPathNodeTransitionDetail[];
}

export interface LearningPathNodeCreate {
  learningPathId: string;
  learningObjectId: string;
  instruction: string;
}
