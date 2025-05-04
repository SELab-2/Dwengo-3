import { keyword } from './keyword.interfaces';

export enum ContentType {
  'TEXT_PLAIN',
  'TEXT_MARKDOWN',
  'IMAGE_IMAGE_BLOCK',
  'IMAGE_IMAGE',
  'AUDIO_MPEG',
  'APPLICATION_PDF',
  'EXTERN',
  'BLOCKLY',
}

export enum SubmissionType {
  'MULTIPLE_CHOICE' = 'MULTIPLE_CHOICE',
  'FILE' = 'FILE',
  'READ' = 'READ',
}

export interface LearningObjectShort {
  id: string;
  title: string;
  language: string;
  estimatedTime: number;
  keywords: keyword[];
  targetAges: number[];
}

export interface LearningObjectDetail {
  id: string;
  hruid: string;
  version: number;
  language: string;
  title: string;
  description: string;
  contentType: ContentType;
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
  submissionType: SubmissionType;
  updatedAt: Date;
  content: string;
  multipleChoice: JSON;
  keywords: keyword[];
}

export interface LearningObjectCreate {
  hruid: string;
  string: string;
  version: number;
  language: string;
  title: string;
  description?: string;
  contentType?: ContentType;
  targetAges?: number[];
  teacherExclusive?: boolean;
  skosConcepts?: string[];
  educationalGoals?: JSON[];
  copyright?: string;
  licence?: string;
  difficulty?: number;
  estimatedTime?: number;
  returnValue?: JSON;
  available?: boolean;
  content: string;
  multipleChoice?: JSON;
  keywords?: keyword[];
}

export interface LearningObjectUpdate {
  version?: number;
  title?: string;
  description?: string;
  contentType?: ContentType;
  targetAges?: number[];
  teacherExclusive?: boolean;
  skosConcepts?: string[];
  educationalGoals?: JSON[];
  copyright?: string;
  licence?: string;
  difficulty?: number;
  estimatedTime?: number;
  returnValue?: JSON;
  available?: boolean;
  content?: string;
  multipleChoice?: JSON;
  keywords?: keyword[];
}
