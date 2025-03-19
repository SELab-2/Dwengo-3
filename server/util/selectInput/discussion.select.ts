import { Prisma } from "@prisma/client";
import { groupSelectShort } from "./group.select";
import { userSelectShort } from "./user.select";

export const discussionSelectShort: Prisma.DiscussionSelect = {
    id: true
}

export const discussionSelectDetail: Prisma.DiscussionSelect = {
    id: true,
    group: {
        select: groupSelectShort
    },
    members: {
        select: userSelectShort
    }
}