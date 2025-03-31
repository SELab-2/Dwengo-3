import { AssignmentShort } from './assignment.types';
import { DiscussionShort } from './discussion.types';
import { StudentShort } from './user.types';

export interface GroupShort {
  id: string;
  name: string;
  progress: number;
  assignmentId: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  progress: number;
  assignment: AssignmentShort;
  discussion: DiscussionShort;
  students: StudentShort[];
}
