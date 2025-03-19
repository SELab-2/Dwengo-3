import { Prisma } from "@prisma/client";
import { userSelectShort } from "./user.select";

export const messageSelectDetail: Prisma.MessageSelect = {
    id: true,
    content: true,
    sender: {
        select: userSelectShort
    },
    createdAt: true
}