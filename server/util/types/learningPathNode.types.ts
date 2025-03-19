import { z } from "zod";
import { Uuid } from "./assignment.types";
import { LearningObjectShort } from "./learningObject.types";
import { Decimal } from "@prisma/client/runtime/library";

export const LearningPathNodeCreateSchema = z.object({
  learningPathId: z.string(),
  learningObjectId: z.string(),
  instruction: z.string().optional(),
  startNode: z.boolean(),
});

export type LearningPathNodeCreateParams = z.infer<
  typeof LearningPathNodeCreateSchema
>;

export type LearningPathNodeShort = {
  id: Uuid,
  learningObject: LearningObjectShort
};
