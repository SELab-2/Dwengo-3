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
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { AppRoutes } from '../util/app.routes';

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

const assignments = [
  {
    id: 1,
    learningPath: {
      id: '1',
      title: 'Leerpad 1',
      description: 'Dit is een beschrijving van leerpad 1.',
      image: 'https://via.placeholder.com/150',
      learningPathNodes: [
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
      ],
    },
  },
  {
    id: 1,
    learningPath: {
      id: '1',
      title: 'Leerpad 2',
      description: 'Dit is een beschrijving van leerpad 1.',
      image: 'https://via.placeholder.com/150',
      learningPathNodes: [
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
        {
          learningObject: {
            targetAges: [6, 7],
            keywords: ['Math', 'Science'],
          },
        },
      ],
    },
  },
];

function ClassAssignmentsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 800 }, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('assignments')}
        </Typography>

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
            maxWidth: { xs: '90%', sm: 800 },
            overflowX: 'auto', // 🚀 Horizontal Scroll on Small Screens
          }}
        >
          <Table sx={{ minWidth: 600 }}>
            {' '}
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

                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '5px 10px', sm: '8px 16px' },
                        minWidth: { xs: '60px', sm: '100px' },
                      }}
                      onClick={() => navigate(AppRoutes.classAssignment(classData.id, '1'))} //TODO assignment id
                    >
                      {t('details')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🛠 New Assignment Button - Fully Responsive */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              width: { xs: '100%', sm: '40%' }, // 📱 Full width on mobile, 40% on larger screens
            }}
            onClick={() => navigate(AppRoutes.classAssignmentCreate(classData.id))}
          >
            {t('newAssignment')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ClassAssignmentsPage;
