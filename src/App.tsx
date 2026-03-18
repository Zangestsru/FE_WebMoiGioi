import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import VerifyOtpPage from './pages/auth/verify-otp/VerifyOtpPage';
import { useAuthStore } from './store/useAuthStore';

import { ToastContainer } from './components/ui/Toast';

/**
 * App - main router entry point.
 * Handles public and protected routes.
 */
function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes - Redirect to home if already logged in */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} 
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
