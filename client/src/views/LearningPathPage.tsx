import { Box, Button, LinearProgress, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useLearningObjectById } from '../hooks/useLearningObject';
import { useLearningPathNodeById } from '../hooks/useLearningPathNode';
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import FileTextField from '../components/textfields/FileTextField';
import {
  useAssignmentSubmissionById,
  useAssignmentSubmissions,
  useCreateAssignmentSubmission,
  useUpdateAssignmentSubmission,
} from '../hooks/useAssignmentSubmission';
import {
  AssignmentSubmissionDetail,
  FileSubmission,
  MultipleChoice,
  SubmissionType,
} from '../util/interfaces/assignmentSubmission.interfaces';
import { useError } from '../hooks/useError';
import { downloadFileSubmission } from '../api/assignmentSubmission';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../hooks/useAuth';
import { AxiosProgressEvent } from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { LearningPathNodeTransitionDetail } from '../util/interfaces/LearningPathNodeTransition.interfaces';
import { createAssignmentSubmission } from '../api/assignmentSubmission.ts';
import { useStudent } from '../hooks/useUser.ts';
import { useGroup } from '../hooks/useGroup.ts';

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

  const groupId = searchParams.get('groupId');
  const favoriteId = searchParams.get('favoriteId');

  const { data: group } = useGroup(groupId ?? undefined, favoriteId ?? undefined);
  // The current to be solved question index

  // The list of nodes that have been solved
  const [progress, setProgress] = useState<number[]>(group?.progress || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(
    progress.length > 0 ? Math.max(...progress) : 0,
  );
  const { user } = useAuth();
  const [progressEvent, setProgressEvent] = useState<AxiosProgressEvent | undefined>(undefined);
  const submissionCreate = useCreateAssignmentSubmission(setProgressEvent);
  const submissionUpdate = useUpdateAssignmentSubmission(setProgressEvent);
  const { setError } = useError();
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { data: learningPath } = useLearningPathById(id);
  const { data: currentNode } = useLearningPathNodeById(
    learningPath?.learningPathNodes[activeIndex].id,
  );
  const { data: currentObject } = useLearningObjectById(currentNode?.learningObject.id);
  const { data: submissions, isLoading: isSubmissionsLoading } = useAssignmentSubmissions(
    groupId ?? undefined,
    favoriteId ?? undefined,
    currentNode?.id,
  );

  const submissionId = submissions?.data?.[0]?.id;
  const { data: submission, isLoading: isSubmissionLoading } = useAssignmentSubmissionById(
    submissionId!,
  );
  const [currentSubmission, setCurrentSubmission] = useState<
    AssignmentSubmissionDetail | undefined
  >(undefined);

  useEffect(() => {
    if (submission) {
      setCurrentSubmission(submission);
    }
  }, [submission]);

  if (!learningPath || isSubmissionsLoading || isSubmissionLoading) {
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

  const fileSubmission = () => {
    if (!currentSubmission) return undefined;
    return currentSubmission.submission as unknown as FileSubmission;
  };

  const isFile = (): boolean => {
    return currentObject?.submissionType === SubmissionType.FILE;
  };

  const submit = async (
    submissionType: SubmissionType,
    submission: string | undefined = undefined,
    file: File | undefined = undefined,
  ) => {
    const data = {
      nodeId: currentNode?.id ?? '',
      submission: submission,
      submissionType: submissionType,
      groupId: groupId ?? undefined,
      file: file,
    };

    return await createAssignmentSubmission(data);
  };

  // const handleTransition = async (
  //   rightAnswer: boolean,
  //   transition?: LearningPathNodeTransitionDetail,
  // ) => {
  //   // activeIndex is at an impossible state, show error to user
  //   if (activeIndex > furthestIndex) {
  //     setSnackbarOpen(true);
  //     return;
  //   }
  //
  //   // cannot proceed to next node, show user wrong answer message
  //   if (!transition && !rightAnswer) {
  //     setWrongAnswer(true);
  //     return;
  //   }
  //
  //   // add activeIndex to progress
  //   if (!progress.includes(activeIndex)) {
  //     setProgress((prev) => [...prev, activeIndex]);
  //   }
  //
  //   // update the furthest index if transition points to a node that hasn't been visited
  //   if (transition && transition.toNodeIndex > furthestIndex) {
  //     setFurthestIndex(transition.toNodeIndex);
  //
  //     // todo: submission type not always READ
  //     await submit(SubmissionType.READ);
  //   }

  // Because multiple choice questions require a corresponding transition for a correct answer, when this is the last node,
  // it should point to the index -1. When this is the last node and it isn't a multiple choice question, it doesn't have a transition.
  //   if ((transition && transition.toNodeIndex === -1) || (rightAnswer && !transition)) {
  //     setFurthestIndex(maxIndex + 1);
  //
  //     // todo: submission type not always READ
  //     await submit(SubmissionType.READ);
  //   }
  //
  //   setWrongAnswer(false);
  //
  //   // update active index
  //   if (activeIndex < maxIndex) {
  //     setActiveIndex(activeIndex + 1);
  //   }
  // };

  const handleAnswerClick = (answer: string) => {
    if (activeIndex > furthestIndex) {
      setSnackbarOpen(true);
      return;
    }

    const transition = currentNode?.transitions.find((t) => {
      const match = t.condition.match(/answer\s*==\s*(.+)/);
      const expected = match?.[1]?.replace(/['"]+/g, '').trim();
      return expected === answer;
    });

    if (!transition) {
      setWrongAnswer(true);
      return;
    }

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
  };

  const handleReadClick = async () => {
    const transition = currentNode?.transitions[0];
    // await handleTransition(true, transition);
  };

  const handleFileSubmission = () => {
    if (!file) return;

    currentSubmission
      ? submissionUpdate.mutate(
          {
            id: currentSubmission.id,
            data: {
              submissionType: SubmissionType.FILE,
              file: file,
            },
          },
          {
            onSuccess: (response) => {
              setProgressEvent(undefined);
              setFile(null);
              setCurrentSubmission(response);
            },
            onError: (error) => {
              setError(error.message);
            },
          },
        )
      : submissionCreate.mutate(
          {
            nodeId: currentNode!.id,
            groupId: groupId ?? undefined,
            favoriteId: favoriteId ?? undefined,
            submissionType: SubmissionType.FILE,
            file: file,
          },
          {
            onSuccess: (response) => {
              setProgressEvent(undefined);
              setFile(null);
              setCurrentSubmission(response);
            },
            onError: (error) => {
              setError(error.message);
            },
          },
        );
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

            {multipleChoice() ? (
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
            ) : isFile() ? (
              <Box mt={3}>
                {currentSubmission ? (
                  <Box>
                    <Typography mt={2} variant="subtitle1">
                      {`${t('fileSubmitted')}: `}
                      <Button
                        endIcon={<DownloadIcon />}
                        onClick={() =>
                          downloadFileSubmission(currentSubmission.id, fileSubmission()?.fileName!)
                        }
                      >
                        {fileSubmission()?.fileName}
                      </Button>
                    </Typography>
                    {user?.student && (
                      <Typography mt={2} variant="subtitle1" fontWeight="bold">
                        {t('submitOtherFile')}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography mt={2} variant="subtitle1">
                    {t('noFileSubmitted')}
                  </Typography>
                )}
                {user?.student && (
                  <Box>
                    <FileTextField setFile={setFile} progressEvent={progressEvent} />
                    <Box justifyContent={'center'} display={'flex'}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: { xs: '100%', sm: '40%' } }}
                        disabled={!groupId && !favoriteId}
                        onClick={handleFileSubmission}
                      >
                        {t('submit')}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : null}

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
