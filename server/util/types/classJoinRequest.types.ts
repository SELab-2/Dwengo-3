import { z } from "zod";

export const ClassJoinRequestCreateScheme = z.object({
  classId: z.string().uuid("ClassId must be a valid UUID"),
});

export type ClassJoinRequestCreateParams = z.infer<
  typeof ClassJoinRequestCreateScheme
>;

export const ClassJoinRequestFilterSchema = z.object({
  id: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

export type ClassJoinRequestFilterParams = z.infer<
  typeof ClassJoinRequestFilterSchema
>;

export const ClassJoinRequestDecisionSchema = z
  .object({
    requestId: z.string().uuid(),
    decision: z.enum(["accept", "deny"]),
  })
  .transform((data) => {
    return {
      requestId: data.requestId,
      acceptRequest: data.decision === "accept",
    };
  });

export type ClassJoinRequestDecisionParams = z.infer<
  typeof ClassJoinRequestDecisionSchema
>;

export enum ClassJoinRequestType {
  STUDENT = "student",
  TEACHER = "teacher",
}
