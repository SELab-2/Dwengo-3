import { ThemeProvider } from '@mui/material/styles';
import { LoginPage } from './views/LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './views/ProfilePage';
import RegisterPage from './views/RegisterPage';
import theme from './util/theme';
import './util/i18n';
import HomePage from './views/HomePage';
import ProtectedRoutes from './components/ProtectedRoutes';
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
import ClassPage from './views/ClassPage';
import LearningPathPage from './views/LearningPathPage';
import ClassAssignmentsPage from './views/ClassAssignmentsPage';
import ClassAssignmentPage from './views/ClassAssignmentPage';
import LearningThemePage from './views/LearningThemePage';

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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes */}
                  {/* TODO: Wrap the protected routes in a ProtectedRoutes component, deleted this for production ease */}
                  <Route>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/classes" element={<MyClassesPage />} />
                    <Route
                      path="/learning-paths"
                      element={<MyLearningPathsPage />}
                    />
                    <Route
                      path="/learning-paths/:id"
                      element={<LearningPathPage />}
                    />
                    <Route
                      path="/learning-themes"
                      element={<LearningThemesPage />}
                    />
                    <Route
                      path="learning-themes/:id"
                      element={<LearningThemePage />}
                    />
                    <Route path="/class/:id" element={<ClassPage />} />
                    <Route
                      path="/class/:id/assignments"
                      element={<ClassAssignmentsPage />}
                    />
                    <Route
                      path="/class/:id/assignments/:a_id"
                      element={<ClassAssignmentPage />}
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
