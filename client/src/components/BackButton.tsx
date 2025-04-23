import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BackButton({ link }: { link: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(link)}
      sx={{ mb: 2 }}
    >
      {t('back')}
    </Button>
  );
}

export default BackButton;
