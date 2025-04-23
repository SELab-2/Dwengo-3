import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import ForumIcon from '@mui/icons-material/Forum';
import MenuIcon from '@mui/icons-material/Menu';
import { AppRoutes } from '../util/app.routes.ts';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';

function NavigationBar({ id, className }: { id: string; className: string | undefined }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: t('dashboard'), icon: <DashboardIcon />, path: AppRoutes.class(id) },
    { label: t('assignments'), icon: <AssignmentIcon />, path: AppRoutes.classAssignments(id) },
    { label: t('announcements'), icon: <CampaignIcon />, path: AppRoutes.classAnnouncements(id) },
    { label: t('discussions'), icon: <ForumIcon />, path: AppRoutes.classDiscussions(id) },
  ];

  const activeTab = navItems.findIndex((item) => location.pathname === item.path);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(navItems[newValue].path);
  };

  // Mobile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (path: string) => {
    navigate(path);
    handleCloseMenu();
  };

  return (
    <Paper elevation={3} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            {className}
          </Typography>

          {isMobile ? (
            <>
              {/* Mobile Menu Button */}
              <IconButton color="inherit" onClick={handleOpenMenu}>
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                keepMounted
                sx={{ position: 'absolute', right: 0 }} // Fixes shifting issue
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Opens outside the toolbar
                transformOrigin={{ vertical: 'top', horizontal: 'right' }} // Prevents layout shifts
              >
                {navItems.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenuClick(item.path)}>
                    {item.icon} {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Tabs
              value={activeTab !== -1 ? activeTab : false}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ marginLeft: 'auto' }}
            >
              {navItems.map((item, index) => (
                <Tab
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  sx={{
                    textTransform: 'none',
                    minWidth: 120,
                  }}
                />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavigationBar;
