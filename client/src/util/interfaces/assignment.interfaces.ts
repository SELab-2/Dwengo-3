import { ClassShort } from './class.interfaces';
import { GroupShort } from './group.interfaces';
import { LearningPathDetail, LearningPathShort } from './learningPath.interfaces';
import { TeacherShort } from './teacher.interfaces';

export interface AssignmentShort {
  id: string;
  name: string;
  learningPathId: string;
}

export interface AssignmentShort2 {
  id: string;
  name: string;
  groups: GroupShort[];
  class: {
    id: string;
    name: string;
  };
  learningPath: {
    id: string;
    title: string;
    learningPathNodes: {
      learningObject: {
        estimatedTime: number;
      };
    }[];
  };
  deadline?: string;
}

export interface AssignmentDetail {
  id: string;
  name: string;
  description: string;
  teacher: TeacherShort;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort;
  deadline?: string;
}

export interface PopulatedAssignment {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  class: ClassShort;
  groups: GroupShort[];
  learningPath: LearningPathShort | LearningPathDetail;
}

export interface AssignmentCreate {
  name: string;
  description: string;
  groups: string[][];
  learningPathId: string;
  classId: string;
  teacherId: string;
  deadline: string;
}
