import { ApiRoutes } from './api.routes';
import apiClient from './apiClient';
import {
  ClassCreate,
  ClassDetail,
  ClassShort,
  ClassUpdate,
  PopulatedClass,
} from '../util/interfaces/class.interfaces';
import { PaginatedData } from '../util/interfaces/general.interfaces';
import { fetchNestedData } from './util';
import { fetchAssignmentById } from './assignment';
import { fetchLearningPathById } from './learningPath';
import { fetchStudentById } from './student';
import { fetchTeacherById } from './teacher';
import { AssignmentDetail } from '../util/interfaces/assignment.interfaces';

/**
 * Fetches a list of classes based on the provided student or teacher IDs.
 *
 * @param page - The pagenumber of the pagination you want to fetch
 * @param pageSize - The number of items you want to fetch
 * @param studentId - The ID of the student whose classes are to be fetched.
 * @param teacherId - The ID of the teacher whose classes are to be fetched.
 * @returns The list of classes.
 */
export async function fetchClasses(
  studentId?: string,
  teacherId?: string,
  page?: number,
  pageSize?: number,
) {
  const response = await apiClient.get(ApiRoutes.class.list, {
    params: {
      page,
      pageSize,
      studentId,
      teacherId,
    },
  });

  const result: PaginatedData<ClassShort> = response.data;

  return result;
}

/**
 * Fetches a class by its ID.
 *
 * @param id - The ID of the class to be fetched.
 * @returns The class details.
 */
export async function fetchClassById(id: string) {
  const response = await apiClient.get(ApiRoutes.class.get(id));

  const result: ClassDetail = response.data;

  return result;
}

/**
 * Fetches a populated class by its ID.
 *
 * @param classId - The ID of the class to be fetched.
 * @param populateTeachers - Whether to populate the teachers in the response.
 * @param populateStudents - Whether to populate the students in the response.
 * @param populateAssignments - Whether to populate the assignments in the response.
 * @param populateAssignmentLearningPaths - Whether to populate the learning paths of the assignments in the response.
 * @returns The populated class details.
 *
 * @remarks `populateAssignmentLearningPaths` is only used if `populateAssignments` is true.
 */
export async function fetchPopulatedClassById(
  classId: string,
  populateTeachers: boolean = false,
  populateStudents: boolean = false,
  populateAssignments: boolean = false,
  populateAssignmentLearningPaths: boolean = false,
) {
  const classDetail: ClassDetail = await fetchClassById(classId);
  let result: PopulatedClass = {
    ...classDetail,
  };

  // Populate the teachers
  if (populateTeachers && result.teachers) {
    result.teachers = await fetchNestedData(
      classDetail.teachers.map((teacher) => teacher.id),
      fetchTeacherById,
    );
  }

  // Populate the students
  if (populateStudents && result.students) {
    result.students = await fetchNestedData(
      classDetail.students.map((student) => student.id),
      fetchStudentById,
    );
  }

  // Populate the assignments
  if (populateAssignments && result.assignments) {
    result.assignments = (await fetchNestedData(
      classDetail.assignments.map((assignment) => assignment.id),
      fetchAssignmentById,
    )) as AssignmentDetail[];

    // Populate the learning paths of the assignments
    if (populateAssignmentLearningPaths) {
      for (const assignment of result.assignments) {
        assignment.learningPath = await fetchLearningPathById(assignment.learningPath.id);
      }
    }
  }

  return result;
}

/**
 * Create a new class
 *
 * @param data - The data of the class to be created
 * @returns The classDetails
 */
export async function createClass(data: ClassCreate) {
  const response = await apiClient.put(ApiRoutes.class.create, data);

  const result: ClassDetail = response.data;
  return result;
}

/**
 * Update a class
 *
 * @param id - The id of the class to be updated
 * @param data - The update-data
 * @returns The classDetails
 */
export async function updateClass(id: string, data: ClassUpdate) {
  const response = await apiClient.patch(ApiRoutes.class.update(id), data);

  return response.data;
}

/**
 * Delete a student from a class
 *
 * @param classId - The id of the class
 * @param studentId - The id of the student
 * @returns The classDetails
 */
export async function deleteStudentFromClass(classId: string, studentId: string) {
  const response = await apiClient.delete(ApiRoutes.class.deleteStudent(classId, studentId));

  return response.data;
}

/**
 * Delete a teacher from a class
 *
 * @param classId - The id of the class
 * @param teacherID - The id of the teacher
 * @returns The classDetails
 */
export async function deleteTeacherFromClass(classId: string, teacherId: string) {
  const response = await apiClient.delete(ApiRoutes.class.deleteTeacher(classId, teacherId));

  return response.data;
}
