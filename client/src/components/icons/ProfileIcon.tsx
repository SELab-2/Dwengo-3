import { AccountCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
import { IconSize } from '../../util/size';

function ProfileIcon() {
  return (
    <a href="/profile">
      <Box
        sx={{
          width: IconSize.large,
          height: IconSize.large,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AccountCircle
          color="secondary"
          fontSize="large"
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </a>
  );
}

export default ProfileIcon;
