import { AssignmentShort, Uuid } from './assignment.types';

export type GroupShort = {
  id: Uuid;
  progress: number[];
  assignmentId: Uuid;
  name: string;
};

export type GroupDetail = {
  id: Uuid;
  name: string;
  progress: number[];
  assignment: AssignmentShort;
  discussion: any;
  students: any[];
};
