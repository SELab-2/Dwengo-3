import { useLocation } from 'react-router-dom';
import { LoginAppBar } from './LoginAppBar';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Toolbar,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitcher from './icons/LanguageIcon';
import DwengoIcon from './icons/DwengoIcon';
import ProfileIcon from './icons/ProfileIcon';
import { FontSize, IconSize } from '../util/size';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  if ([AppRoutes.login, AppRoutes.register].includes(location.pathname)) {
    return <LoginAppBar />;
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Logo */}
        <DwengoIcon href={AppRoutes.home} />

        {/* Tabs for larger screens */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            justifyContent: 'center',
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

        {/* Language, Profile Icons, and Burger Menu */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <IconButton
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: 'flex', md: 'none' }, // Show only on small screens
              p: 0, // Remove extra padding
              alignItems: 'center', // Center the icon vertically
              justifyContent: 'center', // Center the icon horizontally
            }}
          >
            <MenuIcon
              sx={{
                color: theme.palette.secondary.main,
                fontSize: { xs: IconSize.small, sm: IconSize.medium, md: IconSize.large },
              }}
            />
          </IconButton>
          <LanguageSwitcher />
          <ProfileIcon />
        </Box>
      </Toolbar>

      {/* Drawer for the burger menu */}
      <Drawer
        anchor="right" // Open the Drawer from the right side
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: '250px', // Set a fixed width for the Drawer
            height: '100%', // Make the Drawer take up the full height of the screen
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            alignItems: 'flex-start', // Align items to the left inside the Drawer
            padding: 2, // Add padding inside the Drawer
          },
        }}
      >
        <List sx={{ width: '100%' }}>
          <ListItem disablePadding>
            <ListItemButton component="a" href={AppRoutes.learningThemes}>
              <ListItemText primary={t('learningThemes')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href={AppRoutes.myClasses}>
              <ListItemText primary={t('myClasses')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href={AppRoutes.myLearningPaths}>
              <ListItemText primary={t('myLearningPaths')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}

export default MainAppBar;
