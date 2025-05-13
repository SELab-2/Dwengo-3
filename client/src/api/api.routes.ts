/**
 * This constant contains the API routes for the application.
 */
export const ApiRoutes = {
  // Auth
  login: {
    google: {
      student: '/api/auth/student/login/google',
      teacher: '/api/auth/teacher/login/google',
    },
    student: '/api/auth/student/login/local',
    teacher: '/api/auth/teacher/login/local',
  },
  register: {
    student: '/api/auth/student/register',
    teacher: '/api/auth/teacher/register',
  },
  logout: '/api/auth/logout',

  // Me (get the logged in user)
  me: '/api/auth/me',

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
    list: '/api/assignmentSubmission',
    get: (id: string) => `/api/assignmentSubmission/${id}`,
    update: (id: string) => `/api/assignmentSubmission/${id}`,
    download: (id: string) => `/api/assignmentSubmission/${id}/download`,
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
  classJoinRequest: {
    student: {
      create: '/api/class/studentRequest',
      list: '/api/class/studentRequest',
      reply: '/api/class/studentRequest',
    },
    teacher: {
      create: '/api/class/teacherRequest',
      list: '/api/class/teacherRequest',
      reply: '/api/class/teacherRequest',
    },
  },

  // Discussion
  discussion: {
    list: '/api/discussion',
    create: '/api/discussion',
    get: (id: string) => `/api/discussion/${id}`,
    update: (id: string) => `/api/discussion/${id}`,
  },

  // Favorites
  favorites: {
    create: '/api/favorites',
    list: '/api/favorites',
    get: (id: string) => `/api/favorites/${id}`,
    delete: (id: string) => `/api/favorites/${id}`,
  },

  // LearningTheme
  learningTheme: {
    list: '/api/learningTheme',
    create: '/api/learningTheme',
    get: (id: string) => `/api/learningTheme/${id}`,
    delete: (id: string) => `/api/learningTheme/${id}`,
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
