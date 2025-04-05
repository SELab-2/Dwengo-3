import { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  LearningPathNodeDetail,
  LearningPathNodeShort,
} from '../util/types/learningPathNode.types';
import { LearningObjectDetail } from '../util/types/learningObject';
import { LearningPathDetail } from '../util/types/learningPath.types';

interface MultipleChoice {
  question: string;
  options: string[];
  answer: string;
}

// Mock data for fetching node and learning object details
const LearningPathNodeDetailData = [
  {
    id: '0',
    learningPathId: '0',
    learningObjectId: '0',
    instruction: 'Start with an introduction to basic concepts.',
    index: 0,
    transitions: [
      {
        id: '0',
        learningPathNodeId: '0',
        condition: 'If the user has completed the previous task.',
        toNodeIndex: 1,
      },
    ],
  },
];

const LearningObjectDetailData: [LearningObjectDetail] = [
  {
    id: '0',
    hruid: '0',
    version: 1,
    title: 'Introduction to Programming',
    description: 'This module introduces basic programming concepts and practices.',
    contentType: 'test',
    contentLocation: 'https://example.com/content',
    targetAges: [12, 13, 14],
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: JSON.parse('[]'),
    licence: '',
    difficulty: 2,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    copyright: '2023',
    returnValue: JSON.parse('{"success": true}'),
    estimatedTime: 120,
    content: 'This is the actual content of the lesson.',
    keywords: ['programming', 'coding', 'technology'],
    multipleChoice: JSON.parse(
      '{"question": "Which of the following is a programming language?", "options": ["Java", "HTML", "CSS", "Python"], "answer": "Java"}',
    ),
  },
];

const LearningPathDetailData: [LearningPathDetail] = [
  {
    id: '0',
    hruid: '0',
    language: 'nl',
    description: 'A sample learning path for programming.',
    title: 'Sample Learning Path',
    image: 'https://example.com/image.png',
    ownerId: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
    learningPathNodes: [
      {
        id: '0',
        learningObject: {
          id: '0',
          title: 'Introduction to Programming',
          language: 'nl',
          estimatedTime: 120,
          keywords: ['programming', 'coding'],
          targetAges: [12, 13, 14],
        },
      },
    ],
  },
];

// Mock API Calls
const fetchLearningPathNodeDetail = async (nodeId: string): Promise<LearningPathNodeDetail> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(LearningPathNodeDetailData[parseInt(nodeId)]), 40),
  );
};

const fetchLearningObjectDetail = async (
  learningObjectId: string,
): Promise<LearningObjectDetail> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(LearningObjectDetailData[parseInt(learningObjectId)]), 40),
  );
};

const fetchLearningPathDetail = async (id: string): Promise<LearningPathDetail> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(LearningPathDetailData[parseInt(id)]), 40),
  );
};

function LearningPathPage() {
  const { id } = useParams<{ id: string }>();
  const [learningPath, setLearningPath] = useState<LearningPathDetail | null>(null);
  const [learningPathNodeDetail, setLearningPathNodeDetail] =
    useState<LearningPathNodeDetail | null>(null);
  const [learningObjectDetail, setLearningObjectDetail] = useState<LearningObjectDetail | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchLearningPathDetail(id).then(setLearningPath);
    }
  }, [id]);

  useEffect(() => {
    if (learningPath && learningPath.learningPathNodes[activeIndex]) {
      const nodeId = learningPath.learningPathNodes[activeIndex].id;
      fetchLearningPathNodeDetail(nodeId).then((nodeDetail) => {
        setLearningPathNodeDetail(nodeDetail);

        // Fetch the Learning Object Detail based on the learningObjectId in the node
        fetchLearningObjectDetail(nodeDetail.learningObjectId).then(setLearningObjectDetail);
      });
    }
  }, [learningPath, activeIndex]);

  if (!learningPath || !learningPathNodeDetail || !learningObjectDetail) {
    return <Typography>Loading...</Typography>;
  }

  const totalSteps = learningPath.learningPathNodes.length;
  const progress = Math.round((activeIndex / totalSteps) * 100);

  const multipleChoice = learningObjectDetail.multipleChoice as unknown as MultipleChoice;

  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      <Box
        width="200px"
        p={2}
        sx={(theme) => ({
          bgcolor: theme.palette.custom.color6,
        })}
      >
        {learningPath.learningPathNodes.map((node: LearningPathNodeShort, index: number) => (
          <Box
            key={node.id}
            onClick={() => setActiveIndex(index)}
            p={1}
            mb={1}
            bgcolor={index === activeIndex ? '#aaffaa' : 'white'}
            borderRadius="4px"
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontWeight="bold">{node.learningObject.title}</Typography>
            <Typography variant="caption">{learningObjectDetail.estimatedTime} min</Typography>
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box flex={1} p={3} display="flex" flexDirection="column">
        <Typography variant="h5" mb={1}>
          {learningPath.title}
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
        <Typography variant="caption">{progress}% completed</Typography>

        <Paper elevation={2} sx={{ p: 3, mt: 2, flex: 1 }}>
          <Typography variant="h6">{learningObjectDetail.title}</Typography>
          <Typography mt={2} color="text.secondary">
            {learningObjectDetail.description}
          </Typography>

          {/* Add multiple choice or other content as needed */}
          <Typography mt={2} fontWeight="bold">
            Question: {multipleChoice.question}
          </Typography>
          <ul>
            {multipleChoice.options.map((option: string, index: number) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </Paper>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeIndex === 0} onClick={() => setActiveIndex((i) => i - 1)}>
            &lt; Previous
          </Button>
          <Button
            disabled={activeIndex === totalSteps - 1}
            onClick={() => setActiveIndex((i) => i + 1)}
          >
            Next &gt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LearningPathPage;
