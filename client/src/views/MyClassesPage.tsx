import { Box, Button, Grid2, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useClass } from '../hooks/useClass';
import { useTranslation } from 'react-i18next';

function MyClassesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

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
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        mt: MarginSize.large,
      }}
    >
      <Typography variant="h4">My Classes of {user?.name ?? 'Nobody'}</Typography>
      {/* Grid containing the classes of the current user*/}
      <Grid2 container spacing={3}></Grid2>
      {user?.teacher && <Button>{t('createClass')}</Button>}
    </Box>
  );
}

export default MyClassesPage;
