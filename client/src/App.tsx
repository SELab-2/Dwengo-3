import { ThemeProvider } from '@mui/material/styles';
import { LoginPage } from './views/LoginPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProfilePage from './views/ProfilePage';
import RegisterPage from './views/RegisterPage';
import theme from './util/theme';
import './util/i18n';
import HomePage from './views/HomePage';
import ErrorPage from './views/ErrorPage';
import FooterBar from './components/FooterBar';
import MainAppBar from './components/MainAppBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import MyClassesPage from './views/MyClassesPage';
import MyLearningPathsPage from './views/MyLearningPathsPage';
import LearningThemesPage from './views/LearningThemesPage';
import ClassDashboardPage from './views/ClassDashboardPage.tsx';
import LearningPathPage from './views/LearningPathPage';
import ClassAssignmentsPage from './views/ClassAssignmentsPage';
import ClassAssignmentPage from './views/ClassAssignmentPage';
import LearningThemePage from './views/LearningThemePage';
import { AppRoutes } from './util/app.routes.ts';
import AnnouncementsPage from './views/AnnouncementsPage';
import AnnouncementDetailpage from './views/AnnouncementPage';
import { Box } from '@mui/material';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Ensure the layout fills the viewport height
              }}
            >
              <MainAppBar />
              <ErrorProvider>
                <Box sx={{ flex: 1 }}>
                  {' '}
                  {/* Main content area */}
                  <Routes>
                    {/* Public Routes */}
                    <Route path={AppRoutes.login} element={<LoginPage />} />
                    <Route path={AppRoutes.register} element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route>
                      <Route path={AppRoutes.home} element={<HomePage />} />
                      <Route path={AppRoutes.profile} element={<ProfilePage />} />
                      <Route path={AppRoutes.myClasses} element={<MyClassesPage />} />
                      <Route path={AppRoutes.myLearningPaths} element={<MyLearningPathsPage />} />
                      <Route path={AppRoutes.learningPath(':id')} element={<LearningPathPage />} />
                      <Route path={AppRoutes.learningThemes} element={<LearningThemesPage />} />
                      <Route
                        path={AppRoutes.learningTheme(':id')}
                        element={<LearningThemePage />}
                      />
                      <Route path={AppRoutes.class(':id')} element={<ClassDashboardPage />} />
                      <Route
                        path={AppRoutes.classAssignments(':classId')}
                        element={<ClassAssignmentsPage />}
                      />
                      <Route
                        path={AppRoutes.classAssignment(':classId', ':assignmentId')}
                        element={<ClassAssignmentPage />}
                      />
                      <Route
                        path={AppRoutes.classAnnouncements(':classId')}
                        element={<AnnouncementsPage />}
                      />
                      <Route
                        path={AppRoutes.announcement(':announcementId')}
                        element={<AnnouncementDetailpage />}
                      />
                      <Route path={AppRoutes.classDiscussions(':classId')} element={undefined} />
                      {/* TODO: PAGINA linken!!! */}
                    </Route>

                    {/* Redirect all other routes to an errorpage */}
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </Box>
              </ErrorProvider>
              <FooterBar /> {/* Footer is placed after the main content */}
            </Box>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
