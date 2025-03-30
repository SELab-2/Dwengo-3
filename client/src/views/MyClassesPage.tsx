import { Box, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useClass } from '../hooks/useClass';

function MyClassesPage() {
  const { user } = useAuth();

  let classes;

  if (user?.student) {
    classes = useClass(user?.student.id, undefined).data;
  } else {
    classes = useClass(undefined, user?.teacher?.id).data;
  }

  console.log(classes);

  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">My Classes of {user?.name ?? 'Nobody'}</Typography>

      {/* Grid containing the classes of the current user*/}
      <Grid2 container spacing={3}></Grid2>
    </Box>
  );
}

export default MyClassesPage;
