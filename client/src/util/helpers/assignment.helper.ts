import { AssignmentShort2 } from '../interfaces/assignment.interfaces';
import { GroupDetail, GroupShort } from '../interfaces/group.interfaces';

export function getProgress({
  assignment,
  studentId,
  group,
}: {
  assignment: AssignmentShort2;
  studentId?: string;
  group?: GroupShort | GroupDetail;
}) {
  if (!group) {
    group = assignment.groups.find((group) => {
      return group.students.some((student) => student.id == studentId);
    });
    if (!group) return 0;
  }

  if (group.progress.length === 0) return 0;

  const progress = Math.max(...group.progress) + 1;
  const total = assignment.learningPath.learningPathNodes.length;

  return Math.round((progress / total) * 100);
}

export const enum AssignmentFilterType {
  FINISHED = 'finished',
  NOT_STARTED = 'notStarted',
  NOT_FINISHED = 'notFinished',
}

export function filterAssignmentOnProgress({
  assignment,
  studentId,
  group,
  filterType,
}: {
  assignment: AssignmentShort2;
  studentId?: string;
  group?: GroupShort | GroupDetail;
  filterType: AssignmentFilterType;
}) {
  const progress = getProgress({ assignment, studentId, group });

  if (filterType === AssignmentFilterType.FINISHED) {
    return progress === 100;
  } else if (filterType === AssignmentFilterType.NOT_STARTED) {
    return progress === 0;
  } else {
    return progress !== 100;
  }
}
