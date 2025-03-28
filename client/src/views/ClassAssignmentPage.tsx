import { Box, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useParams } from 'react-router-dom';

function ClassAssignmentPage() {
  const { id, a_id } = useParams<{ id: string; a_id: string }>();

  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">
        Class {id} detail page of Assignment {a_id}
      </Typography>
    </Box>
  );
}

export default ClassAssignmentPage;
