import { AppBar, Toolbar, Box } from '@mui/material';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';
import { ComponentSize } from '../util/size';

function LoginAppBar() {
  return (
    <AppBar position="static" sx={{ height: ComponentSize.medium }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <DwengoIcon href="/login" />
        <Box sx={{ marginLeft: 'auto' }}>
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export { LoginAppBar };
