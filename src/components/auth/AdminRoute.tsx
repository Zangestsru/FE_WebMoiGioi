import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldX } from 'lucide-react';

/**
 * AdminRoute - Route guard that only allows ADMIN users.
 * - Not authenticated → redirect to home
 * - Authenticated but not ADMIN → show 403 page
 * - ADMIN → render children
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  // Not logged in → redirect to home
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but not ADMIN → show 403
  if (user.accountType !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldX size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">403 - Không có quyền truy cập</h1>
          <p className="text-slate-500 mb-8">
            Bạn không có quyền truy cập vào trang quản trị. Vui lòng liên hệ quản trị viên nếu bạn
            cho rằng đây là lỗi.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Quay lại Trang chủ
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
