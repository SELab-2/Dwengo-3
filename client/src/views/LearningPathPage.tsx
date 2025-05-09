import { useState } from 'react';
import { Box, Button, Typography, LinearProgress, Paper, Stack, Snackbar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { SubmissionType } from '../util/interfaces/learningObject.interfaces';
import { LearningPathNodeTransitionDetail } from '../util/interfaces/LearningPathNodeTransition.interfaces';

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
  const [activeIndex, setActiveIndex] = useState(0); // The index of the node that is currently shown
  const [furthestIndex, setFurthestIndex] = useState(0); // The current to be solved question index
  const [progress, setProgress] = useState<number[]>([]); // The list of nodes that have been solved
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

  const totalSteps = learningPath.learningPathNodes.length || 0;
  const currentProgress = (furthestIndex / totalSteps) * 100;
  const maxIndex = totalSteps - 1;

  const multipleChoice = () => {
    if (!currentObject || currentObject.submissionType !== SubmissionType.MULTIPLE_CHOICE) {
      return undefined;
    }

    return currentObject.multipleChoice as unknown as MultipleChoice;
  };

  const handleTransition = (
    rightAnswer: boolean,
    transition?: LearningPathNodeTransitionDetail,
  ) => {
    if (activeIndex <= furthestIndex) {
      if (transition || rightAnswer) {
        if (!progress.includes(activeIndex)) {
          setProgress((prev) => [...prev, activeIndex]);
        }

        if (transition && transition.toNodeIndex > furthestIndex) {
          setFurthestIndex(transition.toNodeIndex);
        }

        // Because multiplechoice questions require a corresponding transition for a correct answer, when this is the last node,
        // it should point to the index -1. When this is the last node and it isn't a multiplechoice question, it doesn't have a transition.
        if ((transition && transition.toNodeIndex === -1) || (rightAnswer && !transition)) {
          setFurthestIndex(maxIndex + 1);
        }

        setWrongAnswer(false);
      } else {
        setWrongAnswer(true);
      }
    } else {
      setSnackbarOpen(true);
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
    if (activeIndex < maxIndex) {
      setActiveIndex(activeIndex + 1);
    }
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
