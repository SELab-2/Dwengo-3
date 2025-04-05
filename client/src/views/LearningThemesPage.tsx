import { Box, Typography, Card, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/routes';

// TODO: Get data from endpoint
const learningThemes = [
  {
    title: 'AI in Climate',
    image:
      'https://www.cryptopolitan.com/wp-content/uploads/2024/01/photo_5823672334651866888_y.jpg',
  },
  {
    title: 'Social Robot',
    image:
      'https://www.laingbuissonnews.com/wp-content/uploads/sites/3/2023/06/Moxie_Lifestyle_HP_M.jpg',
  },
  {
    title: 'AI in Healthcare',
    image:
      'https://www.usnews.com/cmsmedia/e7/92/b354714945c697881b3207311271/h18-b-f2-ai-editorial.jpg',
  },
  {
    title: 'Language Technology',
    image: 'https://miro.medium.com/v2/resize:fit:1018/1*tjyq7DrWkcK_rgym6YJ1Pw.png',
  },
];

function LearningThemesPage() {
  const navigate = useNavigate();

  const handleThemeClick = (themeTitle: string) => {
    navigate(`${encodeURI(AppRoutes.learningTheme(themeTitle))}`);
  };

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
        {learningThemes.map(({ title, image }) => (
          <Card
            key={title}
            onClick={() => handleThemeClick(title)}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: 4,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
            }}
          >
            {/* Theme Image */}
            <Avatar
              src={image}
              variant="square"
              sx={{ width: '100%', height: 180, objectFit: 'cover' }}
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
