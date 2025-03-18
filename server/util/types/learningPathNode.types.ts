import { z } from 'zod';

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: z.string(),
  learningObjectId: z.string(),
  instruction: z.string().optional(),
});

export type LearningPathNodeCreateParams = z.infer<
  typeof LearningPathNodeCreateSchema
>;
