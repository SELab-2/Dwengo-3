import { z } from 'zod';

export const DiscussionFilterSchema = z.object({
    id: z.string().uuid().optional(),
    groupIds: z.string().uuid().array().optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one filter must be provided.",
    path: [], 
});

export const DiscussionCreateSchema = z.object({
    groupId: z.string().uuid(),
    members: z.string().uuid().array()
})

export type DiscussionFilterParams = z.infer<typeof DiscussionFilterSchema>;
export type DiscussionCreateParams = z.infer<typeof DiscussionCreateSchema>;