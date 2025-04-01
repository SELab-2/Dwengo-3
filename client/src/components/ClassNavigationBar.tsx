import { AppBar, Button, IconButton, Paper, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import ForumIcon from '@mui/icons-material/Forum';
import { AppRoutes } from '../util/routes.ts';

function NavigationBar() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const navItems = [
    { label: t('dashboard'), icon: <DashboardIcon />, path: AppRoutes.class(id!) },
    { label: t('assignments'), icon: <AssignmentIcon />, path: AppRoutes.classAssignments(id!) },
    { label: t('announcements'), icon: <CampaignIcon />, path: AppRoutes.classAnnouncements(id!) },
    { label: t('discussions'), icon: <ForumIcon />, path: AppRoutes.classDiscussions(id!) },
  ];

  return (
    <Paper elevation={3} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
      <AppBar position="static" sx={{ bgcolor: '#4CAF50' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              href={item.path}
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 1,
                transition: '0.3s',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              <IconButton color="inherit">{item.icon}</IconButton>
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavigationBar;
