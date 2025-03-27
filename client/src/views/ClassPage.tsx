import { Box, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useParams } from 'react-router-dom';

function ClassPage() {
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
      <Typography variant="h4">Class {id}</Typography>
    </Box>
  );
}

export default ClassPage;
