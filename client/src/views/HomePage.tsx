import { Box, Grid, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        margin: MarginSize.large,
        flexDirection: 'column',
        gap: MarginSize.small,
      }}
    >
      <Typography variant="h4">
        {t('welcome')} {user?.name ?? 'Nobody'}!
      </Typography>

      {/* Grid containing the closest upcoming deadlines*/}
      <Grid container spacing={3}></Grid>
    </Box>
  );
}

export default HomePage;
