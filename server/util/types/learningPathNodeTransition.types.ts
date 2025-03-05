import { z } from "zod";

export const LearningPathNodeTransitionCreateSchema = z.object({
    fromNodeId: z.string(),
    toNodeId: z.string(),
    condition: z.string().optional(),
});

export type LearningPathNodeTransitionCreateParams = z.infer<typeof LearningPathNodeTransitionCreateSchema>;


