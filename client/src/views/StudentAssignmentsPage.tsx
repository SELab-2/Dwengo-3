import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ClassNavigationBar from "../components/ClassNavigationBar";
import { useState } from "react";
import { StudentShort } from "../util/interfaces/student.interfaces";
import DateTypography from "../components/DateTypography";
import GroupListDialog from "../components/GroupListDialog";
import { AssignmentDetail } from "../util/interfaces/assignment.interfaces";


//TODO: remove this mock data and replace it with a call to the backend and add deadline to the backend and frontend
const assignments: AssignmentDetail[] = [
    {
      id: '1',
      //deadline: new Date(),
      groups: [
        {
            id: '1',
            assignmentId: '1',
            name: 'Groep 1',
            progress: [0, 1, 2],
            students: [
              { user: {name: 'Liam', surname: 'Janssen'}, id: '1' },
              { user: {name: 'Emma', surname: 'Vermeulen'}, id: '2' },
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
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
        ],
      },
      class: {
        id: '1',
        name: 'Klas 1',
      },
      teacherId: '1',
    },
    {
      id: '2',
      //deadline: new Date(),
      groups: [
        {
            id: '2',
            assignmentId: '2',
            name: 'Groep 1',
            progress: [0, 1, 2],
            students: [
              { user: {name: 'Liam', surname: 'Janssen'}, id: '1' },
              { user: {name: 'Emma', surname: 'Vermeulen'}, id: '2' },
            ],
          },
      ],
      learningPath: {
        id: '1',
        title: 'Leerpad 2',
        description: 'Dit is een beschrijving van leerpad 1.',
        image: 'https://via.placeholder.com/150',
        learningPathNodes: [
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
          {
            learningObject: {
              targetAges: [6, 7],
              keywords: [{keyword: 'Math'}, {keyword: 'Science'}],
            },
          },
        ],
      },
      class: {
        id: '1',
        name: 'Klas 1',
      },
      teacherId: '1',
    },
  ];

const calculateProgress = (
    progress: number[],
    learningPath: any /* TODO add type when interface is correct*/,
) => {
    const total_nodes = learningPath.learningPathNodes.length;
    // + 1 is added because of zero indexing
    return ((Math.max(...progress) + 1) / total_nodes) * 100;
};

function StudentAssignmentsPage() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    
    const [students, setStudents] = useState<StudentShort[]>([]);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Box sx={{ minHeight: '100vh', p: 3 }}>
          <ClassNavigationBar id={id!} className="Class Name" />
    
          <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: 1200 }, p: 2 }}>
            <Typography variant="h4" gutterBottom>
              {t('assignments')}
            </Typography>

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
                            value={calculateProgress(assignment.groups[0].progress, assignment.learningPath)}
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
                            {/*<DateTypography date={assignment.deadline} />*/}
                            <DateTypography date={new Date()} />
                        </TableCell>

    
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          sx={{
                            fontSize: { xs: '12px', sm: '14px' },
                            padding: { xs: '5px 10px', sm: '8px 16px' },
                            minWidth: { xs: '60px', sm: '160px' },
                          }}
                          onClick={() => alert('TODO')}
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
        </Box>
      );
}

export default StudentAssignmentsPage;