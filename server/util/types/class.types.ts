import { z } from "zod";

export const ClassFilterSchema = z.object({
    name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
    teacherIds: z
        .array(
            z.string()
            // TODO: Uncomment this line when we have teacher entries in the databse with uuids
            //.uuid("Each teacherId must be a valid UUID")
        )
        .optional(),
    studentIds: z
        .array(
            z.string()
            // TODO: Uncomment this line when we have student entries in the databse with uuids
            //.uuid("Each studentId must be a valid UUID")
        )
        .optional(),
});

export const ClassCreateSchema = z.object({
    name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});

export const ClassUpdateSchema = z.object({
    name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});


export type ClassUpdateParams = z.infer<typeof ClassUpdateSchema>;
export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;
export type ClassCreateParams = z.infer<typeof ClassCreateSchema>;