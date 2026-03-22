import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  LayoutDashboard,
  CheckSquare,
  Tags,
  FileText,
  Image as ImageIcon,
  Users,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
  Search,
  Bell,
  ChevronDown,
  Menu,
  ShieldCheck,
  List,
  Award,
  LogOut
} from "lucide-react";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";
import { useAuthStore } from "../../store/useAuthStore";

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  children?: React.ReactNode;
};

function NavItem({ href, icon: Icon, label, isActive, children }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(isActive);

  if (children) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={twMerge(
            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
            {label}
          </div>
          <ChevronDown
            size={16}
            className={clsx("transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
        {isOpen && <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">{children}</div>}
      </div>
    );
  }

  return (
    <Link
      to={href}
      className={twMerge(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
      {label}
    </Link>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header (Shows only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <span className="font-bold text-xl text-blue-600 tracking-tight">BấtĐộngSản</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={clsx(
          "w-64 bg-white border-r border-slate-200 flex flex-col fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:block">
          <Link to="/admin" className="font-bold text-2xl text-blue-600 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
               R
            </div>
            AdminBĐS
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 pb-6 space-y-1 mt-4 md:mt-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Chính</div>
            <NavItem href="/admin" icon={LayoutDashboard} label="Bảng điều khiển" isActive={location.pathname === "/admin"} />
            
            <NavItem href="#listing" icon={CheckSquare} label="Duyệt Tin đăng" isActive={false} />
            
            <NavItem href="#category" icon={Tags} label="Quản lý Danh mục" isActive={false} />
            
            <NavItem href="#cms" icon={FileText} label="CMS (Tin tức)" isActive={false} />
            
            <NavItem href="#banner" icon={ImageIcon} label="Banner & Quảng cáo" isActive={false} />
            
            <NavItem href="#users" icon={Users} label="Quản lý Người dùng" isActive={false} />

            <div className="mt-6 mb-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Vận hành</div>
              <NavItem 
                href="/admin/broker-approvals" 
                icon={Briefcase} 
                label="Quản lý Môi giới" 
                isActive={location.pathname.includes("/admin/broker")}
              >
                <Link 
                  to="/admin/broker-approvals" 
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    location.pathname === "/admin/broker-approvals" ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <ShieldCheck size={16} />
                  Yêu cầu Phê duyệt
                </Link>
                <Link to="#broker-list" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors">
                  <List size={16} />
                  Danh sách Môi giới
                </Link>
                <Link to="#broker-tiers" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors">
                  <Award size={16} />
                  Cấp bậc/Hạng
                </Link>
              </NavItem>
              
              <NavItem href="#pricing" icon={DollarSign} label="Bảng giá Dịch vụ" isActive={false} />
              
              <NavItem href="#support" icon={HeadphonesIcon} label="Hỗ trợ Khách hàng" isActive={false} />
            </div>
          </nav>
        </div>

        {/* Logout button at sidebar bottom */}
        <div className="p-4 border-t border-slate-200 mt-auto bg-slate-50/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm bất kỳ..."
                className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1625502709763-f5f3880c17ba?ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHN1aXR8ZW58MXx8fHwxNzc0MTQxNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Admin Profile"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-700 leading-none">
                  {user?.email || 'Quản trị viên'}
                </span>
                <span className="text-xs text-slate-500 mt-1">Admin Cấp cao</span>
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden md:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
