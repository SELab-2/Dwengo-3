import { groupSelectDetail, groupSelectShort } from '../selectInput/select';
import { z } from 'zod';
import { Prisma } from '.prisma/client';

export type GroupShort = Prisma.GroupGetPayload<{
  select: typeof groupSelectShort;
}>;

export const UpdateIndexSchema = z.object({
  id: z.string().uuid(),
  index: z.number(),
});

export type UpdateIndexParams = z.infer<typeof UpdateIndexSchema>;

export type GroupDetail = Prisma.GroupGetPayload<{
  select: typeof groupSelectDetail;
}>;
