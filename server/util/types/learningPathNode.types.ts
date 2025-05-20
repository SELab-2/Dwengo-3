import { z } from 'zod';
import { Uuid } from './assignment.types';
import { LearningObjectShort } from './learningObject.types';
import { Prisma } from '.prisma/client';
import { learningPathNodeSelectShort, learningPathNodeSelectDetail } from '../selectInput/select';

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: z
    .string()
    .regex(/^[0-9a-z]+$/)
    .or(z.string().uuid()),
  learningObjectId: z
    .string()
    .regex(/^[0-9a-z]+$/)
    .or(z.string().uuid()),
  instruction: z.string().optional(),
});

export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;

export type LearningPathNodeShort = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectShort;
}>;
export type LearningPathNodeDetail = Prisma.LearningPathNodeGetPayload<{
  select: typeof learningPathNodeSelectDetail;
}>;
