import { Prisma } from "@prisma/client";

export const learningObjectSelectShort: Prisma.LearningObjectSelect = {
    id: true,
    title: true,
    language: true,
    estimatedTime: true,
    keywords: {
        select: {
            keyword: true
        }
    },
    targetAges: true
};