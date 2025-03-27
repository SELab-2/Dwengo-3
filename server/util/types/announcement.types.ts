import { z } from 'zod';

export const AnnouncementFilterSchema = z
  .object({
    classId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  });

export const AnnouncementCreatePersistenceSchema = z.object({
  title: z.string().min(1, 'Title must be a non-empty string').trim(),
  content: z.string().min(1, 'Content must be a non-empty string').trim(),
  classId: z.string(),
});

export const AnnouncementCreateDomainSchema = z.object({
  title: z.string().min(1, 'Title must be a non-empty string').trim(),
  content: z.string().min(1, 'Content must be a non-empty string').trim(),
  classId: z.string(),
});

export const TeacherIdSchema = z.string();

export const AnnouncementUpdateSchema = z.object({
  title: z.string().min(1, 'Title must be a non-empty string').trim().optional(),
  content: z.string().min(1, 'Content must be a non-empty string').trim().optional(),
});

export type AnnouncementByFilterParams = z.infer<typeof AnnouncementFilterSchema>;
export type AnnouncementCreatePersistenceParams = z.infer<
  typeof AnnouncementCreatePersistenceSchema
>;
export type AnnouncementCreateDomainParams = z.infer<typeof AnnouncementCreateDomainSchema>;
export type TeacherId = z.infer<typeof TeacherIdSchema>;
export type AnnouncementUpdateParams = z.infer<typeof AnnouncementUpdateSchema>;
