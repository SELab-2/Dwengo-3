import { z } from "zod";

export type AssignmentJson = {
    groups: string[][],
    classId: string,
    teacherId: string,
    learningPathId: string
};

export const AssignmentFilterSchema = z.object({
    classId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional()
});

export const AssignmentJsonSchema = z.object({
    groups: z.string().uuid().array().array().nonempty(),
    classId: z.string().uuid(),
    teacherId: z.string().uuid(),
    learningPathId: z.string().uuid()
});

export const IdSchema = z.string().uuid();

export type AssignmentFilterParams = z.infer<typeof AssignmentFilterSchema>