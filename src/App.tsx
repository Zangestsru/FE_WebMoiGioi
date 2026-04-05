import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProjectListingPage from "./pages/project/ProjectListingPage";
import PropertyListingPage from "./pages/project/PropertyListingPage";
import PropertyDetailPage from "./pages/project/PropertyDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import BrokerRegistrationPage from "./pages/user/BrokerRegistrationPage";
import ChatPage from "./pages/chat/ChatPage";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import VerifyOtpPage from "./pages/auth/verify-otp/VerifyOtpPage";
import ProjectDetailPage from "./pages/project/ProjectDetailPage";
import FavoritesPage from "./pages/user/FavoritesPage";

import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import { useFavoriteStore } from "./store/useFavoriteStore";

import { ToastContainer } from "./components/ui/Toast";

// Admin imports
import { AdminRoute } from "./components/auth/AdminRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { BrokerApprovals } from './pages/admin/BrokerApprovals';
import { ListingApprovals } from './pages/admin/ListingApprovals';
import { ProjectApprovals } from './pages/admin/ProjectApprovals';
import { ReportApprovals } from './pages/admin/ReportApprovals';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { BrokerManagement } from './pages/admin/BrokerManagement';

// Agent imports
import { AgentRoute } from "./components/auth/AgentRoute";
import { AgentLayout } from "./pages/agent/AgentLayout";
import { AgentDashboard } from "./pages/agent/AgentDashboard";
import { AgentPostPage } from "./pages/agent/AgentPostPage";
import { AgentProjectDashboard } from "./pages/agent/AgentProjectDashboard";
import { AgentProjectPostPage } from "./pages/agent/AgentProjectPostPage";

/**
 * App - main router entry point.
 * Handles public, protected, and admin routes.
 */
function App() {
  const { isAuthenticated } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const { syncFavorites } = useFavoriteStore();

  // Sync favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      syncFavorites();
    }
  }, [isAuthenticated, syncFavorites]);

  // Quản lý kết nối socket dựa trên trạng thái đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
  }, [isAuthenticated, connect, disconnect]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/du-an" element={<ProjectListingPage />} />
        <Route path="/bat-dong-san" element={<PropertyListingPage />} />
        <Route path="/bat-dong-san/:id" element={<PropertyDetailPage />} />
        <Route path="/du-an/:id" element={<ProjectDetailPage />} />
        <Route path="/yeu-thich" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Protected Routes - Redirect to Home if not authenticated */}
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />}
        />
        <Route
          path="/user/register-broker"
          element={
            isAuthenticated ? <BrokerRegistrationPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/" />}
        />

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
          <Route path="listing-approvals" element={<ListingApprovals />} />
          <Route path="report-approvals" element={<ReportApprovals />} />
          <Route path="project-approvals" element={<ProjectApprovals />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="broker-management" element={<BrokerManagement />} />
        </Route>

        {/* Agent Routes - Only accessible by AGENT role */}
        <Route
          path="/agent"
          element={
            <AgentRoute>
              <AgentLayout />
            </AgentRoute>
          }
        >
          <Route index element={<AgentDashboard />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="post" element={<AgentPostPage />} />
          <Route path="edit/:id" element={<AgentPostPage />} />
          <Route path="projects" element={<AgentProjectDashboard />} />
          <Route path="project-post" element={<AgentProjectPostPage />} />
          <Route path="project-edit/:id" element={<AgentProjectPostPage />} />
          {/* Clients, Analytics, Settings routes placeholder... */}
        </Route>

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
