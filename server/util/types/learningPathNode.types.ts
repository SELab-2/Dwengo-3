import { z } from 'zod';
import { Uuid } from './assignment.types';
import { LearningObjectShort } from './learningObject.types';
import { Prisma } from '.prisma/client';
import {
  learningPathNodeSelectDetail,
  learningPathNodeSelectShort,
} from '../selectInput/learningPathNode.select';

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: z.string(),
  learningObjectId: z.string(),
  instruction: z.string().optional(),
});

export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;

export type LearningPathNodeShort = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectShort;
}>;
export type LearningPathNodeDetail = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectDetail;
}>;
