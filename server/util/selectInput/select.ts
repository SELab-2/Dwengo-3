/* The order of these selects in this file is important to avoid reference before instantiation */

export const userSelectShort = {
  id: true,
  surname: true,
  name: true,
  role: true,
};

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

export const classSelectShort = {
  id: true,
  name: true,
};

export const groupSelectShort = {
  id: true,
  progress: true,
  assignmentId: true,
  name: true,
  students: {
    select: studentSelectShort,
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
    select: classSelectShort,
  },
  groups: {
    select: groupSelectShort,
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
    select: classSelectShort,
  },
};

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

export const learningPathNodeTransitionSelectDetail = {
  id: true,
  learningPathNodeId: true,
  condition: true,
  toNodeIndex: true,
};

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

export const assignmentSelectShort = {
  id: true,
  learningPathId: true,
};

export const classSelectDetail = {
  id: true,
  name: true,
  teachers: {
    select: teacherSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
  assignments: {
    select: assignmentSelectShort,
  },
};

export const assignmentSelectShort2 = {
  id: true,
  groups: {
    select: groupSelectShort,
  },
  deadline: true,
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
  deadline: true
};

export const assignmentSubmissionSelectShort = {
  id: true,
};

export const favoriteSelectShort = {
  id: true,
  userId: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
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
    select: favoriteSelectShort,
  },
};

export const favoriteSelectDetail = {
  id: true,
  progress: true,
  learningPath: {
    select: learningPathSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};

export const discussionSelectShort = {
  id: true,
};

export const groupSelectDetail = {
  id: true,
  name: true,
  progress: true,
  assignment: {
    select: assignmentSelectShort,
  },
  discussion: {
    select: discussionSelectShort,
  },
  students: {
    select: studentSelectShort,
  },
};

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

export const discussionSelectDetail = {
  id: true,
  group: {
    select: groupSelectShort,
  },
  members: {
    select: userSelectShort,
  },
  messages: {
    select: messageSelectDetail,
  },
};

export const classJoinRequestSelectDetail = {
  id: true,
  class: {
    select: classSelectShort,
  },
  user: {
    select: userSelectShort,
  },
};
