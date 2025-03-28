import { Uuid } from './assignment.types';

export type GroupShort = {
  id: Uuid;
  progress: number[];
  assignmentId: Uuid;
  name: string;
};
