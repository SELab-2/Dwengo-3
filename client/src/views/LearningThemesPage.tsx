import { Avatar, Box, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { useLearningTheme } from '../hooks/useLearningTheme';
import { useTranslation } from 'react-i18next';

function LearningThemesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: learningThemes } = useLearningTheme();

  if (!learningThemes) {
    return <div>{t('loading')}</div>;
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          justifyContent: 'center',
        }}
      >
        {learningThemes.data.map(({ id, title, image }) => (
          <Card
            key={id}
            onClick={() => navigate(AppRoutes.learningTheme(id))}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: 4,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
              bgcolor: 'primary.main',
            }}
          >
            {/* Theme Image */}
            <Avatar
              src={image}
              variant="square"
              sx={{ width: '100%', height: 210, objectFit: 'cover' }}
            />

            {/* Theme Title */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default LearningThemesPage;
