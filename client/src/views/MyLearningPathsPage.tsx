import { Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useAssignments } from '../hooks/useAssignment';
import LearningPathCard from '../components/learningPathCard';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '../hooks/useFavorite';
import { AppRoutes } from '../util/app.routes';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { GroupShort } from '../util/interfaces/group.interfaces';

function MyLearningPathsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: paginatedAssignments } = useAssignments({
    studentId: user?.student?.id,
    teacherId: user?.teacher?.id,
  });

  const { data: paginatedFavorites } = useFavorite(user?.id);

  const assignments = paginatedAssignments?.data ?? [];
  const favorites = paginatedFavorites?.data ?? [];

  const myGroup = (assignment: AssignmentShort2): GroupShort | undefined => {
    return assignment.groups.find((group) =>
      group.students.some((student) => student.userId === user?.id),
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box key={'assignments'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('assignments')}
        </Typography>
        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <LearningPathCard
              key={assignment.id}
              assignment={assignment}
              userId={user?.id}
              visualizeProgress={false}
              actionButtons={
                user?.student ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(
                        AppRoutes.learningPath(assignment.learningPath.id, myGroup(assignment)?.id),
                      );
                    }}
                  >
                    {t('continue')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(AppRoutes.classAssignment(assignment.class.id, assignment.id));
                    }}
                  >
                    {t('details')}
                  </Button>
                )
              }
            />
          ))}
        </Stack>
      </Box>
      <Box key={'favorites'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('favorites')}
        </Typography>
        <Stack spacing={2}>
          {favorites.map((favorite) => (
            <LearningPathCard
              key={favorite.id}
              favorite={favorite}
              visualizeProgress={false}
              actionButtons={
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(
                      AppRoutes.learningPath(favorite.learningPath.id, undefined, favorite.id),
                    );
                  }}
                >
                  {t('continue')}
                </Button>
              }
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default MyLearningPathsPage;
