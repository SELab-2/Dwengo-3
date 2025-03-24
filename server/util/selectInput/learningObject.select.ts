import { Prisma } from '@prisma/client';

export const learningObjectSelectShort: Prisma.LearningObjectSelect = {
  id: true,
  title: true,
  language: true,
  estimatedTime: true,
  // TODO: geef gewoon een array van keywords mee ipv object met keyword property
  keywords: {
    select: {
      keyword: true,
    },
  },
  targetAges: true,
};

export const learningObjectSelectDetail: Prisma.LearningObjectSelect = {
  id: true,
  hruid: true,
  version: true,
  language: true,
  title: true,
  description: true,
  contentType: true,
  contentLocation: true,
  targetAges: true,
  teacherExclusive: true,
  skosConcepts: true,
  educationalGoals: true,
  copyright: true,
  licence: true,
  difficulty: true,
  estimatedTime: true,
  returnValue: true,
  available: true,
  createdAt: true,
  updatedAt: true,
  content: true,
  multipleChoice: true,
  // TODO: geef gewoon een array van keywords mee ipv object met keyword property
  keywords: {
    select: {
      keyword: true
    },
  },
};
