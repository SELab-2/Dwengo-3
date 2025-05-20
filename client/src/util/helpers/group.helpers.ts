import { AssignmentShort2 } from '../interfaces/assignment.interfaces';
import { GroupShort } from '../interfaces/group.interfaces';

export const myGroup = (assignment: AssignmentShort2, userId: string): GroupShort | undefined => {
  return assignment.groups.find((group) =>
    group.students.some((student) => student.userId === userId),
  );
};
