import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { AppRoutes } from '../util/app.routes.ts';

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
};

const mockLearningPaths = [
  { id: '1', name: 'leerpad 1', group: 'Group 1', completed: 7, total: 8 },
  { id: '2', name: 'leerpad 2', group: 'Group 2', completed: 11, total: 16 },
  { id: '3', name: 'leerpad 3', group: 'Group 3', completed: 8, total: 11 },
  { id: '4', name: 'leerpad 4', group: 'Group 4', completed: 15, total: 17 },
  { id: '5', name: 'leerpad 5', group: 'Group 5', completed: 10, total: 11 },
];

function ClassStudentDetails() {
  const { id, studentId } = useParams<{ id: string; studentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 800 }, p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/class/${classData.id}`)}
          sx={{ mb: 3 }}
        >
          {t('back')}
        </Button>

        <Typography variant="h4" gutterBottom>
          Leerling {studentId}
        </Typography>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          {t('assignments')}
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>{t('name')}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t('progress')}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t('score')}</strong>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLearningPaths.map((lp) => {
                const progress = (lp.completed / lp.total) * 100;

                return (
                  <TableRow key={lp.id}>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'blue',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={() => navigate(AppRoutes.learningPath(lp.id))}
                      >
                        {lp.name} {'(' + lp.group + ')'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </TableCell>
                    <TableCell>{`${lp.completed}/${lp.total}`}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => alert(`Details of ${lp.name}`)}>
                        {t('details')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default ClassStudentDetails;
