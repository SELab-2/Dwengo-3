import { AppBar, Paper, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import ForumIcon from '@mui/icons-material/Forum';
import { AppRoutes } from '../util/routes.ts';
import { useTheme } from '@mui/material/styles';

function NavigationBar({ id, className }: { id: string; className: string }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: t('dashboard'), icon: <DashboardIcon />, path: AppRoutes.class(id) },
    { label: t('assignments'), icon: <AssignmentIcon />, path: AppRoutes.classAssignments(id) },
    { label: t('announcements'), icon: <CampaignIcon />, path: AppRoutes.classAnnouncements(id) },
    { label: t('discussions'), icon: <ForumIcon />, path: AppRoutes.classDiscussions(id) },
  ];

  // Find active tab index based on URL
  const activeTab = navItems.findIndex((item) => location.pathname === item.path);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(navItems[newValue].path);
  };
  // '#4CAF50'

  return (
    <Paper elevation={3} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <AppBar position="static" sx={{ bgcolor: theme.palette.primary.main }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            {className}
          </Typography>

          <Tabs
            value={activeTab !== -1 ? activeTab : 0}
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
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavigationBar;
