import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import BrokerRegistrationPage from './pages/user/BrokerRegistrationPage';

import { useAuthStore } from './store/useAuthStore';

import { ToastContainer } from './components/ui/Toast';

// Admin imports
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { BrokerApprovals } from './pages/admin/BrokerApprovals';

/**
 * App - main router entry point.
 * Handles public, protected, and admin routes.
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
        <Route 
          path="/user/register-broker" 
          element={isAuthenticated ? <BrokerRegistrationPage /> : <Navigate to="/" />} 
        />

        {/* Admin Routes - Only accessible by ADMIN role */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="broker-approvals" element={<BrokerApprovals />} />
        </Route>

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
