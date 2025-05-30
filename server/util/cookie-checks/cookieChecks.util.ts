import { ClassRole } from '@prisma/client';

import { UserEntity } from '../types/user.types';
import { ClassPersistence } from '../../persistence/class.persistence';
import { GroupPersistence } from '../../persistence/group.persistence';
import { BadRequestError, NotFoundError } from '../types/error.types';
import { AssignmentPersistence } from '../../persistence/assignment.persistence';
import { Uuid } from '../types/theme.types';
import { ClassRoleEnum } from '../types/enums.types';

export const compareUserIdWithFilterId = async (
  user: UserEntity,
  studentId: Uuid | undefined,
  teacherId: Uuid | undefined,
): Promise<void> => {
  if (
    (studentId && user.role === ClassRoleEnum.STUDENT && user.student?.id !== studentId) ||
    (teacherId && user.role === ClassRoleEnum.TEACHER && user.teacher?.id !== teacherId)
  ) {
    throw new BadRequestError(40004);
  }
};

export const checkIfUserIsInClass = async (
  user: UserEntity,
  classId: Uuid | undefined,
  classPersistence: ClassPersistence,
): Promise<void> => {
  // Class Id is given => fetch class and check if user is a teacher or student
  if (!classId) return;
  const classData = await classPersistence.getClassById(classId);

  if (!classData) {
    throw new NotFoundError(40401);
  }

  if (user.role === ClassRoleEnum.TEACHER) {
    const isTeacherOfThisClass = classData.teachers.some(
      (teacher) => user.teacher && teacher.id === user.teacher.id,
    );

    if (!isTeacherOfThisClass) {
      throw new BadRequestError(40001);
    }
  }

  if (user.role === ClassRoleEnum.STUDENT) {
    const isStudentOfThisClass = classData.students.some(
      (student) => user.student && student.id === user.student.id,
    );

    if (!isStudentOfThisClass) {
      throw new BadRequestError(40002);
    }
  }
};

export const checkIfUserIsInGroup = async (
  user: UserEntity,
  groupId: Uuid | undefined,
  groupPersistence: GroupPersistence,
): Promise<void> => {
  if (!groupId) return;
  const groupData = await groupPersistence.getGroupByIdWithCustomIncludes(groupId);
  if (!groupData) throw new NotFoundError(40413);

  if (user.role === ClassRole.TEACHER) {
    const isTeacherOfThisGroup = groupData.assignment.class.teachers.some(
      (teacher) => user.teacher && teacher.id === user.teacher.id,
    );
    if (!isTeacherOfThisGroup) {
      throw new BadRequestError(40001);
    }
  }
  if (user.role === ClassRole.STUDENT) {
    const isStudentOfThisGroup = groupData.students.some(
      (student) => user.student && student.id === user.student.id,
    );
    if (!isStudentOfThisGroup) {
      throw new BadRequestError(40002);
    }
  }
};

export const checkIfUsersAreInSameClass = async (
  groups: Uuid[][],
  classId: Uuid,
  teacherId: Uuid,
  classPersistance: ClassPersistence,
): Promise<void> => {
  const classData = await classPersistance.getClassById(classId);
  if (!classData) {
    throw new NotFoundError(40401);
  }
  // Extract student IDs from the class
  const classStudentIds = new Set(classData.students.map((student) => student.id));

  // Ensure all students in each group belong to the class
  const check = groups.every((group) =>
    group.every((groupMember) => classStudentIds.has(groupMember)),
  );

  if (!check) {
    throw new BadRequestError(40040);
  }

  if (!classData.teachers.find((teacher) => teacher.id === teacherId)) {
    throw new BadRequestError(40001);
  }
};

export const checkIfUsersAreInSameGroup = async (
  users: Uuid[],
  groupId: Uuid,
  groupPersistence: GroupPersistence,
): Promise<void> => {
  const groupData = await groupPersistence.getGroupByIdWithCustomIncludes(groupId);
  if (!groupData) {
    throw new NotFoundError(40413);
  }
  const groupStudendtIds = new Set(groupData.students.map((student) => student.userId));
  const teacherIds = new Set(groupData.assignment.class.teachers.map((teacher) => teacher.userId)); //Teachers can see all groups of the class
  const check = users.every((user) => groupStudendtIds.has(user) || teacherIds.has(user));
  if (!check) {
    throw new BadRequestError(40041);
  }
};

/**
 * Checks if the user is in the assignment and throws an appropriate error if not.
 *
 * @param user - The user to check
 * @param assignmentId - The assignment ID to check
 * @param assignmentPersistence - The assignment persistence object
 * @param classPersistence - The class persistence object
 */
export const checkIfUserInAssignment = async (
  user: UserEntity,
  assignmentId: Uuid,
  assignmentPersistence: AssignmentPersistence,
  classPersistence: ClassPersistence,
): Promise<void> => {
  const assignment = await assignmentPersistence.getAssignmentId(assignmentId);

  // A teacher can only get assignments of a class he's in
  if (user.role == ClassRoleEnum.TEACHER) {
    const classgroup = await classPersistence.getClassById(assignment.class.id);
    const teacherInClass = classgroup.teachers.some((teacher) => teacher.id === user.teacher?.id);

    if (!teacherInClass) {
      throw new BadRequestError(40050);
    }
  }

  // A student can only get assignments if he's a member of the assignment
  if (user.role == ClassRoleEnum.STUDENT) {
    const studentInAssignment = assignment.groups.some((group) =>
      group.students.some((student) => student.userId === user.id),
    );

    if (!studentInAssignment) {
      throw new BadRequestError(40050);
    }
  }
};
