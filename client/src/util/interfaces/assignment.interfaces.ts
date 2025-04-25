import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathDetail, LearningPathShort } from './learningPath.interfaces';

export interface AssignmentShort {
  id: string;
  learningPathId: string;
}

export interface AssignmentShort2 {
  id: string;
  groups: GroupShort[];
  learningPath: LearningPathDetail;
}

export interface AssignmentDetail {
  id: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort;
}

export interface PopulatedAssignment {
  id: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort | LearningPathDetail;
}

export interface AssignmentCreate {
  groups: string[];
  learningPathId: string;
  classId: string;
  teacherId: string;
}
