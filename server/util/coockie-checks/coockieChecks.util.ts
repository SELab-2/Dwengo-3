import { Class, ClassRole } from '@prisma/client';
import { ClassPersistence } from '../../persistence/class.persistence';
import { Uuid } from '../types/assignment.types';
import { ClassRoleEnum, UserEntity } from '../types/user.types';
import { GroupPersistence } from '../../persistence/group.persistence';

export const compareUserIdWithFilterId = async (
  user: UserEntity,
  studentId: Uuid | undefined,
  teacherId: Uuid | undefined,
): Promise<void> => {
  if (
    (studentId &&
      user.role === ClassRoleEnum.STUDENT &&
      user.student?.id !== studentId) ||
    (teacherId &&
      user.role === ClassRoleEnum.TEACHER &&
      user.teacher?.id !== teacherId)
  ) {
    throw new Error(
      "User ID doesn't correspond with the provided studentId or teacherId.",
    );
  }
};

export const checkIfUserIsInClass = async (
  user: UserEntity,
  classId: Uuid | undefined,
  classPersistance: ClassPersistence,
): Promise<void> => {
  // Class Id is given => fetch class and check if user is a teacher or student
  if (!classId) return;
  const classData = await classPersistance.getClassById(classId);

  if (!classData) {
    throw new Error('Class not found.');
  }

  if (user.role === ClassRoleEnum.TEACHER) {
    const isTeacherOfThisClass = classData.teachers.some(
      (teacher) => teacher.userId === user.id,
    );

    if (!isTeacherOfThisClass) {
      throw new Error("Can't fetch classes you're not a teacher of.");
    }
  }

  if (user.role === ClassRoleEnum.STUDENT) {
    const isStudentOfThisClass = classData.students.some(
      (student) => student.userId === user.id,
    );

    if (!isStudentOfThisClass) {
      throw new Error("Can't fetch classes you're not a student of.");
    }
  }
};

export const checkIfUserIsInGroup = async (
  user: UserEntity,
  groupId: Uuid | undefined,
  groupPersistence: GroupPersistence,
): Promise<void> => {
  if (!groupId) return;
  const groupData =
    await groupPersistence.getGroupByIdWithCustomIncludes(groupId);
  if (!groupData) throw new Error('Group not found.');

  if (user.role === ClassRole.TEACHER) {
    const isTeacherOfThisGroup = groupData.assignment.class.teachers.some(
      (teacher) => teacher.id === user.id,
    );
    if (!isTeacherOfThisGroup) {
      throw new Error("Can't fetch groups you're not a teacher of.");
    }
  }
  if (user.role === ClassRole.STUDENT) {
    const isStudentOfThisGroup = groupData.students.some(
      (student) => student.id === user.id,
    );
    if (!isStudentOfThisGroup) {
      throw new Error("Can't fetch groups you're not a student of.");
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
    throw new Error('Class not found.');
  }
  // Extract student IDs from the class
  const classStudentIds = new Set(
    classData.students.map((student) => student.id),
  );

  // Ensure all students in each group belong to the class
  const check = groups.every((group) =>
    group.every((groupMember) => classStudentIds.has(groupMember)),
  );

  if (!check) {
    throw new Error('All students in a group must belong to the same class.');
  }

  if (classData.teachers.some((teacher) => teacher.id !== teacherId)) {
    throw new Error("Can't fetch classes you're not a teacher of.");
  }
};

export const checkIfUsersAreInSameGroup = async (
  users: Uuid[],
  groupId: Uuid,
  groupPersistence: GroupPersistence,
): Promise<void> => {
  const groupData =
    await groupPersistence.getGroupByIdWithCustomIncludes(groupId);
  if (!groupData) {
    throw new Error('Group not found');
  }
  const groupStudendtIds = new Set(
    groupData.students.map((student) => student.userId),
  );
  const teacherIds = new Set(
    groupData.assignment.class.teachers.map((teacher) => teacher.userId),
  ); //Teachers can see all groups of the class
  const check = users.every(
    (user) => groupStudendtIds.has(user) || teacherIds.has(user),
  );
  if (!check) {
    throw new Error('All users must belong to the same group');
  }
};
