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
import { AuthProvider } from './contexts/authContext';
import { ErrorProvider } from './contexts/ErrorContext';

const queryClient = new QueryClient();

function App() {
  return (
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
                <Route element={<ProtectedRoutes />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
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
  );
}

export default App;
