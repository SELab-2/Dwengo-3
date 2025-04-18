import { UUID } from 'crypto';
import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathShort, LearningPathDetail } from './learningPath.interfaces';

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

export interface PopulatedAssignment {
  id: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort | LearningPathDetail;
}

export interface AssignmentCreate {
  groups: [UUID];
  learningPathId: UUID;
  classId: UUID;
  teacherId: UUID;
}
