import { Prisma } from "@prisma/client";

export const userSelectShort: Prisma.UserSelect = {
    id: true,
    surname: true,
    name: true,
    role: true
};