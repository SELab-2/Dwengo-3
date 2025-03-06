import { z } from 'zod';

export const DiscussionFilterSchema = z.object({
    id: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one filter must be provided.",
    path: [], 
});

export type DiscussionFilterParams = z.infer<typeof DiscussionFilterSchema>;