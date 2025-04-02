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
  learningPath: (id: string) => `/learning-paths/${id}`,
  learningThemes: '/learning-themes',
  learningTheme: (id: string) => `/learning-themes/${id}`,
  class: (id: string) => `/class/${id}`,
  classAssignments: (classId: string) => `/class/${classId}/assignments`,
  classAssignment: (classId: string, assignmentId: string) =>
    `/class/${classId}/assignments/${assignmentId}`,
  classAnnouncements: (classId: string) => `/class/${classId}/announcements`,
  announcement: (announcementId: string) => `/announcement/${announcementId}`,
  classDiscussions: (classId: string) => `/class/${classId}/discussions`,
};

/**
 * This constant contains the API routes for the application.
 */
export const ApiRoutes = {
  // Auth
  login: {
    student: '/api/auth/student/login',
    teacher: '/api/auth/teacher/login',
  },
  register: {
    student: '/api/auth/student/register',
    teacher: '/api/auth/teacher/register',
  },
  logout: {
    student: '/api/auth/student/logout',
    teacher: '/api/auth/teacher/logout',
  },

  // Announcement
  announcement: {
    list: '/api/announcement',
    create: '/api/announcement',
    get: (id: string) => `/api/announcement/${id}`,
    update: (id: string) => `/api/announcement/${id}`,
  },

  // Assignment
  assignment: {
    list: '/api/assignment',
    create: '/api/assignment',
    get: (id: string) => `/api/assignment/${id}`,
  },

  // AssignmentSubmission
  assignmentSubmission: {
    create: '/api/assignmentSubmission',
  },

  // Class
  class: {
    list: '/api/class',
    create: '/api/class',
    get: (id: string) => `/api/class/${id}`,
    update: (id: string) => `/api/class/${id}`,
    deleteStudent: (id: string, studentId: string) => `/api/class/${id}/student/${studentId}`,
    deleteTeacher: (id: string, teacherId: string) => `/api/class/${id}/teacher/${teacherId}`,
  },

  // ClassJoinRequest
  // TODO: Change this when the backend is changed
  classJoinRequest: {
    student: {
      create: '/api/class/studentRequest',
      list: '/api/class/studentRequest',
      reply: '/api/class/studentRequest',
    },
    teacher: {
      create: '/api/class/teacherRequest',
      List: '/api/class/teacherRequest',
      reply: '/api/class/teacherRequest',
    },
  },

  // Discussion
  discussion: {
    list: '/api/discussion',
    create: '/api/discussion',
    get: (id: string) => `/api/discussion/${id}`,
  },

  // LearningObject
  learningObject: {
    list: '/api/learningObject',
    create: '/api/learningObject',
    get: (id: string) => `/api/learningObject/${id}`,
    update: (id: string) => `/api/learningObject/${id}`,
    delete: (id: string) => `/api/learningObject/${id}`,
  },

  // LearningPath
  learningPath: {
    list: '/api/learningPath',
    create: '/api/learningPath',
    get: (id: string) => `/api/learningPath/${id}`,
  },

  // LearningPathNode
  learningPathNode: {
    create: '/api/learningPathNode',
    get: (id: string) => `/api/learningPathNode/${id}`,
  },

  // LearningPathNodeTransition
  learningPathNodeTransition: {
    create: '/api/learningPathNodeTransition',
  },

  // Message
  message: {
    list: '/api/message',
    create: '/api/message',
    delete: (id: string) => `/api/message/${id}`,
  },

  // Student
  student: {
    list: '/api/student',
    get: (id: string) => `/api/student/${id}`,
  },

  // Teacher
  teacher: {
    list: '/api/teacher',
    get: (id: string) => `/api/teacher/${id}`,
  },
};
