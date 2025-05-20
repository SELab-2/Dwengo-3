/**
 * This constant contains the routes that are accessible to all users,
 */
export const PublicRoutes = ['/login', '/register'];

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
      throw new Error('Only one of groupId or favoriteId should be provided.');
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
  classEdit: (classId: string) => `/class/${classId}/edit`,
  classStudentDetails: (classId: string, studentId: string) =>
    `/class/${classId}/student/${studentId}`,
  classAdd: '/class/add',
  classAssignments: (classId: string) => `/class/${classId}/assignments`,
  classAssignment: (classId: string, assignmentId: string) =>
    `/class/${classId}/assignments/${assignmentId}`,
  classAssignmentCreate: (classId: string) => `/class/${classId}/assignments/create`,
  classAnnouncements: (classId: string) => `/class/${classId}/announcements`,
  classAnnouncementCreate: (classId: string) => `/class/${classId}/announcements/create`,
  announcement: (announcementId: string) => `/announcement/${announcementId}`,
  classDiscussions: (classId: string, assignmentIdTag?: string, groupIdTag?: string) => {
    if (groupIdTag && !assignmentIdTag) {
      throw new Error('groupIdTag should only be provided with assignmentIdTag.');
    }

    let url = `/class/${classId}/discussions`;

    if (assignmentIdTag) {
      url += `#${encodeURIComponent(assignmentIdTag)}`;
      if (groupIdTag) {
        url += `:${encodeURIComponent(groupIdTag)}`;
      }
    }

    return url;
  },
  discussionCreate: (classId: string, assignmentId?: string): string => {
    let url = `/class/${classId}/discussions/create`;

    if (assignmentId) {
      url += `?assignmentId=${encodeURIComponent(assignmentId)}`;
    }

    return url;
  },
  groupSubmission: (classId: string, assignmentId: string, groupId: string) =>
    `/class/${classId}/assignments/${assignmentId}/group/${groupId}`,
};
