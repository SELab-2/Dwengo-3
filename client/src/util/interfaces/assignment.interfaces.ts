import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathShort } from './learningPath.interfaces';

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
