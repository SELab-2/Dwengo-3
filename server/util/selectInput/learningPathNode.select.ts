import { Prisma } from '@prisma/client';
import { learningObjectSelectShort } from './learningObject.select';
import { learningPathNodeTransitionSelectDetail } from './learningPathNodeTransition.select';

export const learningPathNodeSelectShort: Prisma.LearningPathNodeSelect = {
  id: true,
  learningObject: {
    select: learningObjectSelectShort,
  },
};

export const learningPathNodeSelectDetail: Prisma.LearningPathNodeSelect = {
  id: true,
  learningPathId: true,
  learningObject: {
    select: learningObjectSelectShort
  },
  instruction: true,
  index: true,
  transitions: {
    select: learningPathNodeTransitionSelectDetail,
  },
};
