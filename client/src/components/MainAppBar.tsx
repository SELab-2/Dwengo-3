import { useLocation } from 'react-router-dom';
import { LoginAppBar } from './LoginAppBar';
import { AppBar, Box, Tab, Tabs, Toolbar } from '@mui/material';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';
import ProfileIcon from './icons/ProfileIcon';
import { ComponentSize, FontSize } from '../util/size';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AppRoutes } from '../util/app.routes';

const TabIndex: { [key: string]: number } = {
  [AppRoutes.learningThemes]: 0,
  [AppRoutes.myClasses]: 1,
  [AppRoutes.myLearningPaths]: 2,
};

function MainAppBar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(TabIndex[location.pathname] ?? false);

  if ([AppRoutes.login, AppRoutes.register].includes(location.pathname)) {
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
        <DwengoIcon href={AppRoutes.home} />
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
              href={AppRoutes.learningThemes}
              sx={{ fontSize: FontSize.large }}
            />
            <Tab
              label={t('myClasses')}
              href={AppRoutes.myClasses}
              sx={{ fontSize: FontSize.large }}
            />
            <Tab
              label={t('myLearningPaths')}
              href={AppRoutes.myLearningPaths}
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
