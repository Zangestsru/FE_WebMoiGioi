import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, PlusSquare, Users, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

export function AgentSidebar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Trang chủ', path: '/agent' },
    { icon: Home, label: 'Quản lý tin đăng', path: '/agent/dashboard' },
    { icon: PlusSquare, label: 'Đăng tin', path: '/agent/post' },
    { icon: Users, label: 'Khách hàng', path: '/agent/clients' },
    { icon: BarChart2, label: 'Thống kê', path: '/agent/analytics' },
    { icon: Settings, label: 'Cài đặt', path: '/agent/settings' },
  ];

  return (
    <div className="w-[280px] bg-white border-r border-[#E5E7EB] h-full flex flex-col shrink-0 flex-shrink-0 relative z-20 hidden md:flex font-primary shadow-sm">
      <div className="h-[90px] flex items-center px-8">
         {/* Top padding / empty space like design */}
      </div>

      <div className="flex-1 py-4 px-6 flex flex-col gap-2 overflow-y-auto mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/agent'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-all ${
                isActive
                  ? 'bg-[#0f243c] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={`shrink-0 ${isActive ? 'text-yellow-400' : ''}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="p-6">
        <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 w-full transition-colors"
        >
            <LogOut size={22} className="shrink-0" />
            Đăng xuất
        </button>
      </div>
    </div>
  );
}
