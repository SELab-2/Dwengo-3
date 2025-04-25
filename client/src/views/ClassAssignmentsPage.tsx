import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { AppRoutes } from '../util/app.routes';
import { useAuth } from '../hooks/useAuth';
import { useClassById } from '../hooks/useClass';
import { MarginSize } from '../util/size';
import { useAssignments } from '../hooks/useAssignment';
import TeacherAssignmentsTable from '../components/TeacherAssignmentsTable';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import StudentAssignmentsTable from '../components/StudentAssignmentsTable';

function ClassAssignmentsPage() {
  const { user } = useAuth();
  const { classId } = useParams<{ classId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const teacherId = user?.teacher?.id;
  const studentId = user?.student?.id;

  const {data: classData, isLoading: isLoadingClass} = useClassById(classId!);

  const {data: paginatedData, isLoading: isLoadingAssignment} = useAssignments(classId, undefined, studentId, teacherId, 1, 10);

  const assignments: AssignmentShort2[] = paginatedData?.data ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;


  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {isLoadingClass ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
          {t('loading')}
        </Typography>
      ) : (
       <ClassNavigationBar id={classData!.id} className={classData!.name} />)}
      <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: '90%', sm: teacherId ? 800 : 1200 }, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('assignments')}
        </Typography>

        {teacherId ? (
          <Box>
            <TeacherAssignmentsTable assignments={assignments} classId={classId!} />
            {/* 🛠 New Assignment Button - Fully Responsive */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  width: { xs: '100%', sm: '40%' }, // 📱 Full width on mobile, 40% on larger screens
                }}
                onClick={() => navigate(AppRoutes.classAssignmentCreate(classId!))}
              >
                {t('newAssignment')}
              </Button>
            </Box>
          </Box>
        ) : (
          <StudentAssignmentsTable assignments={assignments} />
        )}
      </Box>
    </Box>
  );
}

export default ClassAssignmentsPage;
