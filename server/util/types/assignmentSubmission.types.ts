import { Prisma, SubmissionType } from '@prisma/client';
import { z } from 'zod';
import {
  assignmentSubmissionSelectDetail,
  assignmentSubmissionSelectShort,
} from '../selectInput/select';

const FileSubmissionSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
});

const MultipleChoiceSubSchema = z.object({
  answer: z.number(),
});

export const SubmissionFilterSchema = z
  .object({
    groupId: z.string().uuid().optional(),
    nodeId: z.string().uuid().optional(),
    favoriteId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one filter must be provided.',
    path: [],
  });

export const SubmissionCreateSchema = z
  .object({
    groupId: z.string().uuid().optional(),
    favoriteId: z.string().uuid().optional(),
    nodeId: z.string().uuid(),
    submissionType: z.nativeEnum(SubmissionType),
    submission: z.union([FileSubmissionSchema.optional(), MultipleChoiceSubSchema.optional()]),
  })
  .refine(
    (data) => {
      if (data.submissionType === SubmissionType.MULTIPLE_CHOICE) {
        return data.submission !== null && data.submission !== undefined;
      }
      return true; // Accept any value for FILE or other types
    },
    {
      message:
        'submission must match the submissionType: a string for MULTIPLE_CHOICE or an object for FILE',
      path: ['submission'],
    },
  )
  .refine((data) => data.favoriteId !== undefined || data.groupId !== undefined, {
    message: 'Either groupId or favoriteId must be provided',
    path: ['submission'],
  });

export const SubmissionUpdateSchema = z
  .object({
    submissionType: z.nativeEnum(SubmissionType),
    submission: z.union([FileSubmissionSchema.optional(), MultipleChoiceSubSchema.optional()]),
  })
  .refine(
    (data) => {
      if (data.submissionType === SubmissionType.MULTIPLE_CHOICE) {
        return data.submission !== null && data.submission !== undefined;
      }
      return true; // Accept any value for FILE or other types
    },
    {
      message:
        'submission must match the submissionType: a string for MULTIPLE_CHOICE or an object for FILE',
      path: ['submission'],
    },
  );

export type AssignmentSubFilterParams = z.infer<typeof SubmissionFilterSchema>;
export type AssignmentSubCreateParams = z.infer<typeof SubmissionCreateSchema>;
export type AssignmentSubUpdateParams = z.infer<typeof SubmissionUpdateSchema>;
export type FileSubmission = z.infer<typeof FileSubmissionSchema>;
export type AssignmentSubmissionDetail = Prisma.AssignmentSubmissionGetPayload<{
  select: typeof assignmentSubmissionSelectDetail;
}>;
export type AssignmentSubmissionShort = Prisma.AssignmentSubmissionGetPayload<{
  select: typeof assignmentSubmissionSelectShort;
}>;
