import { classSelectShort } from './class.select';
import { groupSelectShort } from './group.select';
import { learningPathSelectShort } from './learningPath.select';

export const assignmentSelectDetail = {
  id: true,
  teacherId: true,
  class: {
    select: classSelectShort,
  },
  groups: {
    select: groupSelectShort,
  },
  learningPath: {
    select: learningPathSelectShort,
  },
};

export const assignmentSelectShort = {
  id: true,
  learningPathId: true,
};
