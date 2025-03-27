import { Box, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';

function MyLearningPathsPage() {
  const { user } = useAuth();
  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">Learning Paths of {user?.name ?? 'Nobody'}</Typography>
    </Box>
  );
}

export default MyLearningPathsPage;
