import { Box, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import CustomTextField from '../components/textfields/CustomTextField';
import { useTranslation } from 'react-i18next';
import { useCreateClass } from '../hooks/useClass';
import { ClassDetail } from '../util/types/class.types';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../util/app.routes';
import { useError } from '../hooks/useError';

function ClassCreatePage() {
  const [className, setClassName] = useState('');
  const { t } = useTranslation();
  const classMutation = useCreateClass();
  const navigate = useNavigate();
  const { setError } = useError();

  const handleSubmit = () => {
    classMutation.mutate(className, {
      onSuccess: (response: ClassDetail) => {
        // Redirect to the class page
        navigate(AppRoutes.class(response.id));
      },
      onError: (error: Error) => {
        // Show error message in snackbar
        setError(error.message);
      },
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {t('fillInRequired')}
          </Typography>
          <CustomTextField value={className} setValue={setClassName} translation={t('className')} />
        </Box>

        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 'normal',
          }}
          onClick={handleSubmit}
        >
          Klasgroep aanmaken
        </Button>
      </Box>
    </Paper>
  );
}

export default ClassCreatePage;
