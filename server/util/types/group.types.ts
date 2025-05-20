import { groupSelectDetail, groupSelectShort } from '../selectInput/select';
import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { GroupIdZod, IndexZod } from './util_types';

export type GroupShort = Prisma.GroupGetPayload<{
  select: typeof groupSelectShort;
}>;

export const UpdateIndexSchema = z.object({
  id: GroupIdZod,
  index: IndexZod,
});

export type UpdateIndexParams = z.infer<typeof UpdateIndexSchema>;

export type GroupDetail = Prisma.GroupGetPayload<{
  select: typeof groupSelectDetail;
}>;
