import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useTranslation } from 'react-i18next';
import DateTypography from '../components/DateTypography';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import GroupListDialog from '../components/GroupListDialog';
import { useState } from 'react';

const assignment = {
  name: "Opdracht 1",
  teacher: {
    name: "leerkracht",
    surname: "1"
  },
  deadline: new Date(),
  groups: [
    { 
      name: "Groep 1", 
      progress: 10, 
      submission: true, 
      students: [
        { name: "Liam", surname: "Janssen" },
        { name: "Emma", surname: "Vermeulen" }
      ]
    },
    { 
      name: "Groep 2", 
      progress: 45, 
      submission: false, 
      students: [
        { name: "Noah", surname: "Peeters" },
        { name: "Sophie", surname: "De Vries" }
      ]
    },
    { 
      name: "Groep 3", 
      progress: 75, 
      submission: true, 
      students: [
        { name: "Lucas", surname: "Maes" },
        { name: "Olivia", surname: "Van den Berg" }
      ]
    },
    { 
      name: "Groep 4", 
      progress: 20, 
      submission: false, 
      students: [
        { name: "Daan", surname: "Hendriks" },
        { name: "Julie", surname: "Smeets" }
      ]
    },
    { 
      name: "Groep 5", 
      progress: 90, 
      submission: true, 
      students: [
        { name: "Finn", surname: "Willems" },
        { name: "Lotte", surname: "Claes" }
      ]
    },
    { 
      name: "Groep 6", 
      progress: 50, 
      submission: false, 
      students: [
        { name: "Milan", surname: "Jacobs" },
        { name: "Elise", surname: "Coppens" }
      ]
    },
    { 
      name: "Groep 7", 
      progress: 30, 
      submission: true, 
      students: [
        { name: "Ruben", surname: "Goossens" },
        { name: "Laura", surname: "Baert" }
      ]
    },
    { 
      name: "Groep 8", 
      progress: 60, 
      submission: false, 
      students: [
        { name: "Vince", surname: "Mertens" },
        { name: "Sanne", surname: "Van Dijk" }
      ]
    },
    { 
      name: "Groep 9", 
      progress: 80, 
      submission: true, 
      students: [
        { name: "Jens", surname: "Lemmens" },
        { name: "Eva", surname: "De Bruin" }
      ]
    },
    { 
      name: "Groep 10", 
      progress: 5, 
      submission: false, 
      students: [
        { name: "Timo", surname: "Van Acker" },
        { name: "Nina", surname: "Bosmans" }
      ]
    },
    { 
      name: "Groep 11", 
      progress: 95, 
      submission: true, 
      students: [
        { name: "Stijn", surname: "Segers" },
        { name: "Jade", surname: "De Smet" }
      ]
    },
    { 
      name: "Groep 12", 
      progress: 40, 
      submission: false, 
      students: [
        { name: "Matthias", surname: "Vandersteen" },
        { name: "Eline", surname: "Pauwels" }
      ]
    },
    { 
      name: "Groep 13", 
      progress: 70, 
      submission: true, 
      students: [
        { name: "Nathan", surname: "Hoogland" },
        { name: "Zoë", surname: "De Ruyter" }
      ]
    },
    { 
      name: "Groep 14", 
      progress: 15, 
      submission: false, 
      students: [
        { name: "Tobias", surname: "Coenen" },
        { name: "Fien", surname: "De Koninck" }
      ]
    },
    { 
      name: "Groep 15", 
      progress: 85, 
      submission: true, 
      students: [
        { name: "Wout", surname: "Dewulf" },
        { name: "Hanne", surname: "Michiels" }
      ]
    }
  ]
}

function ClassAssignmentPage() {
  const { id, a_id } = useParams<{ id: string; a_id: string }>();
  const { t } = useTranslation();

  const [ students, setStudents] = useState<{ name: string, surname: string }[]>([]);
  const [ open, setOpen] = useState<boolean>(false);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={id!} className="Class Name" />

      <Box sx={{ mx: "auto", width: "100%", maxWidth: { xs: "90%", sm: 1000}, p: 2 }}>
        <Typography variant="h3" gutterBottom>
          {assignment.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {`${t('givenBy')}: ${assignment.teacher.name} ${assignment.teacher.surname}`}
        </Typography>
        <DateTypography text={`${t('deadline')}: `} date={assignment.deadline}/>

        <GroupListDialog students={students} open={open} onClose={() => setOpen(false)}/>

        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2, 
            maxHeight: 450, 
            overflow: "auto", 
            boxShadow: 3,
            mx: "auto",
            width: "100%",
            maxWidth: { xs: "90%", sm: 1000 },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow 
                sx={{ 
                  position: "sticky", top: 0, zIndex: 1, 
                  backgroundColor: "white", 
                  borderBottom: "2px solid #ddd" 
                }}
              >
                <TableCell sx={{ minWidth: 180, width: '50%' }}>
                  <Typography variant="h6">{t('name')}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200, width: '50%' }}>
                  <Typography variant="h6">{t('progression')}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200, width: '50%' }}>
                  <Typography variant="h6">{t('submission')}</Typography>
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>

            <TableBody>
              {assignment.groups.map((group, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography 
                    sx={{ 
                      cursor: "pointer", 
                      fontSize: { xs: "14px", sm: "16px" } 
                    }}
                    onClick={() => {
                      setStudents(group.students);
                      setOpen(true)}
                    }
                    >
                      {group.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <LinearProgress 
                      variant="determinate" 
                      value={group.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        minWidth: { xs: "80px", sm: "150px", md: "200px" } 
                      }} 
                    />
                  </TableCell>

                  <TableCell >
                    {group.submission ? <CheckIcon color="primary" /> : <ClearIcon color="error" />}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Button 
                      variant="contained" 
                      sx={{
                        fontSize: { xs: "12px", sm: "14px" }, 
                        padding: { xs: "5px 10px", sm: "8px 16px" }, 
                        minWidth: { xs: "60px", sm: "100px" }
                      }}
                      onClick={() => alert("TODO")}
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
