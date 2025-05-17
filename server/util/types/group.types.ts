import { groupSelectDetail, groupSelectShort } from '../selectInput/select';
import { AssignmentShort, Uuid } from './assignment.types';
import { Prisma } from '.prisma/client';

export type GroupShort = Prisma.GroupGetPayload<{
  select: typeof groupSelectShort;
}>;

export type GroupDetail = Prisma.GroupGetPayload<{
  select: typeof groupSelectDetail;
}>;
