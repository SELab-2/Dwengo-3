import { assignmentSelectShort } from './assignment.select';
import { discussionSelectShort } from './discussion.select';
import { studentSelectShort } from './student.select';

export const groupSelectShort = {
  id: true,
  nodeId: true, //TODO change to nodeIndex
  assignmentId: true,
};

export const groupSelectDetail = {
  id: true,
  nodeId: true, //TODO change to nodeIndex
  assignment: {
    select: assignmentSelectShort,
  },
  discussion: {
    select: discussionSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
};
