import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ClassNavigationBar from '../components/ClassNavigationBar.tsx';
import { Add } from '@mui/icons-material';
import { useParams, useLocation } from 'react-router-dom';
import { useClassById } from '../hooks/useClass.ts';
import { MarginSize } from '../util/size.ts';
import DiscussionListCard from '../components/DiscussionListCard.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces.ts';
import { AppRoutes } from '../util/app.routes.ts';
import { useAssignments } from '../hooks/useAssignment.ts';
import { useEffect, useRef } from 'react';

function DiscussionsPage() {
  const { classId } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const { data: classData, isLoading } = useClassById(classId ? classId : '');

  const { data: paginatedAssignments, isLoading: isLoadingAssignments } = useAssignments({
    classId: classId,
    studentId: user?.student?.id,
    teacherId: user?.teacher?.id,
  });
  const { data: assignments } = paginatedAssignments || { data: [] };

  // Refs for each assignment card
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll location hash for a discussion from groupId for assignment with assignmentId
  let hashAssignmentId: string | undefined = undefined;
  let hashGroupId: string | undefined = undefined;

  // If the location hash is set, parse it to get the assignmentId and groupId
  if (location.hash.startsWith('#')) {
    const hash = location.hash.substring(1);
    const [assignmentId, groupId] = hash.split(':');
    if (assignmentId) hashAssignmentId = assignmentId;
    if (groupId) hashGroupId = groupId;
  }

  // Scroll to the correct discussion in the correct assignment card if the scroll location hash is set
  useEffect(() => {
    if (hashAssignmentId) {
      const el = cardRefs.current[hashAssignmentId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash, assignments]);

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
        {isLoadingAssignments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : assignments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('noDiscussionsFound')}
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                id={assignment.id}
                ref={(el) => (cardRefs.current[assignment.id] = el)}
              >
                <DiscussionListCard
                  assignment={assignment}
                  expandedGroupId={assignment.id === hashAssignmentId ? hashGroupId : undefined}
                />
              </div>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default DiscussionsPage;
