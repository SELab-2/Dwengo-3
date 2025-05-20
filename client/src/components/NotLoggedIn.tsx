import { Box, Button, Typography } from '@mui/material';
import { MarginSize } from '../util/size';
import { Login as LoginIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function NotLoggedIn() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        py: MarginSize.large,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {t('notLoggedIn')}
      </Typography>
      <Button startIcon={<LoginIcon />} href="/login">
        {t('login')}
      </Button>
    </Box>
  );
}

export default NotLoggedIn;
