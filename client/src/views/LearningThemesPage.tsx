import { Box, Typography, Card, Avatar } from '@mui/material';
import { MarginSize } from '../util/size';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleThemeClick = (themeTitle: string) => {
    navigate(`/learning-themes/${encodeURIComponent(themeTitle)}`);
  };

  return (
    <Box sx={{ p: MarginSize.large }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {learningThemes.map(({ title, image }) => (
          <Card
            key={title}
            sx={{ borderRadius: 2, overflow: 'hidden', width: '300px', cursor: 'pointer' }}
            onClick={() => handleThemeClick(title)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', p: 2 }}>
              <Avatar src={image} sx={{ width: 56, height: 56, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                {t(title)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default LearningThemesPage;
