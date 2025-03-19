import { Prisma } from "@prisma/client";

export const learningPathShort: Prisma.LearningPathSelect = {
    id: true,
    title: true,
    image: true,
    description: true
};