import { SubmissionType } from "@prisma/client";
import { z } from "zod";


export const LearningPathNodeTransitionCreateSchema = z.object({
  fromNodeId: z.string(),
  toNodeId: z.string(),
  condition: z.string().optional(),
});

export const LearningPathNodeCreateSchema = z.object({
  lpId: z.string(),
  loId: z.string(),
  instruction: z.string().optional(),
  startNode: z.boolean(),
});

export const LearningPathCreateSchema = z.object({
  hruid: z.string(),
  language: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;

export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;

// ODO maybe change to shorter name
export type LearningPathNodeTransitionCreateParams = z.infer<typeof LearningPathNodeTransitionCreateSchema>;



export const LearningPathFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  age: z.array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
  id: z.string().optional(),
});

export type LearningPathByFilterParams = z.infer<typeof LearningPathFilterSchema>;

export const LearningPathByIdSchema = z.object({
  id: z.string().uuid("Id must be a valid UUID"),
});

export type LearningPathByIdParams = z.infer<typeof LearningPathByIdSchema>;


export const PaginationFilterSchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive integer")
      .transform(Number)
      .refine((val) => val > 0, "Page must be greater than 0")
      .default("1"),

    pageSize: z
      .string()
      .regex(/^\d+$/, "PageSize must be a positive integer")
      .transform(Number)
      .refine((val) => val > 0, "PageSize must be greater than 0")
      .default("10"),
  })
  .transform((data) => {
    // Transform to include skip
    const page = data.page;
    const pageSize = data.pageSize;
    const skip = (page - 1) * pageSize;
    return {
      page,
      pageSize,
      skip,
    };
  });

export type PaginationParams = z.infer<typeof PaginationFilterSchema>;

export const ClassFilterSchema = z.object({
  name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
  teacherIds: z
    .array(
      z.string()
      // TODO: Uncomment this line when we have teacher entries in the databse with uuids
      //.uuid("Each teacherId must be a valid UUID")
    )
    .optional(),
  studentIds: z
    .array(
      z.string()
      // TODO: Uncomment this line when we have student entries in the databse with uuids
      //.uuid("Each studentId must be a valid UUID")
    )
    .optional(),
});

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;

export const ClassCreateSchema = z.object({
  name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});

export type ClassCreateParams = z.infer<typeof ClassCreateSchema>;

export const ClassUpdateSchema = z.object({
  name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});

export type ClassUpdateParams = z.infer<typeof ClassUpdateSchema>;

export const AssignmentFilterSchema = z.object({
    classId: z.string().uuid().optional(),
    groupId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    studentId: z.string().uuid().optional(),
    id: z.string().uuid().optional()
});

export const AssignmentCreateSchema = z.object({
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

export const SubmissionFilterSchema = z.object({
    groupId: z.string().uuid().optional(),
    nodeId: z.string().uuid().optional(),
    id: z.string().uuid().optional()
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



export type AssignmentCreateParams = z.infer<typeof AssignmentCreateSchema>;
export type Uuid = z.infer<typeof IdSchema>;
export type AssignmentFilterParams = z.infer<typeof AssignmentFilterSchema>;
export type AssignmentSubFilterParams = z.infer<typeof SubmissionFilterSchema>;
export type AssignmentSubUpdataParams = z.infer<typeof SubmissionUpdateSchema>;
export type FileSubmission = z.infer<typeof FileSubmissionSchema>;