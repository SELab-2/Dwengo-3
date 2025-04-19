import { Box, Paper, Stack, Typography } from '@mui/material';
import ClassNavigationBar from '../components/ClassNavigationBar';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import DiscussionCard from '../components/DiscussionCard';

const DiscussionData = [
  {
    id: '1',
  },
  {
    id: '2',
  },
  {
    id: '3',
  },
  {
    id: '4',
  },
  {
    id: '5',
  },
];

const classData = {
  id: '1',
  name: 'Klas - 6 AIT',
  teachers: ['Marnie Garcia', 'Marvin Kline'],
  notes:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
};

function DiscussionsPage() {
  const { t } = useTranslation();
  const discussionsList = useMemo(() => DiscussionData, []);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <ClassNavigationBar id={classData.id} className={classData.name} />
      <Paper
        sx={{
          p: 2,
          maxWidth: { xs: '90%', sm: 800 }, // Responsive width
          width: '100%',
          mx: 'auto',
          mt: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {t('discussions')}
        </Typography>
        <Box
          sx={{
            maxHeight: { xs: 475, sm: 800 }, // Adjust height for mobile
            overflowY: 'auto',
            px: { xs: 1, sm: 2 }, // Add padding on mobile for better spacing
          }}
        >
          <Stack spacing={2}>
            {discussionsList.map((discussion) => (
              <DiscussionCard key={discussion.id} {...discussion} />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
export default DiscussionsPage;
