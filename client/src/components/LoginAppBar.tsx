import { AppBar, Toolbar, Box } from '@mui/material';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';

function LoginAppBar() {
  return (
    <AppBar position="static" sx={{ height: '80px' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <DwengoIcon href="/login" />
        <Box>
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export { LoginAppBar };
