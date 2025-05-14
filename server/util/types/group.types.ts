import { AssignmentShort, Uuid } from './assignment.types';
import { z } from 'zod';

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

export const UpdateIndexSchema = z.object({
  groupId: z.string().uuid(),
  index: z.number(),
});

export type UpdateIndexParams = z.infer<typeof UpdateIndexSchema>;
