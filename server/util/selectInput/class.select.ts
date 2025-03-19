import { Prisma } from "@prisma/client";

export const classSelectShort: Prisma.ClassSelect = {
    id: true,
    name: true
};