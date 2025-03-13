import { z } from "zod";

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: z.string(),
  learningObjectId: z.string(),
  instruction: z.string().optional(),
  startNode: z.boolean(),
});

export type LearningPathNodeCreateParams = z.infer<
  typeof LearningPathNodeCreateSchema
>;
