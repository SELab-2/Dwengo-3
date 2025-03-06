import { SubmissionType } from "@prisma/client";
import { z } from "zod";

const FileSubmissionSchema = z.object({
    fileName: z.string(),
    filePath: z.string()
});

const MultipleChoiceSubSchema = z.string()

export const SubmissionFilterSchema = z.object({
    groupId: z.string().uuid().optional(),
    nodeId: z.string().uuid().optional(),
    id: z.string().uuid().optional()
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one filter must be provided.",
    path: [],
});

export const SubmissionUpdateSchema = z.object({
    groupId: z.string().uuid(),
    nodeId: z.string().uuid(),
    submissionType: z.nativeEnum(SubmissionType),
    submission: z.union([FileSubmissionSchema.optional(), MultipleChoiceSubSchema.optional()])
}).refine((data) => data.submissionType === SubmissionType.MULTIPLE_CHOICE && data.submission === undefined, {
    message: "Multiple choice submission is required when submissionType is MULTIPLE_CHOICE",
    path: [],
});

export type AssignmentSubFilterParams = z.infer<typeof SubmissionFilterSchema>;
export type AssignmentSubUpdataParams = z.infer<typeof SubmissionUpdateSchema>;
export type FileSubmission = z.infer<typeof FileSubmissionSchema>;