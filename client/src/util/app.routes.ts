/**
 * This constant contains the routes for the application.
 */
export const AppRoutes = {
  // Public Routes
  login: '/login',
  register: '/register',

  // Protected Routes
  home: '/',
  profile: '/profile',
  myClasses: '/classes',
  myLearningPaths: '/learning-paths',
  learningPath: (id: string, groupId?: string, favoriteId?: string): string => {
    if (groupId && favoriteId) {
      throw new Error("Only one of groupId or favoriteId should be provided.");
    }

    let url = `/learning-paths/${id}`;

    if (groupId) {
      url += `?groupId=${encodeURIComponent(groupId)}`;
    } else if (favoriteId) {
      url += `?favoriteId=${encodeURIComponent(favoriteId)}`;
    }

    return url;
  },
  learningThemes: '/learning-themes',
  learningTheme: (id: string) => `/learning-themes/${id}`,
  class: (id: string) => `/class/${id}`,
  classStudentDetails: (classId: string, studentId: string) =>
    `/class/${classId}/student/${studentId}`,
  classAdd: '/class/add',
  classAssignments: (classId: string) => `/class/${classId}/assignments`,
  classAssignment: (classId: string, assignmentId: string) =>
    `/class/${classId}/assignments/${assignmentId}`,
  classAssignmentCreate: (classId: string) => `/class/${classId}/assignments/create`,
  classAnnouncements: (classId: string) => `/class/${classId}/announcements`,
  announcement: (announcementId: string) => `/announcement/${announcementId}`,
  classDiscussions: (classId: string) => `/class/${classId}/discussions`,
};
