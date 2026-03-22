import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Briefcase } from 'lucide-react';

/**
 * AgentRoute - Route guard that only allows AGENT users.
 */
export function AgentRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (user.accountType !== 'AGENT') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={32} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Truy cập bị từ chối</h1>
          <p className="text-gray-500 mb-8 font-primary">
            Bạn phải là Môi giới (Agent) mới có quyền truy cập vào khu vực này.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#0f172a] text-white text-[15px] font-bold rounded-xl hover:bg-black transition-colors"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
