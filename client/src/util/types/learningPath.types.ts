import { LearningPathNodeShort } from './learningPathNode.types';

// TODO: edit this type and add other relevant types
export interface LearningPathShort {
  id: string;
  title: string;
  learningPathNodes: {
    learningObject: {
      targetAges: number[];
      keywords: {
        keyword: string;
      }[];
    };
  }[];
  image: string;
  description: string;
}

export interface LearningPathDetail {
  id: string;
  hruid: string;
  language: string;
  title: string;
  description: string;
  image: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  learningPathNodes: LearningPathNodeShort[];
}
