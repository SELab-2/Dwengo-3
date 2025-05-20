import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { learningPathNodeSelectShort, learningPathNodeSelectDetail } from '../selectInput/select';
import { InstructionZod, LearningObjectIdZod, LearningPathIdZod } from './util_types';

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: LearningPathIdZod,
  learningObjectId: LearningObjectIdZod,
  instruction: InstructionZod.optional(),
});

export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;

export type LearningPathNodeShort = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectShort;
}>;
export type LearningPathNodeDetail = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectDetail;
}>;
