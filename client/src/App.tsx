import { ThemeProvider } from '@mui/material/styles';
import { LoginPage } from './views/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import MyClassesPage from './views/MyClassesPage';
import MyLearningPathsPage from './views/MyLearningPathsPage';
import LearningThemesPage from './views/LearningThemesPage';
import ClassDashboardPage from './views/ClassDashboardPage.tsx';
import LearningPathPage from './views/LearningPathPage';
import ClassAssignmentsPage from './views/ClassAssignmentsPage';
import ClassAssignmentPage from './views/ClassAssignmentPage';
import LearningThemePage from './views/LearningThemePage';
import ClassAnnouncementsPage from './views/ClassAnnouncementsPage.tsx';
import AnnouncementDetailpage from './views/AnnouncementDetailpage.tsx';
import AssignmentCreatePage from './views/AssignmentCreatePage.tsx';
import ClassStudentDetails from './views/ClassStudentDetails.tsx';
import { Box } from '@mui/material';
import ClassAddPage from './views/ClassAddPage.tsx';
import { AppRoutes } from './util/app.routes.ts';
import DiscussionCreatePage from './views/DiscussionCreatePage.tsx';
import ClassDiscussionsPage from './views/ClassDiscussionsPage.tsx';
import { ClassGroupEditPage } from './views/ClassGroupEditPage.tsx';
import ProtectContent from './components/ProtectContent.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import SubmissionPage from './views/SubmissionPage.tsx';
import AnnouncementCreatePage from './views/AnnouncemntCreatePage.tsx';

const queryClient = new QueryClient();

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <ProtectContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh', // Ensure the layout fills the viewport height
                  }}
                >
                  <MainAppBar />
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
                        <Route path={AppRoutes.classAdd} element={<ClassAddPage />} />
                        <Route path={AppRoutes.myLearningPaths} element={<MyLearningPathsPage />} />
                        <Route
                          path={AppRoutes.learningPath(':id')}
                          element={<LearningPathPage />}
                        />
                        <Route path={AppRoutes.learningThemes} element={<LearningThemesPage />} />
                        <Route
                          path={AppRoutes.learningTheme(':id')}
                          element={<LearningThemePage />}
                        />
                        <Route
                          path={AppRoutes.class(':classId')}
                          element={<ClassDashboardPage />}
                        />
                        <Route
                          path={AppRoutes.classStudentDetails(':classId', ':studentId')}
                          element={<ClassStudentDetails />}
                        />
                        <Route
                          path={AppRoutes.classAssignments(':classId')}
                          element={<ClassAssignmentsPage />}
                        />
                        <Route
                          path={AppRoutes.classAssignmentCreate(':classId')}
                          element={<AssignmentCreatePage />}
                        />
                        <Route
                          path={AppRoutes.classAssignment(':classId', ':assignmentId')}
                          element={<ClassAssignmentPage />}
                        />
                        <Route
                          path={AppRoutes.classAnnouncements(':classId')}
                          element={<ClassAnnouncementsPage />}
                        />
                        <Route
                          path={AppRoutes.classAnnouncementCreate(':classId')}
                          element={<AnnouncementCreatePage />}
                        />
                        <Route
                          path={AppRoutes.announcement(':announcementId')}
                          element={<AnnouncementDetailpage />}
                        />
                        <Route
                          path={AppRoutes.classDiscussions(':classId')}
                          element={<ClassDiscussionsPage />}
                        />
                        <Route
                          path={AppRoutes.groupSubmission(':classId', ':assignmentId', ':groupId')}
                          element={<SubmissionPage />}
                        />
                        <Route
                          path={AppRoutes.classEdit(':classId')}
                          element={<ClassGroupEditPage />}
                        />
                        <Route
                          path={AppRoutes.discussionCreate(':classId')}
                          element={<DiscussionCreatePage />}
                        />
                      </Route>
                      {/* Redirect all other routes to an errorpage */}
                      <Route path="*" element={<ErrorPage />} />
                    </Routes>
                  </Box>
                  <FooterBar /> {/* Footer is placed after the main content */}
                </Box>
              </ProtectContent>
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
