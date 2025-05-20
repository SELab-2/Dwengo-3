import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { FcGoogle } from 'react-icons/fc';
import { ApiRoutes } from '../api/api.routes';
import { ClassRoleEnum } from '../util/interfaces/class.interfaces';

function GoogleButton({ role, label }: { role: ClassRoleEnum | null; label: string }) {
  const theme = useTheme();

  const handleClick = () => {
    // Redirect to the Google login page
    window.location.href =
      import.meta.env.VITE_API_URL +
      (role == ClassRoleEnum.STUDENT
        ? ApiRoutes.login.google.student
        : ApiRoutes.login.google.teacher);
  };

  return (
    <Button
      startIcon={<FcGoogle />}
      onClick={handleClick}
      fullWidth
      sx={{
        backgroundColor: 'white',
        color: theme.palette.text.secondary,
        border: '1px solid rgb(187, 187, 187)',
        '&:hover': {
          backgroundColor: 'rgb(244, 249, 255)',
        },
      }}
      disabled={role === null}
    >
      {label}
    </Button>
  );
}

export default GoogleButton;
