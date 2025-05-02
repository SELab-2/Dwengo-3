import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { AppRoutes } from '../util/app.routes';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function TeacherAssignmentsTable({
  assignments,
  classId,
}: {
  assignments: AssignmentShort2[];
  classId: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      {/* 📌 Responsive Table Wrapper */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          maxHeight: 450,
          overflow: 'auto',
          boxShadow: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: { xs: '100%', sm: 800 },
          overflowX: 'auto', // 🚀 Horizontal Scroll on Small Screens
        }}
      >
        <Table sx={{ minWidth: '100%' }}>
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
              <TableCell sx={{ minWidth: 180, width: '50%' }}>
                <Typography variant="h6">{t('learningPath')}</Typography>
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
                <TableCell align="right">
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: { xs: '12px', sm: '14px' },
                      padding: { xs: '5px 10px', sm: '8px 16px' },
                      minWidth: { xs: '60px', sm: '100px' },
                    }}
                    onClick={() => navigate(AppRoutes.classAssignment(classId, assignment.id))}
                  >
                    {t('details')}
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

export default TeacherAssignmentsTable;
