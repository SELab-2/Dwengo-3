import {
  Box,
  Button,
  GridLegacy,
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
import { useNavigate, useParams } from 'react-router-dom';
<<<<<<< HEAD

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

const studentsData = [
  { id: '1', name: 'Roshnie Soetens', progress: 70 },
  { id: '2', name: 'Charmayne Breijer', progress: 50 },
  { id: '3', name: 'Soulaiman Bosland', progress: 30 },
  { id: '4', name: 'Ouassima Wiltink', progress: 60 },
  { id: '5', name: 'Davey Kraft', progress: 80 },
  { id: '6', name: 'Franciscus de Bruin', progress: 45 },
  { id: '7', name: 'Florence Rijsbergen', progress: 55 },
  { id: '8', name: 'Seher van den Doel', progress: 20 },
];

const admissionRequests = [
  { id: '1', name: 'Wichert van de Pol' },
  { id: '2', name: 'Elton Sas' },
  { id: '3', name: 'Jens van de Kleut' },
];

function ClassDashboardPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

=======
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import {
  useClassJoinRequests,
  useHandleClassJoinRequestStudent,
} from '../hooks/useClassJoinRequest.ts';
import { Decision } from '../util/interfaces/classJoinRequest.interfaces.ts';
import { useError } from '../hooks/useError.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { useAssignmentsOfClass } from '../hooks/useAssignment.ts';

function ClassDashboardPage() {
  const { t } = useTranslation();
>>>>>>> origin/dev
  const navigate = useNavigate();

  const { classId } = useParams<{ classId: string }>();
  const {
    data: classData,
    isLoading: isClassDataLoading,
    refetch: refetchClassData,
  } = useClassById(classId!);
  const {
    data: joinRequestData,
    isLoading: isJoinRequestDataLoading,
    refetch: refetchJoinRequests,
  } = useClassJoinRequests(classId!);
  const classJoinMutation = useHandleClassJoinRequestStudent();

  const { data: assignmentsData } = useAssignmentsOfClass(classId!);

  let assignment = undefined;
  let totalProgress = undefined;
  let groupsCompleted = undefined;
  if (assignmentsData?.data?.length ?? 0 > 0) {
    assignment = assignmentsData?.data[assignmentsData?.data.length - 1]!;
    totalProgress = assignment.learningPath.learningPathNodes.length;
    groupsCompleted = assignment.groups
      .map((group) => group.progress[group.progress.length - 1] + 1)
      .flat();
  }

  const { setError } = useError();

  const joinRequests = joinRequestData?.data || [];

  const handleClassJoinRequest = (id: string, decision: Decision) => {
    classJoinMutation.mutate(
      { requestId: id, decision: decision },
      {
        // TODO snackbar gebruiken om de melding te tonen on Success?
        onSuccess: async () => {
          // reload students component to fetch new data
          await refetchClassData();
          await refetchJoinRequests();
        },
        onError: (error: Error) => {
          // Show error message in snackbar
          setError(error.message);
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
<<<<<<< HEAD
      <ClassNavigationBar id={id!} className={classData.name} />
=======
      <ClassNavigationBar id={classData!.id} className={classData!.name} />
>>>>>>> origin/dev

      <GridLegacy container spacing={3}>
        {/* Left Sidebar (Co-Teachers & Info) */}
        <GridLegacy item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
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
              {t('notes')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {classData!.notes || // TODO add notes to class
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#424242', color: 'white' }}
              onClick={() => {
                // TODO: add link to edit class page
                alert('TODO: Navigate to Edit Class Page');
              }} // Replace with actual navigation
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
                  <TableCell>
                    <Typography variant="h6">
                      <strong>{t('progress')}: </strong>
                      {assignment?.learningPath.title}
                    </Typography>
                  </TableCell>
                  <TableCell />
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
                      <TableCell sx={{ minWidth: 200 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 8, borderRadius: 5 }}
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!isJoinRequestDataLoading && joinRequests.length > 0 && (
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
