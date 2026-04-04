import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LogOut, User as UserIcon, ChevronDown, Menu, X, Briefcase, LayoutDashboard, MessageCircle, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Navbar({ onLoginClick, onRegisterClick }: Readonly<NavbarProps>) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favoriteIds } = useFavoriteStore();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100 h-[72px] flex items-center px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between gap-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
          <span className="font-primary text-lg font-black tracking-tight text-gray-900 uppercase">
            Bất Động Sản Việt Nam
          </span>
        </Link>

        {/* NAVIGATION LINKS - Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Mua', href: '#mua' },
            { label: 'Bán', href: '#ban' },
            { label: 'Tin tức', href: '#tin-tuc' }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-primary text-[15px] font-semibold text-gray-700 hover:text-black transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/du-an"
            className="font-primary text-[15px] font-semibold text-gray-700 hover:text-black transition-colors"
          >
            Dự án
          </Link>
        </div>

        {/* SEARCH BAR - Desktop */}
        <div className="hidden md:flex flex-1 max-w-[400px] relative items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm địa chỉ"
            className="w-full bg-[#F3F4F6] border-none rounded-full py-2.5 pl-11 pr-4 font-primary text-sm focus:ring-2 focus:ring-black transition-all outline-none"
          />
        </div>

        {/* ACTIONS / PROFILE */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={18} />
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="font-primary text-sm font-bold text-gray-900 leading-none">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.12)] border border-gray-100 py-2.5 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-3 border-b border-gray-50 mb-1.5">
                    <p className="font-primary text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em]">Tài khoản</p>
                    <p className="font-primary text-sm text-gray-900 truncate font-semibold mt-0.5">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors font-primary text-sm font-bold text-gray-700"
                  >
                    <UserIcon size={18} />
                    Hồ sơ
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors font-primary text-sm font-bold text-gray-700"
                  >
                    <MessageCircle size={18} />
                    Tin nhắn
                  </Link>
                  <Link
                    to="/yeu-thich"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors font-primary text-sm font-bold text-gray-700"
                  >
                    <Heart size={18} />
                    BĐS Yêu thích
                  </Link>
                  {user?.accountType === 'MEMBER' && (
                    <Link
                      to="/user/register-broker"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors font-primary text-sm font-bold text-gray-700"
                    >
                      <Briefcase size={18} />
                      Trở thành môi giới
                    </Link>
                  )}
                  {user?.accountType === 'AGENT' && (
                    <Link
                      to="/agent/dashboard"
                      target="_blank"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 transition-colors font-primary text-sm font-bold text-gray-700"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard Môi Giới
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3.5 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors font-primary text-sm font-bold"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 font-primary text-[15px] font-bold text-gray-900 hover:bg-gray-50 rounded-full transition-colors border border-gray-200"
              >
                Đăng nhập
              </button>
              <button
                onClick={onRegisterClick}
                className="px-6 py-2.5 font-primary text-[15px] font-bold text-gray-900 hover:bg-gray-50 rounded-full transition-colors border border-black"
              >
                Đăng ký
              </button>
            </>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-white z-[90] flex flex-col p-6 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {[
              { label: 'Mua', href: '#mua' },
              { label: 'Bán', href: '#ban' },
              { label: 'Tin tức', href: '#tin-tuc' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/du-an"
              className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dự án
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon size={20} />
                  Hồ sơ
                </Link>
                <Link
                  to="/chat"
                  className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle size={20} />
                  Tin nhắn
                </Link>
                {user?.accountType === 'MEMBER' && (
                  <Link
                    to="/user/register-broker"
                    className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase size={20} />
                    Trở thành môi giới
                  </Link>
                )}
                {user?.accountType === 'AGENT' && (
                  <Link
                    to="/agent/dashboard"
                    target="_blank"
                    className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    Dashboard Môi Giới
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-primary text-lg font-bold text-red-500 border-b border-gray-50 pb-4 flex items-center gap-3 text-left w-full"
                >
                  <LogOut size={20} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 text-left w-full"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-primary text-lg font-bold text-gray-900 border-b border-gray-50 pb-4 text-left w-full"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm địa chỉ"
              className="w-full bg-[#F3F4F6] border-none rounded-2xl py-4 pl-12 pr-4 font-primary text-base focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
