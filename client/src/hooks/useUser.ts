import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchStudentById, fetchStudents } from '../api/student';
import { fetchTeachers } from '../api/teacher';

/**
 * Fetches the list of students for the given parameters.
 *
 * @param userId - The ID of the user whose student data needs to be fetched.
 * @param classId - The ID of the class to filter the students.
 * @param groupId - The ID of the group to filter the students.
 * @returns
 */
export function useStudent(userId?: string, classId?: string, groupId?: string) {
  return useQuery({
    queryKey: ['student', userId],
    queryFn: async () => {
      return await fetchStudents(userId, classId, groupId);
    },
    enabled: !!userId || !!classId || !!groupId,
    refetchOnWindowFocus: false,
  });
}

export function useStudentById(studentId: string) {
  return useQuery({
    queryKey: ['studentById', studentId],
    queryFn: async () => {
      return await fetchStudentById(studentId);
    },
    enabled: !!studentId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches the list of teachers for the given parameters.
 *
 * @param userId - The ID of the user whose teacher data needs to be fetched.
 * @param classId - The ID of the class to filter the teacher.
 * @param groupId - The ID of the group to filter the teacher.
 * @returns The query object containing the teacher data.
 */
export function useTeacher(userId?: string, classId?: string, groupId?: string) {
  return useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      return await fetchTeachers(userId, classId, groupId);
    },
    enabled: !!userId || !!classId || !!groupId,
    refetchOnWindowFocus: false,
  });
}
