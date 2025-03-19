import { Prisma } from "@prisma/client";
import { learningObjectSelectShort } from "./learningObject.select";

export const learningPathNodeSelectShort: Prisma.LearningPathNodeSelect = {
    id: true,
    learningObject: {
        select: learningObjectSelectShort
    }
}