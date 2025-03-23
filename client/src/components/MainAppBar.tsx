import { useLocation } from 'react-router-dom';
import { LoginAppBar } from './LoginAppBar';
import { AppBar, Box, Toolbar } from '@mui/material';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';
import ProfileIcon from './icons/ProfileIcon';
import { ComponentSize } from '../util/size';

function MainAppBar() {
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) {
    return <LoginAppBar />;
  }

  return (
    <AppBar position="static" sx={{ height: ComponentSize.medium }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <DwengoIcon href="/" />
        <Box
          sx={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LanguageSwitcher />
          <ProfileIcon />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default MainAppBar;
