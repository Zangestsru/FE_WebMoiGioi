import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';

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
        
        {/* Protected Routes - Redirect to Home if not authenticated */}
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} 
        />

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>

  );
}

export default App;
