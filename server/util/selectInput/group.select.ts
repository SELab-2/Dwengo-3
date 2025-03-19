import { Prisma } from "@prisma/client";

export const groupSelectShort: Prisma.GroupSelect = {
    id: true,
    nodeId: true, //TODO change to nodeIndex
    assignmentId: true
};