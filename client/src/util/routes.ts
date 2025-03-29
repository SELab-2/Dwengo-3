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
};

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
  },

  // Assignment
  assignment: {
    list: '/api/assignment',
    create: '/api/assignment',
    get: (id: string) => `/api/assignment/${id}`,
  },

  // Class
  class: {
    list: '/api/class',
    create: '/api/class',
    get: (id: string) => `/api/class/${id}`,
  },

  // ClassJoinRequest
  classJoinRequest: {
    student: '/api/studentRequest',
    teacher: '/api/teacherRequest',
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
  },

  // LearningPath
  learningPath: {
    list: '/api/learningPath',
    create: '/api/learningPath',
    get: (id: string) => `/api/learningPath/${id}`,
  },

  // Message
  message: {
    list: '/api/message',
    create: '/api/message',
    get: (id: string) => `/api/message/${id}`,
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
