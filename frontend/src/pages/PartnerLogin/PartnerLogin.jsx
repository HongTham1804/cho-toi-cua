import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PartnerLogin.scss';
import { Eye, EyeOff, Lock, Mail, Phone, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const initialForgotState = {
  email: '',
  otp: '',
  resetToken: '',
  password: '',
  password_confirmation: '',
};

const PartnerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('email');
  const [forgotForm, setForgotForm] = useState(initialForgotState);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const readError = (payload, fallback) => {
    if (payload?.message) return payload.message;
    const firstError = payload?.errors && Object.values(payload.errors)[0]?.[0];
    return firstError || fallback;
  };

  const updateForgot = (field, value) => {
    setForgotForm((current) => ({ ...current, [field]: value }));
  };

  const resetForgotModal = () => {
    setForgotOpen(false);
    setForgotStep('email');
    setForgotForm(initialForgotState);
    setForgotMessage('');
    setForgotError('');
    setForgotLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Không thể đăng nhập đối tác.'));
      }

      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      storage.setItem('partner_token', payload.token);
      storage.setItem('partner_user', JSON.stringify(payload.user));
      storage.setItem('partner_store', JSON.stringify(payload.store || null));

      navigate('/inventory', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Không thể đăng nhập đối tác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendForgotOtp = async (event) => {
    event.preventDefault();
    if (forgotLoading) return;

    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: forgotForm.email }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Không thể gửi OTP đặt lại mật khẩu.'));
      }

      setForgotMessage(payload.message || 'OTP đã được gửi đến email đối tác.');
      setForgotStep('otp');
    } catch (error) {
      setForgotError(error.message || 'Không thể gửi OTP đặt lại mật khẩu.');
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyForgotOtp = async (event) => {
    event.preventDefault();
    if (forgotLoading) return;

    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: forgotForm.email, otp: forgotForm.otp }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Mã OTP không hợp lệ.'));
      }

      setForgotForm((current) => ({ ...current, resetToken: payload.reset_token || '' }));
      setForgotMessage(payload.message || 'OTP hợp lệ. Hãy đặt mật khẩu mới.');
      setForgotStep('reset');
    } catch (error) {
      setForgotError(error.message || 'Mã OTP không hợp lệ.');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotPassword = async (event) => {
    event.preventDefault();
    if (forgotLoading) return;

    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          reset_token: forgotForm.resetToken,
          password: forgotForm.password,
          password_confirmation: forgotForm.password_confirmation,
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Không thể đặt lại mật khẩu.'));
      }

      setForgotMessage(payload.message || 'Đặt lại mật khẩu thành công.');
      setTimeout(resetForgotModal, 900);
    } catch (error) {
      setForgotError(error.message || 'Không thể đặt lại mật khẩu.');
    } finally {
      setForgotLoading(false);
    }
  };

  const forgotSubmitHandler = forgotStep === 'email'
    ? sendForgotOtp
    : forgotStep === 'otp'
      ? verifyForgotOtp
      : resetForgotPassword;

  return (
    <div className="partner-login-page">
      <main className="main-content">
        <div className="login-card">
          <div className="branding-side">
            <div className="overlay-blur"></div>
            <div className="branding-container">
              <div className="brand-logo">
                <h1>Chợ Tới Cửa</h1>
              </div>
              <div className="brand-intro">
                <h2>Trở thành đối tác cung cấp</h2>
                <p>Kết nối nông sản sạch của bạn trực tiếp đến hàng ngàn gia đình mỗi ngày.</p>
              </div>
            </div>
          </div>

          <div className="form-side">
            <div className="form-header">
              <h1>Đăng nhập Đối tác</h1>
              <p>Vui lòng nhập thông tin để truy cập bảng điều khiển.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="identifier">Email hoặc số điện thoại</label>
                <div className="input-container">
                  <span className="input-icon">
                    <Phone size={15} />
                  </span>
                  <input
                    type="text"
                    id="identifier"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="input-container">
                  <span className="input-icon">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="remember-forgot-container">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setForgotOpen(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              {errorMessage && <p className="partner-login-error">{errorMessage}</p>}
            </form>

            <div className="form-footer">
              <p>
                Chưa có tài khoản đối tác? Vui lòng liên hệ với chúng tôi để được hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </main>

      {forgotOpen && (
        <div className="partner-forgot-overlay" onClick={resetForgotModal}>
          <div className="partner-forgot-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="partner-forgot-close" onClick={resetForgotModal}>
              <X size={22} />
            </button>

            <h2>Quên mật khẩu đối tác</h2>
            <p>
              {forgotStep === 'email' && 'Nhập email đối tác để nhận mã OTP.'}
              {forgotStep === 'otp' && 'Nhập mã OTP đã gửi đến email của bạn.'}
              {forgotStep === 'reset' && 'Tạo mật khẩu mới và xác nhận lại mật khẩu.'}
            </p>

            <form onSubmit={forgotSubmitHandler} className="partner-forgot-form">
              <div className="form-group">
                <label>Email đối tác</label>
                <div className="input-container">
                  <span className="input-icon">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    placeholder="Nhập email đối tác"
                    value={forgotForm.email}
                    onChange={(event) => updateForgot('email', event.target.value)}
                    disabled={forgotStep !== 'email'}
                    required
                  />
                </div>
              </div>

              {forgotStep === 'otp' && (
                <div className="form-group">
                  <label>Mã OTP</label>
                  <div className="input-container">
                    <span className="input-icon">
                      <Lock size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Nhập mã OTP 6 số"
                      value={forgotForm.otp}
                      onChange={(event) => updateForgot('otp', event.target.value)}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 'reset' && (
                <>
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <div className="input-container">
                      <span className="input-icon">
                        <Lock size={15} />
                      </span>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={forgotForm.password}
                        onChange={(event) => updateForgot('password', event.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <div className="input-container">
                      <span className="input-icon">
                        <Lock size={15} />
                      </span>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={forgotForm.password_confirmation}
                        onChange={(event) => updateForgot('password_confirmation', event.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {forgotMessage && <p className="partner-login-note success">{forgotMessage}</p>}
              {forgotError && <p className="partner-login-note error">{forgotError}</p>}

              <button type="submit" className="submit-btn" disabled={forgotLoading}>
                {forgotLoading
                  ? 'Đang xử lý...'
                  : forgotStep === 'email'
                    ? 'Gửi OTP'
                    : forgotStep === 'otp'
                      ? 'Xác minh OTP'
                      : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerLogin;
