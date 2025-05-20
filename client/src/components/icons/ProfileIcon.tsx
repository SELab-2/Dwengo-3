import { AccountCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
import { IconSize } from '../../util/size';
import { AppRoutes } from '../../util/app.routes';

function ProfileIcon() {
  return (
    <a href={AppRoutes.profile}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AccountCircle
          color="secondary"
          fontSize="large"
          sx={{
            fontSize: { xs: IconSize.small, sm: IconSize.medium, md: IconSize.large }, // Responsive icon size
          }}
        />
      </Box>
    </a>
  );
}

export default ProfileIcon;
