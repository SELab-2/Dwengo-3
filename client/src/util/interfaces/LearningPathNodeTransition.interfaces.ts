export interface LearningPathNodeTransitionDetail {
  id: string;
  learningPathNodeId: string;
  condition: JSON;
  toNodeIndex: number;
}
