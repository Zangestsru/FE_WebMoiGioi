import type { UpdateProfileRequestDTO, ChangePasswordRequestDTO } from '../types/user.types';

export class UserValidator {
  /**
   * Basic validation for profile update
   */
  static validateProfileUpdate(data: UpdateProfileRequestDTO): Record<string, string> {
    const errors: Record<string, string> = {};

    if (data.displayName && data.displayName.length < 2) {
      errors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    }

    if (data.zaloContactPhone && !/^(03|05|07|08|09|01[2|6|8|9])+(\d{8})$/.test(data.zaloContactPhone)) {
      errors.zaloContactPhone = 'Số điện thoại Zalo không hợp lệ';
    }

    if (data.websiteUrl && !/^https?:\/\//.test(data.websiteUrl)) {
      errors.websiteUrl = 'Website URL phải bắt đầu bằng http:// hoặc https://';
    }

    return errors;
  }

  /**
   * Validation for password change
   */
  static validatePasswordChange(data: ChangePasswordRequestDTO): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.currentPassword) {
      errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }

    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (data.currentPassword === data.newPassword) {
      errors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ';
    }

    return errors;
  }

  /**
   * Validation for setting new password (for social users)
   */
  static validateSetPassword(data: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!data.otp || data.otp.length !== 6) {
      errors.otp = 'Mã xác nhận phải có 6 chữ số';
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      errors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }

    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return errors;
  }

  static isFormValid(errors: Record<string, string>): boolean {

    return Object.keys(errors).length === 0;
  }
}
