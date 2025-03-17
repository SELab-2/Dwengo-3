import { z } from "zod";

export const LearningPathNodeTransitionCreateSchema = z.object({
  learningPathNodeId: z.string(),
  toNodeIndex: z.number(),
  condition: z.string().optional(),
});

export type LearningPathNodeTransitionCreateParams = z.infer<
  typeof LearningPathNodeTransitionCreateSchema
>;
