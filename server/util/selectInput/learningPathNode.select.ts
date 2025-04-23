import { learningObjectSelectShort } from './learningObject.select';
import { learningPathNodeTransitionSelectDetail } from './learningPathNodeTransition.select';

export const learningPathNodeSelectShort = {
  id: true,
  learningObject: {
    select: learningObjectSelectShort,
  },
};

export const learningPathNodeSelectDetail = {
  id: true,
  learningPathId: true,
  learningObject: {
    select: learningObjectSelectShort,
  },
  instruction: true,
  index: true,
  transitions: {
    select: learningPathNodeTransitionSelectDetail,
  },
};
