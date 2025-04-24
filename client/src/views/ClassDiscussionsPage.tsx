import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import { useAssignmentsOfClass } from '../hooks/useAssignment.ts';
import DiscussionListCard from '../components/DiscussionListCard.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces.ts';
import { AppRoutes } from '../util/app.routes.ts';

function DiscussionsPage() {
  const { classId } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: classData, isLoading } = useClassById(classId ? classId : '');
  const { data: paginatedData } = useAssignmentsOfClass(classId ? classId : '');
  const { data: assignments, totalPages } = paginatedData || { data: [], totalPages: 0 };

  return isLoading ? (
    <Typography variant="h6" sx={{ textAlign: 'center', marginTop: MarginSize.large }}>
      {t('loading')}
    </Typography>
  ) : (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData!.id} className={classData!.name} />
      <Box sx={{ m: 4 }}>
        <Box
          sx={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            {t('discussions')}
          </Typography>

          {/* A button to create a new discussion as a student */}
          {user?.role === ClassRoleEnum.STUDENT && (
            <Button
              startIcon={<Add />}
              variant="contained"
              color="primary"
              sx={{ mb: 2, textTransform: 'none' }}
              href={AppRoutes.discussionCreate(classId ? classId : '')}
            >
              {t('startDiscussion')}
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Discussions listed per assignment */}
        <Stack spacing={2} sx={{ mt: 2 }}>
          {assignments.map((assignment) => (
            <DiscussionListCard key={assignment.id} assignment={assignment} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default DiscussionsPage;
