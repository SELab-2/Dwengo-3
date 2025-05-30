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
import { AppRoutes } from '../util/app.routes';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DateTypography from './DateTypography';

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
                <Typography variant="h6">{t('name')}</Typography>
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
                    {assignment.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {assignment.deadline ? (
                    <DateTypography date={new Date(assignment.deadline!)} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      /
                    </Typography>
                  )}
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
