import {
  Box,
  Button,
  GridLegacy,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import {
  useClassJoinRequests,
  useHandleClassJoinRequestStudent,
} from '../hooks/useClassJoinRequest.ts';
import {
  ClassJoinRequestDetail,
  Decision,
} from '../util/interfaces/classJoinRequest.interfaces.ts';
import { useError } from '../hooks/useError.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { useAssignmentsOfClass } from '../hooks/useAssignment.ts';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth } from '../hooks/useAuth.ts';
import { useNotification } from '../hooks/useNotification.ts';

function ClassDashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setError } = useError();
  const { setNotification } = useNotification();
  const classJoinMutation = useHandleClassJoinRequestStudent();
  const { classId } = useParams<{ classId: string }>();

  const {
    data: classData,
    isLoading: isClassDataLoading,
    refetch: refetchClassData,
  } = useClassById(classId!);

  const teacher = user?.teacher;

  let joinRequests: ClassJoinRequestDetail[] = [];
  let assignment = undefined;
  let totalProgress = undefined;
  let groupsCompleted = undefined;
  let refetch = undefined;

  if (teacher) {
    const {
      data: joinRequestData,
      isLoading: isJoinRequestDataLoading,
      refetch: refetchJoinRequests,
    } = useClassJoinRequests(classId!);

    refetch = refetchJoinRequests;

    const { data: assignmentsData, isLoading: isAssignmentsLoading } = useAssignmentsOfClass(
      classId!,
    );

    if ((assignmentsData?.data?.length ?? 0) > 0) {
      assignment = assignmentsData?.data[assignmentsData?.data.length - 1]!;
      totalProgress = assignment.learningPath.learningPathNodes.length;
      groupsCompleted = assignment.groups
        .map((group) => group.progress[group.progress.length - 1] + 1)
        .flat();
    }
    joinRequests = joinRequestData?.data || [];

    if (isJoinRequestDataLoading || isAssignmentsLoading) {
      return (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      );
    }
  }

  const handleClassJoinRequest = (id: string, decision: Decision) => {
    classJoinMutation.mutate(
      { requestId: id, decision: decision },
      {
        onSuccess: async () => {
          setNotification(t('joinRequestSuccess'));
          // reload students component to fetch new data
          await refetchClassData();
          await refetch!();
        },
        onError: (error: any) => {
          // Show error message in snackbar
          setError(error.response.data.message);
        },
      },
    );
  };

  return isClassDataLoading ? (
    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
      {t('loading')}
    </Typography>
  ) : (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData!.id} className={classData!.name} />

      <GridLegacy container spacing={3}>
        {/* Left Sidebar (Co-Teachers & Info) */}
        <GridLegacy item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('classId')}
            </Typography>

            {/* Horizontally scrollable class ID with copy icon outside */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                mt: 1,
                maxWidth: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  maxWidth: '100%',
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    userSelect: 'all',
                  }}
                  component="span"
                >
                  {classData?.id}
                </Typography>
              </Box>
              <IconButton
                size="small"
                aria-label={t('copy')}
                onClick={() => {
                  setNotification(t('copied'));
                  navigator.clipboard.writeText(classData?.id ?? '');
                }}
                sx={{ ml: 1 }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('coTeachers')}
            </Typography>
            <List sx={{ maxHeight: 100, overflowY: 'auto', bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {classData!.teachers.map((teacher, index) => (
                // TODO add links for students and teachers profiles
                <ListItem key={index}>
                  <ListItemText
                    primary={`${teacher.user.name} ${teacher.user.surname}`}
                    sx={{ color: 'blue', cursor: 'pointer' }}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
              {t('classDescription')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {classData!.description}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#424242', color: 'white' }}
              onClick={() => {
                navigate(AppRoutes.classEdit(classId!));
              }}
            >
              {t('editClassGroup')}
            </Button>
          </Paper>
        </GridLegacy>

        {/* Main Content (Students & Admission Requests) */}
        <GridLegacy item xs={12} md={9}>
          <Typography variant="h4" sx={{ mt: 3 }}>
            {t('students')}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">
                      <strong>{t('name')}</strong>
                    </Typography>
                  </TableCell>
                  {teacher && (
                    <>
                      <TableCell>
                        <Typography variant="h6">
                          <strong>{t('progress')}: </strong>
                          <Link to={AppRoutes.learningPath(assignment?.learningPath.id || '/404')}>
                            {assignment?.learningPath.title}
                          </Link>
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {classData!.students.map((student) => {
                  let progress = 0;
                  if (assignment && groupsCompleted && totalProgress) {
                    const groupIndex = assignment.groups.findIndex(
                      (group) => group.students.findIndex((s) => s.id === student.id) > -1,
                    );
                    if (groupIndex > -1) {
                      progress = (groupsCompleted[groupIndex] / totalProgress) * 100;
                    }
                  }

                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Typography
                          sx={{
                            color: 'blue',
                            cursor: 'pointer',
                          }}
                        >
                          {student.user.name} {student.user.surname}
                        </Typography>
                      </TableCell>
                      {teacher && (
                        <>
                          <TableCell sx={{ minWidth: 200 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{ height: 8, borderRadius: 5, width: '100%' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() =>
                                navigate(AppRoutes.classStudentDetails(classData!.id, student!.id))
                              }
                            >
                              {t('details')}
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {joinRequests.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4">{t('admissionRequests')}</Typography>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Stack spacing={2}>
                  {joinRequests.map((request) => (
                    <Box key={request.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ flex: 1, color: 'blue', cursor: 'pointer' }}>
                        {request.user.name} {request.user.surname}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: 'green', color: 'white' }}
                        onClick={() => handleClassJoinRequest(request.id, Decision.accept)}
                      >
                        {t('approve')}
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: 'red', color: 'white' }}
                        onClick={() => handleClassJoinRequest(request.id, Decision.deny)}
                      >
                        {t('remove')}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}
        </GridLegacy>
      </GridLegacy>
    </Box>
  );
}

export default ClassDashboardPage;
