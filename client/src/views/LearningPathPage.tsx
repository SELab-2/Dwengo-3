import { Box, Button, LinearProgress, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLearningPathById } from '../hooks/useLearningPath';
import { useTranslation } from 'react-i18next';
import { ErrorOutline } from '@mui/icons-material';
import FileTextField from '../components/textfields/FileTextField';
import {
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
import {
  downloadFileSubmission,
  fetchAssignmentSubmissionById,
  fetchAssignmentSubmissions,
} from '../api/assignmentSubmission';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../hooks/useAuth';
import { AxiosProgressEvent } from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import parse from 'html-react-parser';
import { useGroup, useUpdateCurrentIndexForGroup } from '../hooks/useGroup.ts';
import { LearningPathNodeTransitionDetail } from '../util/interfaces/LearningPathNodeTransition.interfaces.ts';
import { LearningPathNodeDetail } from '../util/interfaces/learningPathNode.interfaces.ts';
import { LearningObjectDetail } from '../util/interfaces/learningObject.interfaces.ts';
import { fetchLearningObjectById } from '../api/learningObject.ts';
import { fetchLearningPathNodeById } from '../api/learningPathNode.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { GroupDetail } from '../util/interfaces/group.interfaces.ts';
import { FavoriteDetail } from '../util/interfaces/favorite.interfaces.ts';
import { useFavoriteById, useUpdateCurrentNodeIndexForFavorite } from '../hooks/useFavorite.ts';

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
  const { user } = useAuth();

  const groupId = searchParams.get('groupId');
  const favoriteId = searchParams.get('favoriteId');

  let data: GroupDetail | FavoriteDetail | undefined = undefined;
  if (groupId) data = useGroup(groupId).data;
  else if (favoriteId) data = useFavoriteById(favoriteId).data;

  const [currentSubmission, setCurrentSubmission] = useState<
    AssignmentSubmissionDetail | undefined
  >(undefined);

  // The list of nodes that have been solved
  const [progress, setProgress] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);

  const { data: learningPath } = useLearningPathById(id);

  // total number of nodes
  const totalSteps = learningPath?.learningPathNodes.length || 0;

  // progress in % to show in progress bar
  const currentProgress =
    progress.length > 0 ? ((Math.max(...progress) + 1) / totalSteps) * 100 : 0;

  // last node to visit
  const maxIndex = totalSteps - 1;

  useEffect(() => {
    if (!data) return;

    setProgress(data.progress);
    setFurthestIndex(data.currentNodeIndex !== -1 ? data.currentNodeIndex : totalSteps);
    setActiveIndex(data.currentNodeIndex !== -1 ? data.currentNodeIndex : totalSteps);
  }, [learningPath, data]);

  const [progressEvent, setProgressEvent] = useState<AxiosProgressEvent | undefined>(undefined);
  const updateIndexMutation = groupId
    ? useUpdateCurrentIndexForGroup()
    : useUpdateCurrentNodeIndexForFavorite();
  const submissionCreate = useCreateAssignmentSubmission(setProgressEvent);
  const submissionUpdate = useUpdateAssignmentSubmission(setProgressEvent);
  const { setError } = useError();
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentNode, setCurrentNode] = useState<LearningPathNodeDetail | undefined>(undefined);
  const [currentObject, setCurrentObject] = useState<LearningObjectDetail | undefined>(undefined);

  useEffect(() => {
    const abort = new AbortController();
    const signal = abort.signal;
    setCurrentNode(undefined);
    setCurrentObject(undefined);
    setCurrentSubmission(undefined);

    if (!learningPath) {
      return () => abort.abort();
    }

    if (activeIndex === totalSteps) {
      setIsLoading(false);
      return () => abort.abort();
    }

    const fetchData = async () => {
      try {
        // fetch the node
        const node = await fetchLearningPathNodeById(
          learningPath.learningPathNodes[activeIndex].id,
          signal,
        );
        setCurrentNode(node);

        // fetch learning object
        const lo = await fetchLearningObjectById(node.learningObject.id);
        setCurrentObject(lo);

        // fetch submissions
        const submissions = await fetchAssignmentSubmissions(
          groupId ?? undefined,
          favoriteId ?? undefined,
          node.id,
          undefined,
          undefined,
          signal,
        );

        // fetch submission
        if (submissions && submissions.data.length > 0) {
          const submission = await fetchAssignmentSubmissionById(submissions.data[0].id);
          setCurrentSubmission(submission);
        }
      } catch (error: any) {
        setError(error.response.data.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // if activeIndex changes too fast, abort the request
    return () => abort.abort();
  }, [learningPath, activeIndex]);

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

  const setNextIndex = (transition: LearningPathNodeTransitionDetail) => {
    if (activeIndex > furthestIndex) {
      setSnackbarOpen(true);
      return;
    }

    if (!progress.includes(activeIndex)) setProgress((prev) => [...prev, activeIndex]);

    const newIndex = transition.toNodeIndex === -1 ? maxIndex + 1 : transition.toNodeIndex;
    setFurthestIndex(newIndex);

    updateIndexMutation.mutate({
      id: groupId ? groupId : favoriteId!!,
      index: newIndex === totalSteps ? -1 : newIndex,
    });

    if (newIndex === -1) return;
    setActiveIndex(newIndex);
  };

  const submitRead = async () => {
    if (currentSubmission)
      submissionUpdate.mutate(
        {
          id: currentSubmission.id,
          data: {
            submissionType: SubmissionType.READ,
          },
        },
        {
          onError: (error: any) => {
            setError(error.response.data.message || error.message);
          },
        },
      );
    else
      submissionCreate.mutate(
        {
          submissionType: SubmissionType.READ,
          nodeId: currentNode!!.id,
          groupId: groupId ?? undefined,
          favoriteId: favoriteId ?? undefined,
        },
        {
          onError: (error: any) => {
            setError(error.response.data.message || error.message);
          },
        },
      );
  };

  const submitMultipleChoice = async () => {
    if (currentSubmission)
      submissionUpdate.mutate(
        {
          id: currentSubmission.id,
          data: {
            submissionType: SubmissionType.MULTIPLE_CHOICE,
            submission: currentAnswer!!,
          },
        },
        {
          onError: (error: any) => {
            setError(error.response.data.message || error.message);
          },
        },
      );
    else
      submissionCreate.mutate(
        {
          submissionType: SubmissionType.MULTIPLE_CHOICE,
          nodeId: currentNode!!.id,
          groupId: groupId ?? undefined,
          favoriteId: favoriteId ?? undefined,
          submission: currentAnswer ? currentAnswer : undefined,
        },
        {
          onError: (error: any) => {
            setError(error.response.data.message || error.message);
          },
        },
      );
  };

  const toNextNode = async () => {
    // proceed according to submission type
    switch (currentObject?.submissionType) {
      // no submission needed for read nodes
      case SubmissionType.READ: {
        await submitRead();
        const transition = currentNode?.transitions?.[0];
        if (transition === undefined) {
          if (activeIndex === maxIndex) {
            setNextIndex({ id: '', learningPathNodeId: '', condition: '', toNodeIndex: -1 });
          }
          break;
        }

        setNextIndex(transition);
        break;
      }
      // first submit current selected answer, then proceed
      case SubmissionType.MULTIPLE_CHOICE: {
        await submitMultipleChoice();

        const transition = currentNode?.transitions?.find((t) => {
          const match = t.condition.match(/answer\s*==\s*(.+)/);
          const expected = match?.[1]?.replace(/['"]+/g, '').trim();
          return expected === currentAnswer;
        });

        if (transition === undefined) {
          if (activeIndex === maxIndex) {
            setNextIndex({ id: '', learningPathNodeId: '', condition: '', toNodeIndex: -1 });
          }
          return;
        }

        setNextIndex(transition);
        break;
      }
      // file: submission done when uploading a file
      case SubmissionType.FILE: {
        const transition = currentNode?.transitions?.[0];
        if (transition === undefined) {
          if (activeIndex === maxIndex) {
            setNextIndex({ id: '', learningPathNodeId: '', condition: '', toNodeIndex: -1 });
          }
          return;
        }

        setNextIndex(transition);
        break;
      }
    }
  };

  // todo: use this function to set the current clicked answer to the selected one, use this to check in submit field
  // if answer is correct or not
  const handleAnswerClick = (answer: string) => {
    setCurrentAnswer(answer);
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
            onError: (error: any) => {
              setError(error.response.data.message || error.message);
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
            onError: (error: any) => {
              setError(error.response.data.message || error.message);
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
      <Box
        width="300px"
        p={2}
        sx={(theme) => ({
          backgroundColor: theme.palette.custom.color6,
          overflowY: 'auto',
        })}
      >
        {learningPath?.learningPathNodes.map((node, index) => (
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
          {learningPath?.title}
        </Typography>

        <LinearProgress variant="determinate" value={currentProgress} sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary" mb={2}>
          {Math.round(currentProgress)}% completed
        </Typography>

        {/* This box grows and scrolls if needed */}
        {!isLoading && activeIndex < totalSteps && (
          <>
            <Box
              overflow="auto"
              sx={{
                minHeight: 0,
                maxHeight: 'calc(100vh - var(--navbar-heigh))',
                maxWidth: '70vw',
              }}
            >
              {currentNode !== undefined && currentObject ? (
                <Paper elevation={3} sx={{ p: 3 }}>
                  {/* Content here */}
                  <Typography variant="h6" fontWeight="medium">
                    {currentObject.title}
                  </Typography>

                  <Typography mt={2} color="text.secondary">
                    {currentNode.instruction}
                  </Typography>

                  <MathJaxContext version={3} config={mathJaxConfig}>
                    <MathJax hideUntilTypeset="first">
                      <Typography mt={2} color="text.secondary" component="div">
                        {parse(currentObject.content)}
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
                            sx={{
                              width: '100%',
                              textTransform: 'none',
                              border: option === currentAnswer ? '1px solid blue' : 'none',
                            }}
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
                                downloadFileSubmission(
                                  currentSubmission.id,
                                  fileSubmission()?.fileName!,
                                )
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
              ) : (
                <div>{t('loading')}</div>
              )}
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
                disabled={activeIndex === -1 || activeIndex > furthestIndex}
                onClick={async () => {
                  await toNextNode();
                }}
                sx={{ width: '48%' }}
              >
                {t('next')} &gt;
              </Button>
            </Box>
          </>
        )}
        {!isLoading && activeIndex === totalSteps && (
          <Link to={AppRoutes.myClasses}>{t('back')}</Link>
        )}
        {isLoading && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {t('loading')}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default LearningPathPage;
