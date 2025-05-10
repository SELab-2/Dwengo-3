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
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { AppRoutes } from '../util/app.routes.ts';
import { useClassById } from '../hooks/useClass.ts';
import { useAssignmentsOfStudent } from '../hooks/useAssignment.ts';
import BackButton from '../components/BackButton.tsx';

function ClassStudentDetails() {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();

  const { data: classData } = useClassById(classId!);
  const studentData = classData?.students.find((student) => student.id === studentId);
  const { data: assignments } = useAssignmentsOfStudent(studentId!);

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classId!} className={classData?.name} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%' }, p: 2 }}>
        <BackButton link={AppRoutes.class(classId!)}></BackButton>

        <Typography variant="h4" gutterBottom>
          {t('student')}: {studentData?.user.name} {studentData?.user.surname}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">
                    <strong>{t('group')}</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    <strong>{t('learningPath')}</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    <strong>{t('progress')}</strong>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    <strong>{t('score')}</strong>
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments?.data.map((assignment) => {
                const total = assignment.learningPath.learningPathNodes.length;
                let completed = 0;
                let progress = 0;

                if (assignment.groups[0].progress.length > 0) {
                  completed =
                    assignment.groups[0].progress[assignment.groups[0].progress.length - 1] + 1;
                  progress = (completed / total) * 100;
                }

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'blue',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={() => navigate(AppRoutes.learningPath(assignment.learningPath.id))}
                      >
                        {assignment.groups[0].name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: 'blue',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={() =>
                          navigate(
                            AppRoutes.learningPath(
                              assignment.learningPath.id,
                              assignment.groups[0].id,
                            ),
                          )
                        }
                      >
                        {assignment.learningPath.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </TableCell>
                    <TableCell>{`${completed}/${total}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => alert(`Submission details of the assignment`)}
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
      </Box>
    </Box>
  );
}

export default ClassStudentDetails;
