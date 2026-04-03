import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ProjectListingPage from "./pages/project/ProjectListingPage";
import ProfilePage from "./pages/profile/ProfilePage";
import BrokerRegistrationPage from "./pages/user/BrokerRegistrationPage";
import ChatPage from "./pages/chat/ChatPage";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import VerifyOtpPage from "./pages/auth/verify-otp/VerifyOtpPage";

import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";

import { ToastContainer } from "./components/ui/Toast";

// Admin imports
import { AdminRoute } from "./components/auth/AdminRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { BrokerApprovals } from "./pages/admin/BrokerApprovals";
import { ListingApprovals } from "./pages/admin/ListingApprovals";

// Agent imports
import { AgentRoute } from "./components/auth/AgentRoute";
import { AgentLayout } from "./pages/agent/AgentLayout";
import { AgentDashboard } from "./pages/agent/AgentDashboard";
import { AgentPostPage } from "./pages/agent/AgentPostPage";

/**
 * App - main router entry point.
 * Handles public, protected, and admin routes.
 */
function App() {
  const { isAuthenticated } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

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
          {/* Clients, Analytics, Settings routes placeholder... */}
        </Route>

        {/* Catch-all - Redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
