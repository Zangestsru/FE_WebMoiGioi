import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { FormInput } from '../../components/ui/FormInput';
import { FormButton } from '../../components/ui/FormButton';
import { Camera, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ProfilePage - Refactored to comply with rules.md
 * Rule 4: Reusing Layout and UI components.
 * Rule 5: Using utility classes and theme tokens instead of hardcoded styles.
 */
const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-primary">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Vui lòng đăng nhập</h2>
          <p className="mt-2 text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin hồ sơ.</p>
          <FormButton onClick={() => navigate('/login')}>Đăng nhập ngay</FormButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLoginClick={() => navigate('/login')} onRegisterClick={() => navigate('/register')} />

      <main className="flex-1 flex items-center justify-center px-6 py-10 mt-[72px]">
        {/* KHUNG CHÍNH - Sử dụng rounded-3xl thay vì hardcode 28px để đồng bộ design system (Rule 5) */}
        <div className="w-full max-w-[1000px] bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0 lg:divide-x lg:divide-gray-50">

            {/* CỘT TRÁI: Thông tin cá nhân */}
            <div className="space-y-6 pr-0 lg:pr-10">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-16 h-16 rounded-full border border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5 hover:border-blue-400 hover:bg-blue-50 transition-all bg-gray-50">
                    <Camera size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-medium text-gray-400 group-hover:text-blue-500 transition-colors font-primary uppercase tracking-tighter">Tải ảnh</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-primary">Thông tin cá nhân</h2>
                  <p className="text-xs text-gray-400 font-primary mt-0.5 truncate max-w-[200px]">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <FormInput
                  id="fullName"
                  label="Họ và tên"
                  defaultValue="Lê Ngọc Linhh"
                  placeholder="Nhập họ và tên"
                />

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormInput
                      id="phone"
                      label="Số điện thoại chính"
                      defaultValue={user.phone || '0825759123'}
                      disabled
                    />
                  </div>
                  <button className="flex items-center gap-1 text-red-500 font-bold font-primary hover:text-red-600 transition-colors text-[13px] shrink-0 pb-3">
                    <Plus size={16} />
                    <span>Thêm SĐT</span>
                  </button>
                </div>

                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  defaultValue={user.email || ''}
                  disabled
                />
              </div>

              <div className="pt-2 flex justify-end">
                {/* Thay style={} bằng className Tailwind (Rule 5) */}
                <FormButton
                  type="button"
                  className="px-6 py-2.5 h-auto text-sm rounded-xl"
                >
                  Cập nhật hồ sơ
                </FormButton>
              </div>
            </div>

            {/* CỘT PHẢI: Thay đổi mật khẩu */}
            <div className="space-y-6 pl-0 lg:pl-10 mt-10 lg:mt-0 border-t border-gray-50 pt-10 lg:border-t-0 lg:pt-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-primary">Thay đổi mật khẩu</h2>
                <p className="text-sm text-gray-400 font-primary mt-0.5">Để bảo mật tài khoản tốt hơn</p>
              </div>

              <div className="space-y-4">
                <FormInput
                  id="oldPassword"
                  label="Mật khẩu hiện tại"
                  type="password"
                  placeholder="••••••••"
                />
                <FormInput
                  id="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="••••••••"
                />
                <FormInput
                  id="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2 flex justify-end">
                {/* Thay style={} bằng className Tailwind (Rule 5) */}
                <FormButton
                  type="button"
                  className="px-6 py-2.5 h-auto text-sm rounded-xl"
                >
                  Đổi mật khẩu
                </FormButton>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
