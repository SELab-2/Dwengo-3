import { AssignmentShort } from './assignment.interfaces';
import { DiscussionShort } from './discussion.interfaces';
import { StudentShort } from './student.interfaces';

export interface GroupShort {
  id: string;
  progress: number[];
  assignmentId: string;
  name: string;
  students: StudentShort[];
}

export interface GroupDetail {
  id: string;
  name: string;
  progress: number[];
  currentNodeIndex: number;
  assignment: AssignmentShort;
  discussion: DiscussionShort;
  students: StudentShort[];
}

export interface UpdateIndexParams {
  id: string;
  index: number;
}
