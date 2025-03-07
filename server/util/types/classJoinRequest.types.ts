import { z } from "zod";

export const ClassJoinRequestScheme = z.object({
    classId: z.string().uuid("ClassId must be a valid UUID"),
})

export type ClassJoinRequestParams = z.infer<typeof ClassJoinRequestScheme>;

export const ClassJoinRequestFilterSchema = z.object({
    id: z.string().uuid().optional(),
    classId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  });
