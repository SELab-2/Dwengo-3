import { groupSelectShort } from "./group.select";
import { learningPathNodeSelectShort } from "./learningPathNode.select";

export const assignmentSubmissionSelectDetail = {
    id: true,
    submission: true,
    group: {
      select: groupSelectShort
    },
    node: {
      select: learningPathNodeSelectShort
    }
};
  
export const assignmentSubmissionSelectShort = {
    id: true
};