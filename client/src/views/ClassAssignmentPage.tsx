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
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useTranslation } from 'react-i18next';
import DateTypography from '../components/DateTypography';
import GroupListDialog from '../components/GroupListDialog';
import { useState } from 'react';
import { StudentShort } from '../util/interfaces/student.interfaces';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const assignment = {
  name: 'Opdracht 1',
  id: '1',
  teacher: {
    id: '1234',
    name: 'leerkracht',
    surname: '1',
  },
  deadline: new Date(),
  groups: [
    {
      assignmentId: '1',
      name: 'Groep 1',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Liam', surname: 'Janssen' }, id: '1' },
        { user: { name: 'Emma', surname: 'Vermeulen' }, id: '2' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 2',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Noah', surname: 'Peeters' }, id: '3' },
        { user: { name: 'Sophie', surname: 'De Vries' }, id: '4' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 3',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Lucas', surname: 'Maes' }, id: '5' },
        { user: { name: 'Olivia', surname: 'Van den Berg' }, id: '6' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 4',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Daan', surname: 'Hendriks' }, id: '7' },
        { user: { name: 'Julie', surname: 'Smeets' }, id: '8' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 5',
      progress: [0, 1],
      students: [
        { user: { name: 'Finn', surname: 'Willems' }, id: '9' },
        { user: { name: 'Lotte', surname: 'Claes' }, id: '10' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 6',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Milan', surname: 'Jacobs' }, id: '11' },
        { user: { name: 'Elise', surname: 'Coppens' }, id: '12' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 7',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Ruben', surname: 'Goossens' }, id: '13' },
        { user: { name: 'Laura', surname: 'Baert' }, id: '14' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 8',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Vince', surname: 'Mertens' }, id: '15' },
        { user: { name: 'Sanne', surname: 'Van Dijk' }, id: '16' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 9',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Jens', surname: 'Lemmens' }, id: '17' },
        { user: { name: 'Eva', surname: 'De Bruin' }, id: '18' },
      ],
    },
    {
      assignmentId: '1',
      name: 'Groep 10',
      progress: [0, 1, 2],
      students: [
        { user: { name: 'Timo', surname: 'Van Acker' }, id: '19' },
        { user: { name: 'Nina', surname: 'Bosmans' }, id: '20' },
      ],
    },
  ],
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
};

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  // ...
};

const calculateProgress = (
  progress: number[],
  learningPath: any /* TODO add type when interface is correct*/,
) => {
  const total_nodes = learningPath.learningPathNodes.length;
  // + 1 is added because of zero indexing
  return ((Math.max(...progress) + 1) / total_nodes) * 100;
};

function ClassAssignmentPage() {
  const { id, a_id } = useParams<{ id: string; a_id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentShort[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />

      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 1000 }, p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/class/${classData.id}/assignments`)}
          sx={{ mb: 2 }}
        >
          {t('back')}
        </Button>
        <Typography variant="h3" gutterBottom>
          {assignment.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {`${t('givenBy')}: ${assignment.teacher.name} ${assignment.teacher.surname}`}
        </Typography>
        <DateTypography text={`${t('deadline')}: `} date={assignment.deadline} />

        <GroupListDialog students={students} open={open} onClose={() => setOpen(false)} />

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            maxHeight: 450,
            overflow: 'auto',
            boxShadow: 3,
            mx: 'auto',
            width: '100%',
            maxWidth: { xs: '90%', sm: 1000 },
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: 600 }}>
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
                <TableCell sx={{ minWidth: 200, width: '50%' }}>
                  <Typography variant="h6">{t('progression')}</Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {assignment.groups.map((group, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: { xs: '14px', sm: '16px' },
                      }}
                      onClick={() => {
                        setStudents(group.students);
                        setOpen(true);
                      }}
                    >
                      {group.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(group.progress, assignment.learningPath)}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        minWidth: { xs: '80px', sm: '150px', md: '200px' },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        padding: { xs: '5px 10px', sm: '8px 16px' },
                        minWidth: { xs: '60px', sm: '100px' },
                      }}
                      onClick={() => alert('TODO')}
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
    </Box>
  );
}

export default ClassAssignmentPage;
