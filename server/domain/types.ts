import { z } from "zod";

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
