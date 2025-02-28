import { z } from "zod";

export const LearningPathNodeTransitionCreateSchema = z.object({
  // id is returned on creation
  fromNodeId: z.string(),
  nextNodeId: z.string(),
  condition: z.string().optional(),
  // nextNode is connected later, after creation of the next node
  // fromNode is connected via froNodeId
});

export const LearningPathNodeCreateSchema = z.object({
  // learningPathId is only known after creating it
  loId: z.string(), // maybe optional bcs is not given if its a new learningObject
  instruction: z.string().optional(),
  startNode: z.boolean(),
  // learningObject is something we need to think about in the future
  // todo differentiate between using exisint learningObjects (via id) and creating new ones 
  learningPathOutgoingTransitions: z.array(LearningPathNodeTransitionCreateSchema),
  // incoming transitions are connected later 
  // groups are connected later
  // assignments submissions are connected later
});

export const LearningPathCreateSchema = z.object({
  hruid: z.string(),
  language: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  learningPathNodes: z.array(LearningPathNodeCreateSchema),
  // assignments are later connected to the learningPath
});

export type LearningPathCreateParams = z.infer<typeof LearningPathCreateSchema>;

export type LearningPathNodeCreateParams = z.infer<typeof LearningPathNodeCreateSchema>;

export type LearningPathNodeTransitionCreateParams = z.infer<typeof LearningPathNodeTransitionCreateSchema>;












export const LearningPathFilterSchema = z.object({
  keywords: z.array(z.string()).optional(),
  age: z.array(z.number()).optional(),
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
    const page = data.page || 1;
    const pageSize = data.pageSize || 10;
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
