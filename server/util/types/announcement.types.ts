import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { announcementSelectDetail, announcementSelectShort } from '../selectInput/select';

export enum FilterType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  EQUAL = 'EQUAL',
}

export const AnnouncementFilterQuerySchema = z
  .object({
    classId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
    timestamp: z.coerce.number().optional(),
    timestampFilterType: z.nativeEnum(FilterType).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  })
  .refine(
    (data) => {
      const a = data.timestamp === undefined && data.timestampFilterType === undefined;
      const b = data.timestamp !== undefined && data.timestampFilterType !== undefined;
      return a || b;
    },
    {
      message: 'timestamp and timestampFilterType must be provided together',
      path: [],
    },
  );

export const AnnouncementFilterSchema = z.object({
  classId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  timestamp: z.date().optional(),
  timestampFilterType: z.nativeEnum(FilterType).optional(),
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

export type AnnouncementByFilterQueryParams = z.infer<typeof AnnouncementFilterQuerySchema>;
export type AnnouncementByFilterParams = z.infer<typeof AnnouncementFilterSchema>;
export type AnnouncementCreatePersistenceParams = z.infer<
  typeof AnnouncementCreatePersistenceSchema
>;
export type AnnouncementCreateDomainParams = z.infer<typeof AnnouncementCreateDomainSchema>;
export type TeacherId = z.infer<typeof TeacherIdSchema>;
export type AnnouncementUpdateParams = z.infer<typeof AnnouncementUpdateSchema>;

export type AnnouncementDetail = Prisma.AnnouncementGetPayload<{
  select: typeof announcementSelectDetail;
}>;
export type AnnouncementShort = Prisma.AnnouncementGetPayload<{
  select: typeof announcementSelectShort;
}>;
