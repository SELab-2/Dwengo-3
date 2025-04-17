import { Prisma } from '@prisma/client';
import { groupSelectShort } from './group.select';
import { learningPathNodeSelectShort } from './learningPathNode.select';
import { FavoriteSelectShort } from './favorites.select';

export const assignmentSubmissionSelectDetail = {
  id: true,
  submissionType: true
  submission: true,
  group: {
    select: groupSelectShort,
  },
  node: {
    select: learningPathNodeSelectShort,
  },
  favorite: {
    select: FavoriteSelectShort,
  },
};
  
export const assignmentSubmissionSelectShort = {
    id: true
};
