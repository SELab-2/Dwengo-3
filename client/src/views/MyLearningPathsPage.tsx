import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useAssignments } from '../hooks/useAssignment';
import LearningPathCard from '../components/learningPathCard';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '../hooks/useFavorite';
import { AppRoutes } from '../util/app.routes';
import { AssignmentShort2 } from '../util/interfaces/assignment.interfaces';
import { myGroup } from '../util/helpers/group.helpers';

function MyLearningPathsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: paginatedAssignments } = useAssignments({
    studentId: user?.student?.id,
    teacherId: user?.teacher?.id,
  });

  const { data: paginatedFavorites } = useFavorite(user?.id);

  const assignments = paginatedAssignments?.data ?? [];
  const favorites = paginatedFavorites?.data ?? [];

  const handleClick = (_: React.MouseEvent<HTMLElement>, assignment: AssignmentShort2) => {
    if (user?.student) {
      navigate(
        AppRoutes.learningPath(assignment.learningPath.id, myGroup(assignment, user?.id)?.id),
      );
    } else {
      navigate(AppRoutes.classAssignment(assignment.class.id, assignment.id));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 800, mx: 'auto', m: 4 }}>
      <Box key={'assignments'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('assignments')}
        </Typography>
        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <Box
              key={assignment.id}
              onClick={isMobile ? (event) => handleClick(event, assignment) : undefined}
            >
              <LearningPathCard
                assignment={assignment}
                userId={user?.id}
                visualizeProgress={false}
                actionButtons={
                  !isMobile &&
                  (user?.student ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(
                          AppRoutes.learningPath(
                            assignment.learningPath.id,
                            myGroup(assignment, user?.id)?.id,
                          ),
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
                  ))
                }
              />
            </Box>
          ))}
        </Stack>
      </Box>
      <Box key={'favorites'} sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          {t('favorites')}
        </Typography>
        <Stack spacing={2}>
          {favorites.map((favorite) => (
            <Box
              key={favorite.id}
              onClick={
                isMobile
                  ? (_) =>
                      navigate(
                        AppRoutes.learningPath(favorite.learningPath.id, undefined, favorite.id),
                      )
                  : undefined
              }
            >
              <LearningPathCard
                favorite={favorite}
                visualizeProgress={false}
                actionButtons={
                  !isMobile && (
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
                  )
                }
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default MyLearningPathsPage;
