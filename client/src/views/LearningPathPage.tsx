import { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Paper, Stack, Snackbar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';

interface MultipleChoice {
  question: string;
  options: string[];
}

function LearningPathPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0); // The index of the node that is currently shown
  const [furthestIndex, setFurthestIndex] = useState(0); // The current to be solved question index
  const [progress, setProgress] = useState<number[]>([]); // The list of nodes that have been solved
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { data: learningPath } = useLearningPathById(id);
  const { data: currentNode, refetch: refetchCurrentNode } = useLearningPathNodeById(
    learningPath?.learningPathNodes[activeIndex].id,
  );
  const { data: currentObject, refetch: refetchCurrentObject } = useLearningObjectById(
    currentNode?.learningObjectId,
  );

  useEffect(() => {
    if (learningPath) {
      refetchCurrentNode();
    }
  }, [learningPath, activeIndex, refetchCurrentNode]);

  useEffect(() => {
    if (currentNode) {
      refetchCurrentObject();
    }
  }, [currentNode, activeIndex, refetchCurrentObject]);

  if (!learningPath) {
    return <div>{t('loading')}</div>;
  }

  const totalSteps = learningPath.learningPathNodes.length || 0;
  const currentProgress = (furthestIndex / totalSteps) * 100;
  const maxIndex = totalSteps - 1;

  const multipleChoice = () => {
    if (!currentObject) return undefined;
    return currentObject.multipleChoice as unknown as MultipleChoice;
  };

  const handleAnswerClick = (answer: string) => {
    if (activeIndex <= furthestIndex) {
      const transition = currentNode?.transitions.find((t) => {
        const match = t.condition.match(/answer\s*==\s*(.+)/);
        const expected = match?.[1]?.replace(/['"]+/g, '').trim();
        return expected === answer;
      });

      if (transition) {
        if (!progress.includes(activeIndex)) {
          setProgress((prev) => [...prev, activeIndex]);
        }

        if (transition.toNodeIndex > furthestIndex) {
          setFurthestIndex(transition.toNodeIndex);
        }

        if (transition.toNodeIndex == -1) {
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

            <Typography mt={2} color="text.secondary">
              {currentNode?.instruction ?? t('loading')}
            </Typography>

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
