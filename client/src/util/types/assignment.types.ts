import { ClassShort } from './class.types';
import { GroupShort } from './group.types';
import { LearningPathDetail, LearningPathShort } from './learningPath.types';

export interface AssignmentShort {
  id: string;
  learningPathId: string;
}

export interface AssignmentDetail {
  id: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort;
}

// TODO: add other relevant types
export interface PopulatedAssignment {
  id: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort | LearningPathDetail;
}
