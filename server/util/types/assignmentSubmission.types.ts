import { Prisma, SubmissionType } from '@prisma/client';
import { z } from 'zod';
import {
  assignmentSubmissionSelectDetail,
  assignmentSubmissionSelectShort,
} from '../selectInput/select';
import {
  AnswerZod,
  atLeastOneFieldProvided,
  FavoriteIdZod,
  FileNameZod,
  FilePathZod,
  GroupIdZod,
  NodeIdZod,
  SubmissionTypeZod,
} from './util_types';

const FileSubmissionSchema = z.object({
  fileName: FileNameZod,
  filePath: FilePathZod,
});

const MultipleChoiceSubSchema = z.object({
  answer: AnswerZod,
});

export const SubmissionFilterSchema = z
  .object({
    groupId: GroupIdZod.optional(),
    nodeId: NodeIdZod.optional(),
    favoriteId: FavoriteIdZod.optional(),
  })
  .refine(atLeastOneFieldProvided.validate, {
    message: atLeastOneFieldProvided.message,
  });

export const SubmissionCreateSchema = z
  .object({
    groupId: GroupIdZod.optional(),
    favoriteId: FavoriteIdZod.optional(),
    nodeId: NodeIdZod,
    submissionType: SubmissionTypeZod,
    submission: z.union([FileSubmissionSchema.optional(), MultipleChoiceSubSchema.optional()], {
      invalid_type_error: 'Invalid submission',
    }),
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
    submissionType: SubmissionTypeZod,
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
