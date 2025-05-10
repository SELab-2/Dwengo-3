import { useState } from 'react';
import { Box, Button, LinearProgress, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { LearningPathNodeTransitionDetail } from '../util/interfaces/LearningPathNodeTransition.interfaces';
import { createAssignmentSubmission } from '../api/assignmentSubmission.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useStudent } from '../hooks/useUser.ts';
import { SubmissionType } from '../util/interfaces/learningObject.interfaces.ts';

interface MultipleChoice {
  question: string;
  options: string[];
}

const mathJaxConfig = {
  loader: { load: ['[tex]/ams'] },
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
  },
};

function LearningPathPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get('classId');
  const groupId = searchParams.get('groupId');

  const { user } = useAuth();
  const student = useStudent(user?.id);

  // The index of the node that is currently shown

  const [activeIndex, setActiveIndex] = useState(0);
  // The current to be solved question index

  const [furthestIndex, setFurthestIndex] = useState(0);
  // The list of nodes that have been solved
  const [progress, setProgress] = useState<number[]>([]);
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data: learningPath } = useLearningPathById(id);
  const { data: currentNode } = useLearningPathNodeById(
    learningPath?.learningPathNodes[activeIndex].id,
  );
  const { data: currentObject } = useLearningObjectById(currentNode?.learningObject.id);

  if (!learningPath) {
    return <div>{t('loading')}</div>;
  }

  // total number of nodes
  const totalSteps = learningPath.learningPathNodes.length || 0;

  // progress in % to show in progress bar
  const currentProgress = (furthestIndex / totalSteps) * 100;

  // last node to visit
  const maxIndex = totalSteps - 1;

  const multipleChoice = () => {
    if (!currentObject || currentObject.submissionType !== SubmissionType.MULTIPLE_CHOICE) {
      return undefined;
    }

    return currentObject.multipleChoice as unknown as MultipleChoice;
  };

  const handleTransition = async (
    rightAnswer: boolean,
    transition?: LearningPathNodeTransitionDetail,
  ) => {
    // activeIndex is at an impossible state, show error to user
    if (activeIndex > furthestIndex) {
      setSnackbarOpen(true);
      return;
    }

    // cannot proceed to next node, show user wrong answer message
    if (!transition && !rightAnswer) {
      setWrongAnswer(true);
      return;
    }

    // add activeIndex to progress
    if (!progress.includes(activeIndex)) {
      setProgress((prev) => [...prev, activeIndex]);
    }

    // update the furthest index if transition points to a node that hasn't been visited
    if (transition && transition.toNodeIndex > furthestIndex) {
      setFurthestIndex(transition.toNodeIndex);
      await createAssignmentSubmission({
        nodeId: currentNode?.id ?? '',
        submission: '',
        submissionType: SubmissionType.READ,
        groupId: groupId ?? undefined,
      });
    }

    // Because multiple choice questions require a corresponding transition for a correct answer, when this is the last node,
    // it should point to the index -1. When this is the last node and it isn't a multiple choice question, it doesn't have a transition.
    if ((transition && transition.toNodeIndex === -1) || (rightAnswer && !transition)) {
      setFurthestIndex(maxIndex + 1);
      // send new value to db
    }

    setWrongAnswer(false);

    // update active index
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleAnswerClick = (answer: string) => {
    const transition = currentNode?.transitions.find((t) => {
      const match = t.condition.match(/answer\s*==\s*(.+)/);
      const expected = match?.[1]?.replace(/['"]+/g, '').trim();
      return expected === answer;
    });

    handleTransition(!!transition, transition);
  };

  const handleReadClick = () => {
    const transition = currentNode?.transitions[0];
    handleTransition(true, transition);
  };

  const nodeColor = (index: number) => {
    const isActive = index === activeIndex;
    const isInProgress = progress.includes(index);

    if (isActive && isInProgress) return '#a9b9a9';
    if (isActive) return 'grey';
    if (isInProgress) return 'lightgreen';
    if (index < furthestIndex) return 'lightblue';
    return 'white';
  };

  console.log('activeIndex', activeIndex, 'furthestIndex', furthestIndex);

  return (
    <Box display="flex" height="90vh">
      {/* Sidebar */}
      <Box width="300px" p={2} sx={(theme) => ({ bgcolor: theme.palette.custom.color6 })}>
        {learningPath.learningPathNodes.map((node, index) => (
          <Box
            key={node.id}
            onClick={() => {
              if (index !== activeIndex) {
                setWrongAnswer(false);
                setActiveIndex(index);
              }
            }}
            p={1}
            mb={1}
            bgcolor={nodeColor(index)}
            borderRadius="8px"
            sx={{ cursor: 'pointer', transition: 'all 0.3s', '&:hover': { bgcolor: 'lightgray' } }}
          >
            <Typography fontWeight="bold" variant="body1" noWrap>
              {node.learningObject.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              ~{node.learningObject.estimatedTime} min
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Box flex={1} p={3} display="flex" flexDirection="column">
        <Typography variant="h5" mb={2}>
          {learningPath.title}
        </Typography>

        <LinearProgress variant="determinate" value={currentProgress} sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary" mb={2}>
          {Math.round(currentProgress)}% completed
        </Typography>

        {/* This box grows and scrolls if needed */}
        <Box
          flex={1}
          overflow="auto"
          sx={{
            minHeight: 0,
          }}
        >
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Content here */}
            <Typography variant="h6" fontWeight="medium">
              {currentObject?.title ?? t('loading')}
            </Typography>
            {currentNode?.instruction && (
              <Typography mt={2} color="text.secondary">
                {currentNode.instruction}
              </Typography>
            )}
            <MathJaxContext version={3} config={mathJaxConfig}>
              <MathJax hideUntilTypeset="first">
                <Typography mt={2} color="text.secondary" component="div">
                  {parse(currentObject?.content ?? t('loading'))}
                </Typography>
              </MathJax>
            </MathJaxContext>

            {/* Handle submission types */}
            {currentObject?.submissionType === SubmissionType.MULTIPLE_CHOICE && (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {multipleChoice()?.question ?? t('loading')}
                </Typography>
                <Box
                  mt={2}
                  display="grid"
                  gap={1}
                  gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                >
                  {multipleChoice()?.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleAnswerClick(option)}
                      sx={{ width: '100%', textTransform: 'none' }}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {currentObject?.submissionType === SubmissionType.FILE && (
              <Box mt={3}>
                <Typography variant="h6" fontWeight="medium">
                  {t('TODO')}
                </Typography>
              </Box>
            )}

            {currentObject?.submissionType === SubmissionType.READ && (
              <Box mt={3}>
                <Typography variant="h6" fontWeight="medium">
                  {t('readContent')}
                </Typography>
                <Button variant="contained" onClick={() => handleReadClick()} sx={{ mt: 2 }}>
                  {t('continue')}
                </Button>
              </Box>
            )}

            {wrongAnswer && (
              <Box
                mt={2}
                px={2}
                py={1}
                sx={{
                  backgroundColor: (theme) => theme.palette.error.light,
                  color: (theme) => theme.palette.error.contrastText,
                  borderRadius: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ErrorOutline sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {t('incorrectAnswer')}
                  </Typography>
                </Stack>
              </Box>
            )}

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message={t('completePreviousSteps')}
            />
          </Paper>
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            disabled={activeIndex === 0}
            onClick={() => {
              setWrongAnswer(false);
              setActiveIndex(activeIndex - 1);
            }}
            sx={{ width: '48%' }}
          >
            &lt; {t('previous')}
          </Button>
          <Button
            disabled={activeIndex === maxIndex}
            onClick={() => {
              setWrongAnswer(false);
              setActiveIndex(activeIndex + 1);
            }}
            sx={{ width: '48%' }}
          >
            {t('next')} &gt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LearningPathPage;
