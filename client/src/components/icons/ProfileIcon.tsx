import { AccountCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
import { IconSize } from '../../util/size';

function ProfileIcon() {
  return (
    <a href="/profile">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AccountCircle color="secondary" fontSize="large" />
      </Box>
    </a>
  );
}

export default ProfileIcon;
