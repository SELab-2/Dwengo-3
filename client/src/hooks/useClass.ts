import { useMutation, useQuery } from '@tanstack/react-query';
import { createClass, fetchClassById, fetchClasses, fetchPopulatedClassById } from '../api/class';
import { ClassDetail, PopulatedClass } from '../util/interfaces/class.interfaces';
import { ApiRoutes } from '../api/api.routes';
import apiClient from '../api/apiClient';
import { fetchNestedData } from '../api/util';

/**
 * Fetches a list of classes based on the provided student and teacher IDs.
 *
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @returns The query object containing the class data.
 */
export function useClasses(studentId?: string, teacherId?: string) {
  return useQuery({
    queryKey: ['class', studentId, teacherId],
    queryFn: async () => {
      return await fetchClasses(studentId, teacherId);
    },
    enabled: !!studentId || !!teacherId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a class by its ID.
 *
 * @param classId - The ID of the class to be fetched.
 * @returns The query object containing the class data.
 */
export function useClassById(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      return await fetchClassById(classId);
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches multiple classes by their IDs.
 *
 * @param classIds - The IDs of the classes to be fetched.
 * @returns The query object containing the classes data.
 */
export function useClassesByIds(classIds: string[]) {
  return useQuery({
    queryKey: ['classes', classIds],
    queryFn: async () => {
      const result: ClassDetail[] = await fetchNestedData(classIds, fetchClassById);

      return result;
    },
    enabled: !!classIds.length,
    refetchOnWindowFocus: false,
  });
}

/**
 * Creates a new class with the provided class name.
 *
 * @returns The mutation object for creating the class.
 */
export function useCreateClass() {
  return useMutation({
    mutationFn: async (className: string) => {
      return await createClass({ name: className });
    },
  });
}

/**
 * Fetches populated classes for a student or teacher by their respective IDs.
 *
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @param page - The current page number for pagination.
 * @param pageSize - The number of items per page for pagination.
 * @param options - Options to populate additional data (e.g., teachers, students, assignments).
 * @returns The query object containing the populated class data.
 */
export function usePopulatedClasses(
  studentId?: string,
  teacherId?: string,
  page: number = 1,
  pageSize: number = 10,
  options?: {
    populateTeachers?: boolean;
    populateStudents?: boolean;
    populateAssignments?: boolean;
    populateAssignmentLearningPaths?: boolean;
  },
) {
  const {
    populateTeachers,
    populateStudents,
    populateAssignments,
    populateAssignmentLearningPaths,
  } = options || {};

  return useQuery({
    queryKey: [
      'populatedClasses',
      studentId,
      teacherId,
      page,
      pageSize,
      populateTeachers,
      populateStudents,
      populateAssignments,
      populateAssignmentLearningPaths,
    ],
    queryFn: async () => {
      // Fetch paginated classes
      const paginatedData = await fetchClasses(studentId, teacherId, page, pageSize);

      // Fetch and populate additional data for each class
      const populatedClasses: PopulatedClass[] = await fetchNestedData(
        paginatedData.data.map((classShort) => classShort.id),
        (classId) =>
          fetchPopulatedClassById(
            classId,
            populateTeachers,
            populateStudents,
            populateAssignments,
            populateAssignmentLearningPaths,
          ),
      );

      return {
        ...paginatedData,
        data: populatedClasses, // Replace the data with populated classes
      };
    },
    enabled: !!studentId || !!teacherId, // Enable the query only if studentId or teacherId is provided
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches a populated class by its ID.
 *
 * @param classId - The ID of the class to be fetched.
 * @param populateTeachers - Whether to populate the teachers in the response.
 * @param populateStudents - Whether to populate the students in the response.
 * @param populateAssignments - Whether to populate the assignments in the response.
 * @param populateAssignmentLearningPaths - Whether to populate the learning paths of the assignments in the response.
 * @returns The query object containing the populated class data.
 *
 * @remarks `populateAssignmentLearningPaths` is only used if `populateAssignments` is true.
 */
export function usePopulatedClassById(
  classId: string,
  populateTeachers?: boolean,
  populateStudents?: boolean,
  populateAssignments?: boolean,
  populateAssignmentLearningPaths?: boolean,
) {
  return useQuery({
    queryKey: [
      'class',
      classId,
      populateTeachers,
      populateStudents,
      populateAssignments,
      populateAssignmentLearningPaths,
    ],
    queryFn: async () => {
      return await fetchPopulatedClassById(
        classId,
        populateTeachers,
        populateStudents,
        populateAssignments,
        populateAssignmentLearningPaths,
      );
    },
    enabled: !!classId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Fetches multiple populated classes by their IDs.
 *
 * @param classIds - The IDs of the classes to be fetched.
 * @param populateTeachers - Whether to populate the teachers in the response.
 * @param populateStudents - Whether to populate the students in the response.
 * @param populateAssignments - Whether to populate the assignments in the response.
 * @param populateAssignmentLearningPaths - Whether to populate the learning paths of the assignments in the response.
 * @returns The query object containing the populated classes data.
 *
 * @remarks `populateAssignmentLearningPaths` is only used if `populateAssignments` is true.
 */
export function usePopulatedClassesById(
  classIds: string[],
  options?: {
    populateTeachers?: boolean;
    populateStudents?: boolean;
    populateAssignments?: boolean;
    populateAssignmentLearningPaths?: boolean;
  },
) {
  const {
    populateTeachers,
    populateStudents,
    populateAssignments,
    populateAssignmentLearningPaths,
  } = options || {};
  return useQuery({
    queryKey: [
      'classes',
      classIds,
      populateTeachers,
      populateStudents,
      populateAssignments,
      populateAssignmentLearningPaths,
    ],
    queryFn: async () => {
      const result: PopulatedClass[] = await fetchNestedData(classIds, (classId) =>
        fetchPopulatedClassById(
          classId,
          populateTeachers,
          populateStudents,
          populateAssignments,
          populateAssignmentLearningPaths,
        ),
      );

      return result;
    },
    enabled: !!classIds.length,
    refetchOnWindowFocus: false,
  });
}
