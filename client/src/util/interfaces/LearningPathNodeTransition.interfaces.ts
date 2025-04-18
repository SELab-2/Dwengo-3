export interface LearningPathNodeTransitionDetail {
  id: string;
  learningPathNodeId: string;
  condition: string;
  toNodeIndex: number;
}

export interface LearningPathNodeTransitionCreate {
  learningPathNodeId: string;
  toNodeIndex: number;
  condition: string;
}
