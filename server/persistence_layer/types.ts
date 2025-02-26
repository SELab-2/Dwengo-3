import { z } from "zod";

export type AssignmentJson = {
    groups: string[][],
    classId: string,
    teacherId: string,
    learningPathId: string
};

export const AssignmentJsonSchema = z.object({
    groups: z.string().array().array().nonempty(),
    classId: z.string(),
    teacherId: z.string(),
    learningPathId: z.string()
});