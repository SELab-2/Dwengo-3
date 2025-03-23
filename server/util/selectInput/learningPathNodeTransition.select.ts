import { Prisma } from '@prisma/client';

export const learningPathNodeTransitionSelectDetail: Prisma.LearningNodeTransitionSelect =
  {
    id: true,
    learningPathNodeId: true,
    condition: true,
    toNodeIndex: true,
  };
