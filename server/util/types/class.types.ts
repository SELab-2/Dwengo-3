import { z } from 'zod';
import { Uuid } from './assignment.types';

export const ClassFilterSchema = z
  .object({
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
  })
  .refine((data) => data.teacherId || data.studentId, {
    message: 'Either studentId or teacherId must be provided.',
    path: [], // Path is empty to associate error with the entire object
  });

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;

export const ClassCreateSchema = z.object({
  name: z.string().min(1, 'Name must be a non-empty string').trim().optional(),
});

export type ClassCreateParams = z.infer<typeof ClassCreateSchema>;

export const ClassUpdateSchema = z.object({
  name: z.string().min(1, 'Name must be a non-empty string').trim().optional(),
});

export type ClassUpdateParams = z.infer<typeof ClassUpdateSchema>;
export type ClassShort = {
  id: Uuid;
  name: string;
};
