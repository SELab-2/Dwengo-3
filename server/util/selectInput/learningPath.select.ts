import { Prisma } from '@prisma/client';
import { learningPathNodeSelectShort } from './learningPathNode.select';

export const learningPathSelectShort: Prisma.LearningPathSelect = {
  id: true,
  title: true,
  //TODO: add keywords & targetages
  image: true,
  description: true,
};

export const learningPathSelectDetail: Prisma.LearningPathSelect = {
  id: true,
  hruid: true,
  language: true,
  title: true,
  description: true,
  image: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  learningPathNodes: {
    select: learningPathNodeSelectShort,
  },
};
