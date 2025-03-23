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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <MainAppBar></MainAppBar>
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
        </Router>
        <FooterBar></FooterBar>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
