import { groupSelectDetail, groupSelectShort } from '../selectInput/select';
import { AssignmentShort, Uuid } from './assignment.types';
import { z } from 'zod';
import { Prisma } from '.prisma/client';

export type GroupShort = Prisma.GroupGetPayload<{
  select: typeof groupSelectShort;
}>;


export const UpdateIndexSchema = z.object({
  groupId: z.string().uuid(),
  index: z.number(),
});

export type UpdateIndexParams = z.infer<typeof UpdateIndexSchema>;

export type GroupDetail = Prisma.GroupGetPayload<{
  select: typeof groupSelectDetail;
}>;
