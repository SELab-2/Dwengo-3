import { assignmentSelectShort } from './assignment.select';
import { discussionSelectShort } from './discussion.select';
import { studentSelectShort } from './student.select';

export const groupSelectShort = {
  id: true,
  progress: true,
  assignmentId: true,
  name: true,
};

export const groupSelectDetail = {
  id: true,
  name: true,
  progress: true,
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
