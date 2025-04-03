import { 
  Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '../util/routes';
import ClassNavigationBar from '../components/ClassNavigationBar';

const learningPaths = [
  { name: "leerpad 1", progress: 40 },
  { name: "leerpad 2", progress: 70 },
  { name: "leerpad 3", progress: 50 },
  { name: "leerpad 4", progress: 80 },
  { name: "leerpad 5", progress: 60 },
  { name: "leerpad 6", progress: 30 },
  { name: "leerpad 7", progress: 90 },
  { name: "leerpad 8", progress: 50 },
  { name: "leerpad 9", progress: 20 },
  { name: "leerpad 10", progress: 10 },
];

function ClassAssignmentsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={id!} className="Class Name" />

      <Box sx={{ mx: "auto", width: "100%", maxWidth: { xs: "90%", sm: 800}, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('assignments')}
        </Typography>

        {/* 📌 Responsive Table Wrapper */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2, 
            maxHeight: 450, 
            overflow: "auto", 
            boxShadow: 3,
            mx: "auto",
            width: "100%",
            maxWidth: { xs: "90%", sm: 800 },
            overflowX: "auto",  // 🚀 Horizontal Scroll on Small Screens
          }}
        >
          <Table sx={{ minWidth: 600 }}> {/* 📌 Ensuring Minimum Width */}
            <TableHead>
              <TableRow 
                sx={{ 
                  position: "sticky", top: 0, zIndex: 1, 
                  backgroundColor: "white", 
                  borderBottom: "2px solid #ddd" 
                }}
              >
                <TableCell sx={{ minWidth: 180, width: '50%' }}>
                  <Typography variant="h6">{t('learningPath')}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200, width: '50%' }}>
                  <Typography variant="h6">{t('numberOfTeamsSolved')}</Typography>
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>

            <TableBody>
              {learningPaths.map((path, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ 
                      cursor: "pointer", 
                      fontSize: { xs: "14px", sm: "16px" } 
                    }}>
                      {path.name}
                    </Typography>
                  </TableCell>

                  {/* 🔵 Responsive Progress Bar */}
                  <TableCell sx={{ width: "50%" }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={path.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        minWidth: { xs: "80px", sm: "150px", md: "200px" } 
                      }} 
                    />
                  </TableCell>

                  {/* 🟢 Responsive Button */}
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button 
                      variant="contained" 
                      sx={{
                        fontSize: { xs: "12px", sm: "14px" }, 
                        padding: { xs: "5px 10px", sm: "8px 16px" }, 
                        minWidth: { xs: "60px", sm: "100px" }
                      }}
                      onClick={() => navigate(AppRoutes.classAssignment(id!, '1'))} //TODO assignment id
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button 
            variant="contained" 
            sx={{ 
              width: { xs: "100%", sm: "40%" } // 📱 Full width on mobile, 40% on larger screens
            }}
            onClick={() => navigate(AppRoutes.classAssignmentCreate(id!))}
          >
            {t('newAssignment')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ClassAssignmentsPage;
