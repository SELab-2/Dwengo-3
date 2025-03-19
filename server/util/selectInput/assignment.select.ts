import { Prisma } from "@prisma/client";
import { classSelectShort } from "./class.select";
import { groupSelectShort } from "./group.select";
import { learningPathShort } from "./learningPath.select";

export const assignmentSelectDetail: Prisma.AssignmentSelect = {
    id: true,
    teacherId: true,
    class: {
        select: classSelectShort
    },
    groups: {
        select: groupSelectShort
    },
    learningPath: {
        select: learningPathShort
    }
};

export const assignmentSelectShort = {
    id: true,
    learningPathId: true
};