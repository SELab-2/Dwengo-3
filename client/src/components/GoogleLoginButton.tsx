import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc';

function GoogleLoginButton({ onClick }: { onClick: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      startIcon={<FcGoogle />}
      onClick={onClick}
      fullWidth
      sx={{
        backgroundColor: 'white',
        color: theme.palette.text.secondary,
        border: '1px solid rgb(187, 187, 187)',
        '&:hover': {
          backgroundColor: 'rgb(244, 249, 255)',
        },
      }}
    >
      {t('loginWithGoogle')}
    </Button>
  );
}

export default GoogleLoginButton;
