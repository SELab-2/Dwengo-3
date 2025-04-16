import { keyword } from './keyword.interfaces';

export interface LearningObjectShort {
  id: string;
  title: string;
  language: string;
  estimatedTime: number;
  kewords: keyword[];
  targetAges: number[];
}

export interface LearningObjectDetail {
  id: string;
  hruid: string;
  version: number;
  language: string;
  title: string;
  description: string;
  contentType: string;
  contentLocation: string;
  targetAges: number[];
  teacherExclusive: boolean;
  skosConcepts: string[];
  educationalGoals: JSON[];
  copyright: string;
  licence: string;
  difficulty: number;
  estimatedTime: number;
  returnValue: JSON;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  multipleChoice: JSON;
  keywords: keyword[];
}
