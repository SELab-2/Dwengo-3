import { AssignmentShort2, PopulatedAssignment } from '../interfaces/assignment.interfaces';
import { GroupDetail, GroupShort } from '../interfaces/group.interfaces';

/**
 * Calculates the progress of a student in an assignment.
 *
 * @param assignment - The assignment object containing details about the assignment.
 * @param studentId - The ID of the student whose progress is to be calculated.
 * @param group - The group object containing details about the group.
 * @returns The progress percentage of the student or group in the assignment.
 */
export function getProgress({
  assignment,
  studentId,
  group,
}: {
  assignment: AssignmentShort2 | PopulatedAssignment;
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

/**
 * Filters assignments based on their progress.
 *
 * @remarks This function has to be used in a filter function.
 *
 * @param assignment - The assignment object containing details about the assignment.
 * @param studentId - The ID of the student whose progress is to be calculated.
 * @param group - The group object containing details about the group.
 * @param filterType - The type of filter to apply (finished, not started, not finished).
 * @returns A boolean indicating whether the assignment matches the filter criteria.
 */
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
