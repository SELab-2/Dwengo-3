import { SubmissionType } from "@prisma/client";
import { z } from "zod";

export const AssignmentFilterSchema = z.object({
    classId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional()
});

export const AssignmentSchema = z.object({
    groups: z.string().uuid().array().nonempty().array().nonempty(),
    classId: z.string().uuid(),
    teacherId: z.string().uuid(),
    learningPathId: z.string().uuid()
});

export const IdSchema = z.string().uuid();

const FileSubmissionSchema = z.object({
    fileName: z.string(),
    filePath: z.string()
});

const MultipleChoiceSubSchema = z.string()

export const SubmissionSchema = z.object({
    groupId: z.string().uuid(),
    nodeId: z.string().uuid()
});

export const SubmissionUpdateSchema = z.object({
    groupId: z.string().uuid(),
    nodeId: z.string().uuid(),
    submissionType: z.nativeEnum(SubmissionType),
    submission: z.union([FileSubmissionSchema.optional(), MultipleChoiceSubSchema.optional()])
}).refine((data: any) => {
    return data.submissionType === SubmissionType.MULTIPLE_CHOICE && !data.submission, 
    {message: "Multiple choice submission is required when submissionType is MULTIPLE_CHOICE"};
});



export type AssignmentCreateParams = z.infer<typeof AssignmentSchema>;
export type Uuid = z.infer<typeof IdSchema>;
export type AssignmentFilterParams = z.infer<typeof AssignmentFilterSchema>;
export type AssignmentSubParams = z.infer<typeof SubmissionSchema>;
export type AssignmentSubUpdataParams = z.infer<typeof SubmissionUpdateSchema>;
export type FileSubmission = z.infer<typeof FileSubmissionSchema>;