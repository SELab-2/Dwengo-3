import { learningPathNodeSelectShort } from './learningPathNode.select';

export const learningPathSelectShort = {
  id: true,
  title: true,
  learningPathNodes: {
    select: learningPathNodeSelectShort
  },
  image: true,
  description: true,
};

export const learningPathSelectDetail = {
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
