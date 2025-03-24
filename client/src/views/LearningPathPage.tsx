import { Box, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useParams } from 'react-router-dom';

function LearningPathPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">Learning Path {id}</Typography>
    </Box>
  );
}

export default LearningPathPage;
