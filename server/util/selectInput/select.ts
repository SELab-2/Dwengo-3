// --- User ---
export const userSelectShort = {
  id: true,
  surname: true,
  name: true,
  role: true,
};

// --- Teacher ---
export const teacherSelectShort = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const teacherSelectDetail = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
  classes: {
    select: () => classSelectShort,
  },
};

// --- Student ---
export const studentSelectShort = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
};

export const studentSelectDetail = {
  id: true,
  userId: true,
  user: {
    select: {
      name: true,
      surname: true,
    },
  },
  classes: {
    select: () => classSelectShort,
  },
  groups: {
    select: () => groupSelectShort,
  },
};

// --- Class ---
export const classSelectShort = {
  id: true,
  name: true,
};

export const classSelectDetail = {
  id: true,
  name: true,
  teachers: {
    select: () => teacherSelectShort,
  },
  students: {
    select: () => studentSelectShort,
  },
  assignments: {
    select: () => assignmentSelectShort,
  },
};

// --- Group ---
export const groupSelectShort = {
  id: true,
  progress: true,
  assignmentId: true,
  name: true,
  students: {
    select: studentSelectShort,
  },
};

export const groupSelectDetail = {
  id: true,
  name: true,
  progress: true,
  assignment: {
    select: () => assignmentSelectShort,
  },
  discussion: {
    select: () => discussionSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
};

// --- Announcement ---
export const announcementSelectShort = {
  id: true,
  title: true,
};

export const announcementSelectDetail = {
  id: true,
  title: true,
  content: true,
  class: {
    select: classSelectShort,
  },
  teacher: {
    select: teacherSelectShort,
  },
};

// --- Learning Object ---
export const learningObjectSelectShort = {
  id: true,
  title: true,
  language: true,
  estimatedTime: true,
  keywords: {
    select: {
      keyword: true,
    },
  },
  targetAges: true,
};

export const learningObjectSelectDetail = {
  id: true,
  hruid: true,
  version: true,
  language: true,
  title: true,
  description: true,
  contentType: true,
  contentLocation: true,
  targetAges: true,
  teacherExclusive: true,
  skosConcepts: true,
  educationalGoals: true,
  copyright: true,
  licence: true,
  difficulty: true,
  estimatedTime: true,
  returnValue: true,
  available: true,
  createdAt: true,
  updatedAt: true,
  content: true,
  multipleChoice: true,
  submissionType: true,
  keywords: {
    select: {
      keyword: true,
    },
  },
};

// --- Learning Path Node Transition ---
export const learningPathNodeTransitionSelectDetail = {
  id: true,
  learningPathNodeId: true,
  condition: true,
  toNodeIndex: true,
};

// --- Learning Path Node ---
export const learningPathNodeSelectShort = {
  id: true,
  learningObject: {
    select: learningObjectSelectShort,
  },
};

export const learningPathNodeSelectDetail = {
  id: true,
  learningPathId: true,
  learningObject: {
    select: learningObjectSelectShort,
  },
  instruction: true,
  index: true,
  transitions: {
    select: learningPathNodeTransitionSelectDetail,
  },
};

// --- Learning Path ---
export const learningPathSelectShort = {
  id: true,
  title: true,
  learningPathNodes: {
    select: learningPathNodeSelectShort,
  },
  image: true,
  description: true,
};

export const learningPathSelectDetail = {
  id: true,
  hruid: true,
  title: true,
  description: true,
  image: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  learningPathNodes: {
    select: learningPathNodeSelectShort,
  },
};

// --- Assignment ---
export const assignmentSelectShort = {
  id: true,
  learningPathId: true,
};

export const assignmentSelectShort2 = {
  id: true,
  groups: {
    select: {
      id: true,
      progress: true,
      name: true,
      students: {
        select: {
          id: true,
        },
      },
    },
  },
  learningPath: {
    select: {
      id: true,
      title: true,
      learningPathNodes: {
        select: {
          learningObject: {
            select: {
              estimatedTime: true,
            },
          },
        },
      },
    },
  },
};

export const assignmentSelectDetail = {
  id: true,
  teacher: {
    select: teacherSelectShort,
  },
  class: {
    select: classSelectShort,
  },
  groups: {
    select: groupSelectShort,
  },
  learningPath: {
    select: learningPathSelectShort,
  },
};

// --- Assignment Submission ---
export const assignmentSubmissionSelectShort = {
  id: true,
};

export const assignmentSubmissionSelectDetail = {
  id: true,
  submissionType: true,
  submission: true,
  group: {
    select: groupSelectShort,
  },
  node: {
    select: learningPathNodeSelectShort,
  },
  favorite: {
    select: () => FavoriteSelectShort,
  },
};

// --- Favorite ---
export const FavoriteSelectShort = {
  id: true,
  userId: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
};

export const FavoriteSelectDetail = {
  id: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};

// --- Discussion ---
export const discussionSelectShort = {
  id: true,
};

export const discussionSelectDetail = {
  id: true,
  group: {
    select: groupSelectShort,
  },
  members: {
    select: userSelectShort,
  },
  messages: {
    select: () => messageSelectDetail,
  },
};

// --- Message ---
export const messageSelectShort = {
  id: true,
  content: true,
  sender: {
    select: userSelectShort,
  },
  createdAt: true,
};

export const messageSelectDetail = {
  id: true,
  content: true,
  sender: {
    select: userSelectShort,
  },
  discussionId: true,
  createdAt: true,
};

// --- Class Join Request ---
export const classJoinRequestSelectDetail = {
  id: true,
  class: {
    select: classSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};
