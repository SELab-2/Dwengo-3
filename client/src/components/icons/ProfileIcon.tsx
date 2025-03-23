import { AccountCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ComponentSize } from '../../util/size';

function ProfileIcon() {
  return (
    <a href="/profile">
      <Box
        sx={{
          width: ComponentSize.xlarge,
          height: ComponentSize.xlarge,
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
