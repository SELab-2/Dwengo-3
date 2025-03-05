import { z } from "zod";


export const AnnouncementFilterSchema = z.object({
    //TODO specify that the length of these must be greater than 0
    classId: z.string().optional(),
    teacherId: z.string().optional(),
    studentId: z.string().optional(),
    id: z.string().optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one filter must be provided.",
    path: [],
});

export const AnnouncementCreateSchema = z.object({
    title: z.string().min(1, "Title must be a non-empty string").trim(),
    content: z.string().min(1, "Content must be a non-empty string").trim(),
    classId: z.string(),
    teacherId: z.string(),
});

export const AnnouncementUpdateSchema = z.object({
    id: z.string().uuid("Id must be a valid UUID"),
    title: z.string().min(1, "Title must be a non-empty string").trim().optional(),
    content: z.string().min(1, "Content must be a non-empty string").trim().optional(),
});


export type AnnouncementByFilterParams = z.infer<typeof AnnouncementFilterSchema>;
export type AnnouncementCreateParams = z.infer<typeof AnnouncementCreateSchema>;
export type AnnouncementUpdateParams = z.infer<typeof AnnouncementUpdateSchema>;




