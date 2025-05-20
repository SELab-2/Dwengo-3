import { z } from 'zod';

export const LearningPathNodeTransitionCreateSchema = z.object({
  learningPathNodeId: z
    .string()
    .regex(/^[0-9a-z]+$/)
    .or(z.string().uuid()),
  toNodeIndex: z.number(),
  condition: z.string().optional(),
});

export type LearningPathNodeTransitionCreateParams = z.infer<
  typeof LearningPathNodeTransitionCreateSchema
>;
