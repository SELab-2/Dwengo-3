import { z } from "zod";
import { Uuid } from "./assignment.types";
import { GroupShort } from "./group.types";
import { UserShort } from "./user.types";

export const DiscussionFilterSchema = z
  .object({
    groupIds: z.string().uuid().array().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one filter must be provided.",
    path: [],
  });

export const DiscussionCreateSchema = z.object({
  groupId: z.string().uuid(),
  members: z.string().uuid().array().nonempty(),
});

export type DiscussionFilterParams = z.infer<typeof DiscussionFilterSchema>;
export type DiscussionCreateParams = z.infer<typeof DiscussionCreateSchema>;
export type DiscussionDetail = {
  id: Uuid,
  group: GroupShort,
  members: UserShort[]
};
export type discussionShort = {
  id: Uuid
};