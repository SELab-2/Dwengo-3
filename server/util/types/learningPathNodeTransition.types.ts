import { z } from 'zod';
import { ConditionZod, IndexZod, NodeIdZod } from './util_types';

export const LearningPathNodeTransitionCreateSchema = z.object({
  learningPathNodeId: NodeIdZod,
  toNodeIndex: IndexZod,
  condition: ConditionZod.optional(),
});

export type LearningPathNodeTransitionCreateParams = z.infer<
  typeof LearningPathNodeTransitionCreateSchema
>;
