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

// TODO this is a temporary solution, needs filtering of groups by studentId
export const assignmentSelectShort2 = {
  id: true,
  groups: {
    select: {
      id: true,
      progress: true,
      name: true,
      students: {
        select: {
          id: true,
        },
      },
    },
  },
  learningPath: {
    select: {
      id: true,
      title: true,
      learningPathNodes: {
        select: {
          learningObject: {
            select: {
              estimatedTime: true,
            },
          },
        },
      },
    },
  },
};
