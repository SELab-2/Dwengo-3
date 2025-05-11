import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  LinearProgress,
  Button,
  Box,
} from '@mui/material';
import { t } from 'i18next';
import DateTypography from './DateTypography';
import GroupListDialog from './GroupListDialog';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { useState } from 'react';
import { StudentShort } from '../util/interfaces/student.interfaces';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';

const calculateProgress = (
  progress: number[],
  learningPath: any /* TODO add type when interface is correct*/,
) => {
  const total_nodes = learningPath.learningPathNodes.length;
  // + 1 is added because of zero indexing
  return progress.length > 0 ? ((Math.max(...progress) + 1) / total_nodes) * 100 : 0;
};

function StudentAssignmentsTable({ assignments }: { assignments: AssignmentShort2[] }) {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentShort[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box>
      {/* 📌 Group List Dialog */}
      <GroupListDialog students={students} open={open} onClose={() => setOpen(false)} />

      {/* 📌 Responsive Table Wrapper */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          //minHeight: 450,
          maxHeight: 450,
          overflow: 'auto',
          boxShadow: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '90%', sm: 1200 },
          overflowX: 'auto', // 🚀 Horizontal Scroll on Small Screens
        }}
      >
        <Table sx={{ minWidth: 600 }}>
          {/* 📌 Ensuring Minimum Width */}
          <TableHead>
            <TableRow
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'white',
                borderBottom: '2px solid #ddd',
              }}
            >
              <TableCell sx={{ minWidth: 100, width: '25%' }}>
                <Typography variant="h6">{t('learningPath')}</Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 360, width: '25%' }}>
                <Typography variant="h6">{t('progression')}</Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 100, width: '25%' }}>
                <Typography variant="h6">{t('group')}</Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 180, width: '25%' }}>
                <Typography variant="h6">{t('deadline')}</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      fontSize: { xs: '14px', sm: '16px' },
                    }}
                  >
                    {assignment.learningPath.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(
                      assignment.groups[0].progress,
                      assignment.learningPath,
                    )}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      minWidth: { xs: '80px', sm: '150px', md: '200px' },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      fontSize: { xs: '14px', sm: '16px' },
                    }}
                    onClick={() => {
                      setStudents(assignment.groups[0].students);
                      setOpen(true);
                    }}
                  >
                    {assignment.groups[0].name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {
                    assignment.deadline ? (
                    <DateTypography date={new Date(assignment.deadline!)} />
                    ) : (
                    <Typography variant="body2" color="text.secondary">
                      /
                    </Typography>
                    )
                  }
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px' },
                      padding: { xs: '5px 10px', sm: '8px 16px' },
                      minWidth: { xs: '60px', sm: '160px' },
                    }}
                    onClick={() => navigate(AppRoutes.learningPath(assignment.learningPath.id, assignment.groups[0].id))}
                  >
                    {t('continue')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StudentAssignmentsTable;
