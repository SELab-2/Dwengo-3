import { UUID } from 'crypto';

export interface LearningPathNodeTransitionDetail {
  id: string;
  learningPathNodeId: string;
  condition: string;
  toNodeIndex: number;
}

export interface LearningPathNodeTransitionCreate {
  learningPathNodeId: UUID;
  toNodeIndex: number;
  condition: string;
}
