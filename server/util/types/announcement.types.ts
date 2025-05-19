import { z } from 'zod';
import { Prisma } from '.prisma/client';
import { announcementSelectDetail, announcementSelectShort } from '../selectInput/select';
import {
  ClassIdZod,
  ContentZod,
  StudentIdZod,
  TeacherIdZod,
  TimestampFilterTypeZod,
  TimestampZod,
  TitleZod,
} from './util_types';

export enum FilterType {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
  EQUAL = 'EQUAL',
}

export const AnnouncementFilterQuerySchema = z
  .object({
    classId: ClassIdZod.optional(),
    teacherId: TeacherIdZod.optional(),
    studentId: StudentIdZod.optional(),
    timestamp: TimestampZod.optional(),
    timestampFilterType: TimestampFilterTypeZod.optional(),
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
  classId: ClassIdZod.optional(),
  teacherId: TeacherIdZod.optional(),
  studentId: StudentIdZod.optional(),
  timestamp: TimestampZod.optional(),
  timestampFilterType: TimestampFilterTypeZod.optional(),
});

export const AnnouncementCreatePersistenceSchema = z.object({
  title: TitleZod,
  content: ContentZod,
  classId: ClassIdZod,
});

export const AnnouncementCreateDomainSchema = z.object({
  title: TitleZod,
  content: ContentZod,
  classId: ClassIdZod,
});

export const AnnouncementUpdateSchema = z.object({
  title: TitleZod,
  content: ContentZod.optional(),
});

export type AnnouncementByFilterQueryParams = z.infer<typeof AnnouncementFilterQuerySchema>;
export type AnnouncementByFilterParams = z.infer<typeof AnnouncementFilterSchema>;
export type AnnouncementCreatePersistenceParams = z.infer<
  typeof AnnouncementCreatePersistenceSchema
>;
export type AnnouncementCreateDomainParams = z.infer<typeof AnnouncementCreateDomainSchema>;
export type TeacherId = z.infer<typeof TeacherIdZod>;
export type AnnouncementUpdateParams = z.infer<typeof AnnouncementUpdateSchema>;

export type AnnouncementDetail = Prisma.AnnouncementGetPayload<{
  select: typeof announcementSelectDetail;
}>;
export type AnnouncementShort = Prisma.AnnouncementGetPayload<{
  select: typeof announcementSelectShort;
}>;
