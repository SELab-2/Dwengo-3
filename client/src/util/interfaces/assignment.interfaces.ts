import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathShort } from './learningPath.interfaces';
import { TeacherShort } from './teacher.interfaces';

export interface AssignmentShort {
  id: string;
  learningPathId: string;
}

export interface AssignmentDetail {
  id: string;
  teacher: TeacherShort;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort;
}
