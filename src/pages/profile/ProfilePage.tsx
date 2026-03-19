import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useUIStore } from '../../store/useUIStore';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { FormInput } from '../../components/ui/FormInput';
import { FormButton } from '../../components/ui/FormButton';
import { StatusModal } from '../../components/ui/StatusModal';
import { 
  Camera, User as UserIcon, Loader2, Key, ShieldCheck, Mail, Phone 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/UserService';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    profile, hasPassword, email, phone, 
    isFetching, isUpdating, fetchProfile, updateProfile, updateAvatar,
    setHasPassword
  } = useProfileStore();
  
  // Global UI Store for centralized notifications
  const { showStatus } = useUIStore();

  const navigate = useNavigate();

  // Form fields (local state for immediate user input feedback)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    address: '',
    taxCode: '',
    identityCardNumber: '',
    brokerLicenseNumber: '',
    websiteUrl: '',
    zaloContactPhone: '',
  });
  
  // Password form state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  });

  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cooldown timer logic for OTP
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Initial data fetch - Centerpoint of Profile sync
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Synchronize dynamic store data back into local form fields
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        address: profile.address || '',
        taxCode: profile.taxCode || '',
        identityCardNumber: profile.identityCardNumber || '',
        brokerLicenseNumber: profile.brokerLicenseNumber || '',
        websiteUrl: profile.websiteUrl || '',
        zaloContactPhone: profile.zaloContactPhone || '',
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = await updateProfile(formData);
    
    if (result.errors) {
      setErrors(result.errors);
      return;
    }

    if (result.success) {
      showStatus('Thành công', 'Thông tin hồ sơ của bạn đã được cập nhật đồng bộ.', 'success');
    } else {
      showStatus('Lỗi cập nhật', result.message || 'Có lỗi xảy ra khi lưu hồ sơ.', 'error');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await updateAvatar(file);
    if (result.success) {
      showStatus('Thành công', 'Ảnh đại diện của bạn đã được cập nhật đồng bộ.', 'success');
    } else {
      showStatus('Lỗi tải ảnh', result.message || 'Không thể tải ảnh lên hệ thống.', 'error');
    }
  };

  const handleSendOTP = async () => {
    if (otpCooldown > 0) return;
    setIsUpdatingPwd(true);
    try {
      const response = await userService.initiateSetPassword();
      if (response.success) {
        setOtpCooldown(60);
        showStatus('Đã gửi mã', 'Mã xác nhận bảo mật đã được gửi đến Gmail của bạn.', 'success');
      }
    } catch (error) {
      showStatus('Lỗi OTP', 'Hệ thống không thể gửi mã OTP lúc này.', 'error');
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPwd(true);
    setErrors({});

    try {
      if (hasPassword) {
        const { response, errors: localErrors } = await userService.changePassword(pwdForm);
        if (localErrors) {
          setErrors(localErrors);
          return;
        }
        if (response?.success) {
          showStatus('Thành công', 'Mật khẩu của bạn đã được thay đổi an toàn!', 'success');
          setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
        }
      } else {
        const { response, errors: localErrors } = await userService.setPassword(pwdForm);
        if (localErrors) {
          setErrors(localErrors);
          return;
        }
        if (response?.success) {
          showStatus('Thành công', 'Thiết lập mật khẩu riêng cho tài khoản thành công.', 'success');
          setHasPassword(true);
          setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' });
        }
      }
    } catch (error) {
      showStatus('Thất bại', 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.', 'error');
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  if (!user || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLoginClick={() => navigate('/')} onRegisterClick={() => navigate('/')} />

      <main className="flex-1 flex items-center justify-center px-6 py-10 mt-[72px]">
        <div className="w-full max-w-[1100px] bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="h-2 bg-blue-500 w-full opacity-10"></div>

          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT: Profile Form Section */}
              <div className="lg:col-span-7 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="relative group shrink-0">
                    <div 
                      className={`w-28 h-28 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all overflow-hidden bg-gray-50 ${isUpdating ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`}
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                      ) : profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={40} className="text-gray-300" />
                      )}
                      {!isUpdating && (
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera size={24} className="text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUpdating} />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-primary tracking-tight">Cài đặt hồ sơ</h2>
                    <p className="text-gray-400 font-primary mt-1 flex items-center gap-2">
                      {email}
                      <ShieldCheck size={16} className="text-blue-500" />
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <FormInput
                        id="displayName"
                        label="Tên hiển thị"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        placeholder="Họ và tên hoặc biệt danh"
                        error={errors.displayName}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 font-primary">Tiểu sử cá nhân</label>
                      <textarea
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-sm font-primary focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px] resize-none"
                        placeholder="Hãy viết vài dòng về bản thân hoặc kinh nghiệm của bạn..."
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>

                    <FormInput
                      id="address"
                      label="Địa chỉ cư trú"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Tỉnh/Tp, Quận/Huyện"
                    />

                    <FormInput
                      id="zaloPhone"
                      label="Số điện thoại Zalo"
                      value={formData.zaloContactPhone}
                      onChange={(e) => setFormData({...formData, zaloContactPhone: e.target.value})}
                      placeholder="Dùng để khách hàng liên hệ"
                    />

                    <div className="md:col-span-2 grid grid-cols-2 gap-6 p-6 bg-blue-50/30 rounded-[24px] border border-blue-100/50">
                       <FormInput
                        id="taxCode"
                        label="Mã số thuế"
                        value={formData.taxCode}
                        onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                        placeholder="Nhập MST cá nhân"
                      />
                      <FormInput
                        id="identity"
                        label="Số CCCD/CMND"
                        value={formData.identityCardNumber}
                        onChange={(e) => setFormData({...formData, identityCardNumber: e.target.value})}
                        placeholder="Nhập 12 số CCCD"
                      />
                      <FormInput
                        id="license"
                        label="Chứng chỉ hành nghề"
                        value={formData.brokerLicenseNumber}
                        onChange={(e) => setFormData({...formData, brokerLicenseNumber: e.target.value})}
                        placeholder="Số thẻ môi giới"
                      />
                      <FormInput
                        id="website"
                        label="Trang web / Portfolio"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <FormButton 
                    type="submit" 
                    isLoading={isUpdating}
                    className="w-full py-4 rounded-2xl text-base shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20"
                  >
                    Lưu các thay đổi
                  </FormButton>
                </form>
              </div>

              {/* RIGHT: Security Section */}
              <div className="lg:col-span-5 space-y-8 bg-gray-50/50 p-8 rounded-[32px] border border-gray-100/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-primary flex items-center gap-3">
                    <Key size={24} className="text-blue-500" />
                    Bảo mật
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-primary">An toàn và quyền riêng tư</p>
                </div>

                {!hasPassword && (
                  <div className="bg-blue-600 rounded-2xl p-5 text-white animate-in zoom-in">
                     <div className="flex items-start gap-4">
                        <ShieldCheck size={28} className="shrink-0 text-blue-200" />
                        <div>
                          <p className="font-bold text-xs uppercase tracking-wider">Thông tin quan trọng</p>
                          <p className="text-blue-100 mt-1 text-sm leading-relaxed">Đăng nhập bằng Google hiện chưa có mật khẩu riêng. Bạn nên đặt mật khẩu mới ngay để tăng tối đa tính an toàn.</p>
                        </div>
                     </div>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  {hasPassword ? (
                    <FormInput
                      id="currentPassword"
                      label="Mật khẩu hiện tại"
                      type="password"
                      value={pwdForm.currentPassword}
                      onChange={(e) => setPwdForm({...pwdForm, currentPassword: e.target.value})}
                      placeholder="••••••••"
                      error={errors.currentPassword}
                    />
                  ) : (
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <FormInput
                          id="otp"
                          label="Mã xác nhận OTP (Gmail)"
                          value={pwdForm.otp}
                          onChange={(e) => setPwdForm({...pwdForm, otp: e.target.value})}
                          placeholder="Nhập 6 số"
                          error={errors.otp}
                        />
                      </div>
                      <FormButton
                        type="button"
                        variant="secondary"
                        onClick={handleSendOTP}
                        disabled={otpCooldown > 0 || isUpdatingPwd}
                        className="h-[52px] px-6 text-sm font-bold border-gray-200 bg-white"
                      >
                        {otpCooldown > 0 ? `${otpCooldown}s` : 'Gửi mã'}
                      </FormButton>
                    </div>
                  )}

                  <FormInput
                    id="newPassword"
                    label={hasPassword ? "Mật khẩu mới" : "Đặt mật khẩu"}
                    type="password"
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})}
                    placeholder="••••••••"
                    error={errors.newPassword}
                  />

                  <FormButton 
                    type="submit" 
                    isLoading={isUpdatingPwd}
                    className="w-full py-4 rounded-2xl"
                  >
                    {hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu'}
                  </FormButton>
                </form>

                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4 text-sm font-primary text-gray-600">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <span className="font-medium">{phone || 'Chưa liên kết SĐT'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* SYNCED STATUS MODAL (Managed by useUIStore) */}
      <StatusModal />
    </div>
  );
};

export default ProfilePage;
