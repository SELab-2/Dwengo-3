import {
  Box,
  Button,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

const studentsData = [
  { id: 1, name: 'Roshnie Soetens', progress: 70 },
  { id: 2, name: 'Charmayne Breijer', progress: 50 },
  { id: 3, name: 'Soulaiman Bosland', progress: 30 },
  { id: 4, name: 'Ouassima Wiltink', progress: 60 },
  { id: 5, name: 'Davey Kraft', progress: 80 },
  { id: 6, name: 'Franciscus de Bruin', progress: 45 },
  { id: 7, name: 'Florence Rijsbergen', progress: 55 },
  { id: 8, name: 'Seher van den Doel', progress: 20 },
];

const admissionRequests = [
  { id: 1, name: 'Wichert van de Pol' },
  { id: 2, name: 'Elton Sas' },
  { id: 3, name: 'Jens van de Kleut' },
];

function ClassDashboardPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />

      <Grid container spacing={3}>
        {/* Left Sidebar (Co-Teachers & Info) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('coTeachers')}
            </Typography>
            <List sx={{ maxHeight: 100, overflowY: 'auto', bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {classData.teachers.map((teacher, index) => (
                <ListItem key={index}>
                  <ListItemText primary={teacher} sx={{ color: 'blue', cursor: 'pointer' }} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
              {t('notes')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {classData.notes}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#424242', color: 'white' }}
              onClick={() => alert('Navigate to Edit Class Page')} // Replace with actual navigation
            >
              {t('editClassGroup')}
            </Button>
          </Paper>
        </Grid>

        {/* Main Content (Students & Admission Requests) */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" sx={{ mt: 3 }}>
            {t('students')}
          </Typography>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">{t('name')}</Typography>
            <Stack spacing={2} sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
              {studentsData.map((student) => (
                <Box key={student.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ flex: 1, color: 'blue', cursor: 'pointer' }}>
                    {student.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={student.progress}
                    sx={{ flex: 3, height: 8, borderRadius: 5 }}
                  />
                  <Button variant="contained">{t('details')}</Button>
                </Box>
              ))}
            </Stack>
          </Paper>

          {admissionRequests.length > 0 && (
            <Typography variant="h4" sx={{ mt: 4 }}>
              {t('admissionRequests')}
            </Typography>
          )}

          {admissionRequests.length > 0 && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Stack spacing={2}>
                {admissionRequests.map((request) => (
                  <Box key={request.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ flex: 1, color: 'blue', cursor: 'pointer' }}>
                      {request.name}
                    </Typography>
                    <Button variant="contained" sx={{ bgcolor: 'green', color: 'white' }}>
                      {t('approve')}
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: 'red', color: 'white' }}>
                      {t('remove')}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClassDashboardPage;
