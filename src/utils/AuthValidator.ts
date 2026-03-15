import type { RegisterFormState, FormErrors } from '../types/auth.types';

/**
 * FE validation rules - mirror the BE Zod schema exactly.
 * Source: BE_WebMoiGioi/src/dtos/auth/register.dto.ts
 */
export class AuthValidator {
  static validateRegisterForm(values: RegisterFormState): FormErrors {
    const errors: FormErrors = {};

    // fullName: min 2 chars
    if (!values.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên';
    } else if (values.fullName.trim().length < 2) {
      errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // email: valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Địa chỉ email không hợp lệ';
    }

    // phone: Vietnamese phone number (matches BE regex)
    const phoneRegex = /^(03|05|07|08|09|01[2|6|8|9])+(\d{8})$/;
    if (!values.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    // password: min 8, uppercase, lowercase, number, special char
    if (!values.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (values.password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ in hoa';
    } else if (!/[a-z]/.test(values.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    } else if (!/\d/.test(values.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số';
    } else if (!/[^A-Za-z0-9]/.test(values.password)) {
      errors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    }

    // confirmPassword: must match password
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // agreeToTerms
    if (!values.agreeToTerms) {
      errors.agreeToTerms = 'Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật';
    }

    return errors;
  }

  static isFormValid(errors: FormErrors): boolean {
    return Object.keys(errors).length === 0;
  }
}
