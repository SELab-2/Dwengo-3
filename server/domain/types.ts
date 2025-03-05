import { z } from "zod";


/* ANNOUNCEMENT */
export const AnnouncementFilterSchema = z.object({
  classId: z.string().optional(),
  teacherId: z.string().optional(),
  studentId: z.string().optional(),
  announcementId: z.string().optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: "At least one filter must be provided.",
  path: [],
});


export const AnnouncementCreateParamsSchema = z.object({
  title: z.string().min(1, "Title must be a non-empty string").trim(),
  content: z.string().min(1, "Content must be a non-empty string").trim(),
  classId: z.string(),
  teacherId: z.string(),
});

export const AnnouncementUpdateParamsSchema = z.object({
  id: z.string().uuid("Id must be a valid UUID"),
  title: z.string().min(1, "Title must be a non-empty string").trim().optional(),
  content: z.string().min(1, "Content must be a non-empty string").trim().optional(),
});



/* ############################## */
/* ####### LEARNING PATH ######## */
/* ############################## */

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

export const LearningPathFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  age: z.array(z.string())
    .transform((val) => val.map(Number))
    .optional(),
  id: z.string().optional(),
});

export const LearningPathByIdSchema = z.object({
  id: z.string().uuid("Id must be a valid UUID"),
});














export const PaginationFilterSchema = z.object({
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
}).transform((data) => {
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

export const ClassUpdateSchema = z.object({
  name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});

export const ClassCreateSchema = z.object({
  name: z.string().min(1, "Name must be a non-empty string").trim().optional(),
});


export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;
export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;
export type LearningPathNodeTransitionCreateParams = z.infer<typeof LearningPathNodeTransitionCreateSchema>;
export type LearningPathByFilterParams = z.infer<typeof LearningPathFilterSchema>;
export type LearningPathByIdParams = z.infer<typeof LearningPathByIdSchema>;

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;
export type ClassCreateParams = z.infer<typeof ClassCreateSchema>;
export type ClassUpdateParams = z.infer<typeof ClassUpdateSchema>;

export type AnnouncementByFilterParams = z.infer<typeof AnnouncementFilterSchema>;
export type AnnouncementCreateParams = z.infer<typeof AnnouncementCreateParamsSchema>;

export type PaginationParams = z.infer<typeof PaginationFilterSchema>;