import { useLocation } from 'react-router-dom';
import { LoginAppBar } from './LoginAppBar';
import { AppBar, Box, Tab, Tabs, Toolbar } from '@mui/material';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';
import ProfileIcon from './icons/ProfileIcon';
import { ComponentSize, FontSize } from '../util/size';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const TabIndex: { [key: string]: number } = {
  '/learning-themes': 0,
  '/classes': 1,
  '/learning-paths': 2,
};

function MainAppBar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(
    TabIndex[location.pathname] ?? false,
  );

  if (['/login', '/register'].includes(location.pathname)) {
    return <LoginAppBar />;
  }

  return (
    <AppBar position="static" sx={{ height: ComponentSize.medium }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          height: '100%',
        }}
      >
        <DwengoIcon href="/" />
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
            textColor="inherit"
            role="navigation"
          >
            <Tab
              label={t('learningThemes')}
              href="/learning-themes"
              sx={{ fontSize: FontSize.large }}
            />
            <Tab
              label={t('myClasses')}
              href="/classes"
              sx={{ fontSize: FontSize.large }}
            />
            <Tab
              label={t('myLearningPaths')}
              href="/learning-paths"
              sx={{ fontSize: FontSize.large }}
            />
          </Tabs>
        </Box>
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
