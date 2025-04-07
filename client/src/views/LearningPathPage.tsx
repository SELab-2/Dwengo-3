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
  answers: string[];
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
        condition: 'answer == German',
        toNodeIndex: 1,
      },
      {
        id: '2',
        learningPathNodeId: '0',
        condition: 'answer == Dutch',
        toNodeIndex: 2,
      },
    ],
  },
  {
    id: '1',
    learningPathId: '1',
    learningObjectId: '1',
    instruction: '',
    index: 1,
    transitions: [
      {
        id: '1',
        learningPathNodeId: '1',
        condition: 'answer == Dutch',
        toNodeIndex: 2,
      },
    ],
  },
  {
    id: '2',
    learningPathId: '2',
    learningObjectId: '2',
    instruction: '',
    index: 2,
    transitions: [],
  },
];

const LearningObjectDetailData: LearningObjectDetail[] = [
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
      '{"question": "Which of the following is not a programming language?", "answers": ["Java", "HTML", "Dutch", "CSS", "Python", "German"]}',
    ),
  },
  {
    id: '1',
    hruid: '1',
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
    estimatedTime: 40,
    content: 'This is the actual content of the lesson.',
    keywords: ['language', 'coding'],
    multipleChoice: JSON.parse(
      '{"question": "Which of the following is a spoken language?", "answers": ["Dutch", "Java", "HTML", "CSS", "Python"]}',
    ),
  },
  {
    id: '2',
    hruid: '2',
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
    estimatedTime: 40,
    content: 'This is the actual content of the lesson.',
    keywords: ['language', 'coding'],
    multipleChoice: JSON.parse('null'),
  },
];

const LearningPathDetailData: LearningPathDetail[] = [
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
      {
        id: '1',
        learningObject: {
          id: '1',
          title: 'Introduction to Programming',
          language: 'nl',
          estimatedTime: 40,
          keywords: ['programming', 'coding'],
          targetAges: [12, 13, 14],
        },
      },
      {
        id: '2',
        learningObject: {
          id: '2',
          title: 'Introduction to Programming',
          language: 'nl',
          estimatedTime: 40,
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
  const [progress, setProgress] = useState<number[]>([0]);

  const handleSetActiveIndex = (newIndex: number) => {
    // Don't allow users to simply "skip" questions by going to the next one.
    if (newIndex <= Math.max(...progress)) {
      setActiveIndex(newIndex);
    }
  };

  const handleAnswerClick = (answer: string) => {
    if (!learningPathNodeDetail) return;

    const transition = learningPathNodeDetail.transitions.find((t) => {
      const match = t.condition.match(/answer\s*==\s*(.+)/);
      const expected = match?.[1]?.replace(/['"]+/g, '').trim();
      return expected === answer;
    });

    if (transition) {
      const nextIndex = transition.toNodeIndex;
      // If users go through the questions multiple times, don't add the index a second time to the progress.
      if (!progress.includes(nextIndex)) {
        setProgress((prev) => [...prev, nextIndex]);
      }
      setActiveIndex(nextIndex);
    } else {
      alert('No valid transition for this answer.');
    }
  };

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
  const maxIndex = learningPath.learningPathNodes.length - 1;
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
            onClick={() => handleSetActiveIndex(index)}
            p={1}
            mb={1}
            bgcolor={
              index === activeIndex
                ? 'grey' // Color for active node
                : index < Math.max(...progress)
                  ? progress.includes(index)
                    ? 'lightgreen' // Color for completed nodes
                    : 'lightblue' // Color for skipped nodes
                  : 'white' // Color for unvisited nodes
            }
            borderRadius="4px"
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontWeight="bold">{node.learningObject.title}</Typography>
            <Typography variant="caption">{node.learningObject.estimatedTime} min</Typography>
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box flex={1} p={3} display="flex" flexDirection="column">
        <Typography variant="h5" mb={1}>
          {learningPath.title}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(Math.max(...progress) / maxIndex) * 100}
          sx={{ mb: 2 }}
        />
        <Typography variant="caption">
          {(Math.max(...progress) / maxIndex) * 100}% completed
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mt: 2, flex: 1 }}>
          <Typography variant="h6">{learningObjectDetail.title}</Typography>
          <Typography mt={2} color="text.secondary">
            {learningObjectDetail.description}
          </Typography>

          {/* Add multiple choice or other content as needed */}
          <Typography mt={2} fontWeight="bold">
            Question: {multipleChoice.question}
          </Typography>
          <Box mt={1}>
            {multipleChoice.answers.map((option: string, index: number) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleAnswerClick(option)}
                sx={{ m: 0.5 }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Paper>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeIndex === 0} onClick={() => setActiveIndex(activeIndex - 1)}>
            &lt; Previous
          </Button>
          <Button
            disabled={activeIndex === totalSteps - 1}
            onClick={() => handleSetActiveIndex(activeIndex + 1)}
          >
            Next &gt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LearningPathPage;
