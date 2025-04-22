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
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import {
  useClassJoinRequests,
  useHandleClassJoinRequestStudent,
} from '../hooks/useClassJoinRequest.ts';
import { Decision } from '../util/interfaces/classJoinRequest.interfaces.ts';
import { useError } from '../hooks/useError.ts';

function ClassDashboardPage() {
  const { t } = useTranslation();
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
      <ClassNavigationBar id={classData!.id} className={classData!.name} />

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

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">{t('name')}</Typography>
            <Stack spacing={2} sx={{ mt: 2, overflowY: 'auto' }}>
              {classData!.students.map((student) => (
                // TODO add links for students and teachers profiles
                <Box key={student.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ flex: 1, color: 'blue', cursor: 'pointer' }}>
                    {student.user.name} {student.user.surname}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={50} // TODO: Replace with actual progress value
                    sx={{ flex: 3, height: 8, borderRadius: 5 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/class/${classData!.id}/student/${student.id}`)}
                  >
                    {t('details')}
                  </Button>
                </Box>
              ))}
            </Stack>
          </Paper>

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
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        {t('approve')}
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: 'red', color: 'white' }}
                        onClick={() => handleRemoveRequest(request.id)}
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
