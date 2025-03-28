import { Box, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';

function LearningThemesPage() {
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
      <Typography variant="h4">Learning themes of {user?.name ?? 'Nobody'}</Typography>
    </Box>
  );
}

export default LearningThemesPage;
