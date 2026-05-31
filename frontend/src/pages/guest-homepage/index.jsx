import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import Footer from '../../components/Footer/Footer';
import heroImage from '../../assets/ảnh nền.jpg';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import goLogo from '../../assets/logos/GO.png';
import './guest-homepage.css';

const API_BASE_URL = 'http://localhost:8000/api';
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const partnerStores = [
  { id: 1, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
  { id: 2, name: 'WinMart', time: '15-20 phút', image: winmartLogo },
  { id: 3, name: 'GO!', time: '20-25 phút', image: goLogo },
];

function getApiError(result, fallback) {
  if (result?.message) return result.message;

  const firstFieldErrors = result?.errors ? Object.values(result.errors)[0] : null;
  if (Array.isArray(firstFieldErrors) && firstFieldErrors.length) {
    return firstFieldErrors[0];
  }

  return fallback;
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(getApiError(result, 'Yêu cầu không thành công. Vui lòng thử lại.'));
  }

  return result;
}

export default function GuestHomepage({ initialAuth = null }) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(initialAuth);
  const [pendingEmail, setPendingEmail] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const isRegisterOpen = authMode === 'register';
  const isLoginOpen = authMode === 'login';
  const isOtpOpen = authMode === 'otp';

  function openLogin(message = '') {
    setAuthNotice(message);
    setAuthMode('login');
  }

  function handleOtpRequested(email, message) {
    setPendingEmail(email);
    setAuthNotice(message);
    setAuthMode('otp');
  }

  function handleLoginSuccess(result) {
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('auth_user', JSON.stringify(result.user));
    navigate('/logged-in-homepage', { replace: true });
  }

  return (
    <div className="guest-home-page">
      <CustomerHeader
        variant="guest"
        onLoginClick={() => openLogin()}
        onRegisterClick={() => setAuthMode('register')}
      />

      <main className="guest-home-main">
        <section
          className="guest-hero"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(248, 252, 250, 0.96) 0%, rgba(248, 252, 250, 0.76) 42%, rgba(248, 252, 250, 0.22) 100%), url(${heroImage})` }}
        >
          <div className="guest-hero-content">
            <span className="guest-hero-badge">Chương trình đặc biệt</span>
            <h1>
              Đi chợ hộ
              <span>Tiết kiệm thời gian</span>
            </h1>
            <p>
              Tươi ngon từ nông trại đến tận cửa nhà. Chọn siêu thị yêu thích
              của bạn và chúng tôi sẽ lo phần còn lại.
            </p>
            <Link to="/select-role" className="guest-hero-cta">
              Bắt đầu mua sắm <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </section>

        <section className="guest-partners">
          <div className="guest-section-head">
            <h2>Siêu thị đối tác</h2>
            <Link to="/select-role">Xem tất cả</Link>
          </div>

          <div className="guest-store-grid">
            {partnerStores.map((store) => (
              <article className="guest-store-card" key={store.id}>
                <div className="guest-store-logo-wrap">
                  <img src={store.image} alt={store.name} />
                </div>
                <h3>{store.name}</h3>
                <p><i className="fa-regular fa-clock"></i>{store.time}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setAuthMode(null)}
          onShowLogin={() => openLogin()}
          onOtpRequested={handleOtpRequested}
        />
      )}

      {isOtpOpen && (
        <OtpModal
          email={pendingEmail}
          notice={authNotice}
          onClose={() => setAuthMode(null)}
          onBackRegister={() => setAuthMode('register')}
          onVerified={() => openLogin('Đăng ký thành công. Vui lòng đăng nhập lại.')}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          notice={authNotice}
          onClose={() => setAuthMode(null)}
          onShowRegister={() => setAuthMode('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

function RegisterModal({ onClose, onShowLogin, onOtpRequested }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    if (field === 'phone') {
      setForm((current) => ({ ...current, phone: value.replace(/\D/g, '').slice(0, 10) }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };

    if (!PHONE_REGEX.test(payload.phone)) {
      setError('Số điện thoại phải nhập đúng 10 chữ số.');
      return;
    }

    if (!EMAIL_REGEX.test(payload.email)) {
      setError('Email không đúng định dạng. Vui lòng nhập lại.');
      return;
    }

    if (payload.password !== payload.password_confirmation) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await postJson('/auth/register/send-otp', payload);
      onOtpRequested(result.email || payload.email, result.message || 'OTP đã được gửi đến email của bạn.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="guest-register-overlay" onClick={onClose}>
      <section
        className="guest-register-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-register-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="guest-register-close" type="button" onClick={onClose} aria-label="Đóng">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="guest-register-icon" aria-hidden="true">
          <i className="fa-solid fa-user-plus"></i>
        </div>

        <h2 id="guest-register-title">Đăng ký tài khoản</h2>
        <p className="guest-register-subtitle">Tham gia cùng Chợ Tới Cửa ngay hôm nay</p>

        <form className="guest-register-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <span className="guest-register-field">
              <i className="fa-regular fa-user"></i>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </span>
          </label>

          <label>
            Số điện thoại
            <span className="guest-register-field">
              <i className="fa-solid fa-phone"></i>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength="10"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="Nhập đủ 10 số điện thoại"
                required
              />
            </span>
          </label>

          <label>
            Email
            <span className="guest-register-field">
              <i className="fa-regular fa-envelope"></i>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="example@gmail.com"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <PasswordField
            label="Mật khẩu"
            value={form.password}
            visible={showPassword}
            placeholder="Ít nhất 8 ký tự"
            onToggle={() => setShowPassword((value) => !value)}
            onChange={(value) => updateField('password', value)}
          />

          <PasswordField
            label="Xác nhận mật khẩu"
            value={form.password_confirmation}
            visible={showConfirmPassword}
            placeholder="Nhập lại mật khẩu"
            onToggle={() => setShowConfirmPassword((value) => !value)}
            onChange={(value) => updateField('password_confirmation', value)}
          />

          {error && <p className="guest-auth-message guest-auth-message--error">{error}</p>}

          <button className="guest-register-submit" type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi OTP...' : 'Đăng ký'} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="guest-register-login">
          Đã có tài khoản? <button type="button" onClick={onShowLogin}>Đăng nhập ngay</button>
        </p>

        <p className="guest-register-terms">
          Bằng việc tiếp tục, bạn đồng ý với
          <br />
          <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a>
        </p>
      </section>
    </div>
  );
}

function OtpModal({ email, notice, onClose, onBackRegister, onVerified }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await postJson('/auth/register/verify-otp', { email, otp });
      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="guest-register-overlay" onClick={onClose}>
      <section
        className="guest-register-modal guest-otp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-otp-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="guest-register-close" type="button" onClick={onClose} aria-label="Đóng">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="guest-register-icon" aria-hidden="true">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

        <h2 id="guest-otp-title">Nhập mã OTP</h2>
        <p className="guest-register-subtitle">
          Nhập mã 6 số đã gửi đến <strong>{email}</strong>
        </p>

        <form className="guest-register-form" onSubmit={handleSubmit}>
          {notice && <p className="guest-auth-message guest-auth-message--success">{notice}</p>}

          <label>
            Mã OTP
            <span className="guest-register-field guest-otp-field">
              <i className="fa-solid fa-key"></i>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Nhập 6 số OTP"
                required
              />
            </span>
          </label>

          {error && <p className="guest-auth-message guest-auth-message--error">{error}</p>}

          <button className="guest-register-submit" type="submit" disabled={submitting || otp.length !== 6}>
            {submitting ? 'Đang xác minh...' : 'Xác minh OTP'} <i className="fa-solid fa-arrow-right"></i>
          </button>

          <button className="guest-auth-link-button" type="button" onClick={onBackRegister}>
            Sửa thông tin đăng ký
          </button>
        </form>
      </section>
    </div>
  );
}

function LoginModal({ notice, onClose, onShowRegister, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await postJson('/auth/login', {
        identifier: form.identifier.trim(),
        password: form.password,
      });
      onLoginSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="guest-register-overlay" onClick={onClose}>
      <section
        className="guest-register-modal guest-login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="guest-register-close" type="button" onClick={onClose} aria-label="Đóng">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="guest-register-icon" aria-hidden="true">
          <i className="fa-solid fa-store"></i>
        </div>

        <h2 id="guest-login-title">Chào mừng trở lại</h2>
        <p className="guest-register-subtitle">Vui lòng đăng nhập để tiếp tục mua sắm</p>

        <form className="guest-register-form" onSubmit={handleSubmit}>
          {notice && <p className="guest-auth-message guest-auth-message--success">{notice}</p>}

          <label>
            Email hoặc số điện thoại
            <span className="guest-register-field">
              <i className="fa-regular fa-envelope"></i>
              <input
                type="text"
                value={form.identifier}
                onChange={(event) => updateField('identifier', event.target.value)}
                placeholder="Nhập email hoặc số điện thoại"
                required
              />
            </span>
          </label>

          <PasswordField
            label="Mật khẩu"
            value={form.password}
            visible={showPassword}
            placeholder="Nhập mật khẩu"
            onToggle={() => setShowPassword((value) => !value)}
            onChange={(value) => updateField('password', value)}
          />

          {error && <p className="guest-auth-message guest-auth-message--error">{error}</p>}

          <button className="guest-register-submit" type="submit" disabled={submitting}>
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <p className="guest-register-login">
          Chưa có tài khoản? <button type="button" onClick={onShowRegister}>Đăng ký ngay</button>
        </p>
      </section>
    </div>
  );
}

function PasswordField({ label, value, visible, placeholder, onToggle, onChange }) {
  return (
    <label>
      {label}
      <span className="guest-register-field guest-register-field--password">
        <i className="fa-solid fa-lock"></i>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          minLength="8"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
        >
          <i className={`fa-regular ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </span>
    </label>
  );
}
