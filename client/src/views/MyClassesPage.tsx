import { Box, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import ClassGroupCard from '../components/ClassCard';
import { useTranslation } from 'react-i18next';
import { useClass } from '../hooks/useClass';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: classes } = useClass(user?.id ?? '');

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
