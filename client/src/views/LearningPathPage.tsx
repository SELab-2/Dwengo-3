import { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';

interface MultipleChoice {
  question: string;
  options: string[];
  answer: string;
}

function LearningPathPage() {
  const { id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<number[]>([0]);
  const { data: learningPath } = useLearningPathById(id);
  const { data: currentNode, refetch: refetchCurrentNode } = useLearningPathNodeById(
    learningPath?.learningPathNodes[activeIndex].id,
  );
  const { data: currentObject, refetch: refetchCurrentObject } = useLearningObjectById(
    currentNode?.learningObjectId,
  );

  const handleSetActiveIndex = (newIndex: number) => {
    if (newIndex <= Math.max(...progress)) {
      setActiveIndex(newIndex);
    }
  };

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

  if (!learningPath || !currentObject || !currentNode) {
    return <div>Loading...</div>;
  }

  const handleAnswerClick = (answer: string) => {
    if (!currentNode) return;

    // Not undefined when a transition is found and the right answer is clicked for this transition
    const transition = currentNode.transitions.find((t) => {
      const match = t.condition.match(/answer\s*==\s*(.+)/);
      const expected = match?.[1]?.replace(/['"]+/g, '').trim();
      return expected === answer;
    });

    if (transition) {
      const nextIndex = transition.toNodeIndex;
      if (!progress.includes(nextIndex)) {
        setProgress((prev) => [...prev, nextIndex]);
      }
    }
  };

  const totalSteps = learningPath?.learningPathNodes.length || 0;
  const currentProgress = (Math.max(...progress) / totalSteps) * 100;
  const maxIndex = totalSteps - 1;
  const multipleChoice = currentObject.multipleChoice as unknown as MultipleChoice;

  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      <Box width="200px" p={2} sx={(theme) => ({ bgcolor: theme.palette.custom.color6 })}>
        {learningPath.learningPathNodes.map((node, index) => {
          const isCompleted = progress.includes(index);
          const isVisited = index < Math.max(...progress);

          let bgcolor = 'white';
          if (index === activeIndex) bgcolor = 'grey';
          else if (isVisited) bgcolor = isCompleted ? 'lightgreen' : 'lightblue';

          return (
            <Box
              key={node.id}
              onClick={() => handleSetActiveIndex(index)}
              p={1}
              mb={1}
              bgcolor={bgcolor}
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
          <Typography variant="h6">{currentObject.title}</Typography>
          <Typography mt={2} color="text.secondary">
            {currentObject.description}
          </Typography>

          <Typography mt={2} fontWeight="bold">
            Question: {multipleChoice.question}
          </Typography>

          <Box mt={1}>
            {multipleChoice.options.map((option, index) => (
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
