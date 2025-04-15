import { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';
import { useTranslation } from 'react-i18next';

interface MultipleChoice {
  question: string;
  options: string[];
}

function LearningPathPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<number[]>([]);
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
  const currentProgress =
    progress.length === 0 ? 0 : ((Math.max(...progress) + 1) / totalSteps) * 100;
  const maxIndex = totalSteps - 1;
  const multipleChoice = () => {
    if (!currentObject) return undefined;
    return currentObject.multipleChoice as unknown as MultipleChoice;
  };
  console.log(progress);

  const handleAnswerClick = (answer: string) => {
    // Not undefined when a transition is found and the right answer is clicked for this transition
    const transition = currentNode?.transitions.find((t) => {
      const match = t.condition.match(/answer\s*==\s*(.+)/);
      const expected = match?.[1]?.replace(/['"]+/g, '').trim();
      return expected === answer;
    });

    if (transition) {
      if (!progress.includes(activeIndex)) {
        setProgress((prev) => [...prev, activeIndex]);
      }
    }
  };

  const nodeColor = (index: number) => {
    if (index === activeIndex) return 'grey';
    if (progress.includes(index)) return 'lightgreen';
    if (index < Math.max(...progress)) return 'lightblue';
    return 'white';
  };

  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      <Box width="200px" p={2} sx={(theme) => ({ bgcolor: theme.palette.custom.color6 })}>
        {learningPath.learningPathNodes.map((node, index) => {
          return (
            <Box
              key={node.id}
              onClick={() => setActiveIndex(index)}
              p={1}
              mb={1}
              bgcolor={nodeColor(index)}
              borderRadius="4px"
              sx={{ cursor: 'pointer' }}
            >
              <Typography fontWeight="bold">{node.learningObject.title}</Typography>
              <Typography variant="caption">{node.learningObject.estimatedTime} min</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Main Content */}
      <Box flex={1} p={3} display="flex" flexDirection="column">
        <Typography variant="h5" mb={1}>
          {learningPath.title}
        </Typography>
        <LinearProgress variant="determinate" value={currentProgress} sx={{ mb: 2 }} />
        <Typography variant="caption">{currentProgress}% completed</Typography>

        <Paper elevation={2} sx={{ p: 3, mt: 2, flex: 1 }}>
          <Typography variant="h6">{currentObject?.title ?? t('loading')}</Typography>
          <Typography mt={2} color="text.secondary">
            {currentNode?.instruction ?? t('loading')}
          </Typography>

          <Typography mt={2} fontWeight="bold">
            Question: {multipleChoice()?.question ?? t('loading')}
          </Typography>

          <Box mt={1}>
            {multipleChoice()?.options.map((option, index) => (
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
            disabled={activeIndex === maxIndex}
            onClick={() => setActiveIndex(activeIndex + 1)}
          >
            Next &gt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LearningPathPage;
