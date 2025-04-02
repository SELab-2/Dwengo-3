import { ThemeProvider } from '@mui/material/styles';
import { LoginPage } from './views/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyClassesPage from './views/MyClassesPage';
import MyLearningPathsPage from './views/MyLearningPathsPage';
import LearningThemesPage from './views/LearningThemesPage';
import ClassDashboardPage from './views/ClassDashboardPage.tsx';
import LearningPathPage from './views/LearningPathPage';
import ClassAssignmentsPage from './views/ClassAssignmentsPage';
import ClassAssignmentPage from './views/ClassAssignmentPage';
import LearningThemePage from './views/LearningThemePage';
import { AppRoutes } from './util/routes';
import AnnouncementsPage from './views/AnnouncementPage';
import DiscussionsPage from './views/DiscussionsPage.tsx';
import DiscussionPage from './views/DiscussionPage.tsx';

const queryClient = new QueryClient();

function App() {
  // TODO: fill in GoogleClientId

  return (
    <GoogleOAuthProvider clientId="TODO">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Router>
              <MainAppBar></MainAppBar>
              <ErrorProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path={AppRoutes.login} element={<LoginPage />} />
                  <Route path={AppRoutes.register} element={<RegisterPage />} />

                  {/* Protected Routes */}
                  {/* TODO: Wrap the protected routes in a ProtectedRoutes component, deleted this for production ease */}
                  <Route>
                    <Route path={AppRoutes.home} element={<HomePage />} />
                    <Route path={AppRoutes.profile} element={<ProfilePage />} />
                    <Route path={AppRoutes.myClasses} element={<MyClassesPage />} />
                    <Route path={AppRoutes.myLearningPaths} element={<MyLearningPathsPage />} />
                    <Route path={AppRoutes.learningPath(':id')} element={<LearningPathPage />} />
                    <Route path={AppRoutes.learningThemes} element={<LearningThemesPage />} />
                    <Route path={AppRoutes.learningTheme(':id')} element={<LearningThemePage />} />
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
                    // TODO: PAGINA linken!!!
                    <Route
                      path={AppRoutes.classDiscussions(':classId')}
                      element={<DiscussionsPage />}
                    />
                    <Route
                      path={AppRoutes.discussion(':discussionId')}
                      element={<DiscussionPage />}
                    />
                  </Route>

                  {/* Redirect all other routes to an errorpage */}
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </ErrorProvider>
            </Router>
            <FooterBar></FooterBar>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
