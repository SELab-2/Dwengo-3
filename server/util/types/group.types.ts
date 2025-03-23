import { Uuid } from './assignment.types';

export type GroupShort = {
  id: Uuid;
  nodeId: Uuid | null;
  assignmentId: Uuid;
};
