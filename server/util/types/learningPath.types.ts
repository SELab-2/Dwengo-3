import { z } from "zod";




export const LearningPathFilterSchema = z.object({
    keywords: z.array(z.string()).optional(),
    age: z.array(z.string())
        .transform((val) => val.map(Number))
        .optional(),
    id: z.string().optional(),
});

export const LearningPathCreateSchema = z.object({
    hruid: z.string(),
    language: z.string(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});


export type LearningPathByFilterParams = z.infer<typeof LearningPathFilterSchema>;
export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;
