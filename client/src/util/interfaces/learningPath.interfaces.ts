import { keyword } from './keyword.interfaces';
import { LearningPathNodeShort } from './learningPathNode.interfaces';

export interface LearningPathShort {
  id: string;
  title: string;
  learningPathNodes: {
    learningObject: {
      targetAges: number[];
      keywords: keyword[];
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
