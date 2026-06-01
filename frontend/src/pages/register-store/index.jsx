import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';
import bgImg from '../../assets/phone.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_BASE_URL = 'http://localhost:8000/api';

const initialForm = {
  store_name: '',
  business_type: '',
  store_address: '',
  name: '',
  phone: '',
  email: '',
  password: '',
  password_confirmation: '',
};

function RegisterStore() {
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState('');
  const [agree, setAgree] = useState(false);
  const [step, setStep] = useState('form');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const readError = (payload, fallback) => {
    if (payload?.message) return payload.message;
    const firstError = payload?.errors && Object.values(payload.errors)[0]?.[0];
    return firstError || fallback;
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setMessage('');

    if (!agree) {
      setErrorMessage('Vui lòng đồng ý điều khoản trước khi đăng ký.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Không thể gửi OTP đăng ký đối tác.'));
      }

      setMessage(payload.message || 'OTP đã được gửi đến email của bạn.');
      setStep('otp');
    } catch (error) {
      setErrorMessage(error.message || 'Không thể gửi OTP đăng ký đối tác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner/register/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readError(payload, 'Mã OTP không hợp lệ.'));
      }

      setMessage(payload.message || 'Đăng ký đối tác thành công.');
      setTimeout(() => {
        navigate('/partner-login', { replace: true });
      }, 900);
    } catch (error) {
      setErrorMessage(error.message || 'Mã OTP không hợp lệ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="left-panel">
        <div className="overlay"></div>

        <div className="phone-frame">
          <img src={bgImg} alt="Chợ Tới Cửa đối tác" />

          <div className="info-card">
            <div className="registerLogo">
              <i className="fa-solid fa-leaf"></i>
            </div>

            <h1>Chợ Tới Cửa</h1>

            <p className="desc">
              Nền tảng kết nối nông sản sạch từ nông trại đến tận cửa nhà. Trở thành đối tác
              ngay hôm nay để mở rộng kinh doanh của bạn.
            </p>

            <div className="feature">
              <span><i className="fa-regular fa-circle-check"></i></span>
              <div>
                <h4>Tiếp cận khách hàng mới</h4>
                <p>Hàng ngàn khách hàng tiềm năng mỗi ngày.</p>
              </div>
            </div>

            <div className="feature">
              <span><i className="fa-solid fa-arrow-trend-up"></i></span>
              <div>
                <h4>Tăng trưởng doanh thu</h4>
                <p>Giải pháp bán hàng trực tuyến hiệu quả.</p>
              </div>
            </div>

            <div className="feature">
              <span><i className="fa-solid fa-headphones"></i></span>
              <div>
                <h4>Hỗ trợ 24/7</h4>
                <p>Đội ngũ hỗ trợ luôn sẵn sàng đồng hành.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-wrapper">
          <h2>Đăng ký Đối tác</h2>

          <p className="sub-title">
            Điền thông tin để bắt đầu bán hàng trên Chợ Tới Cửa.
          </p>

          <form onSubmit={step === 'form' ? sendOtp : verifyOtp}>
            <div className="card">
              <div className="card-title">
                <i className="fa-solid fa-store"></i>
                Thông tin cửa hàng
              </div>

              <div className="form-group">
                <label>Tên siêu thị/cửa hàng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bách Hóa Xanh Lê Văn Chí"
                  value={form.store_name}
                  onChange={(event) => updateField('store_name', event.target.value)}
                  disabled={step === 'otp'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại hình kinh doanh</label>
                <select
                  value={form.business_type}
                  onChange={(event) => updateField('business_type', event.target.value)}
                  disabled={step === 'otp'}
                >
                  <option value="">Chọn loại hình</option>
                  <option value="supermarket">Siêu thị</option>
                  <option value="food_store">Cửa hàng thực phẩm</option>
                  <option value="farm">Nông trại</option>
                </select>
              </div>

              <div className="form-group">
                <label>Địa chỉ kinh doanh</label>
                <textarea
                  placeholder="Nhập địa chỉ chi tiết"
                  value={form.store_address}
                  onChange={(event) => updateField('store_address', event.target.value)}
                  disabled={step === 'otp'}
                ></textarea>
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <i className="fa-regular fa-user"></i>
                Thông tin liên hệ
              </div>

              <div className="form-group">
                <label>Họ tên người đại diện</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  disabled={step === 'otp'}
                  required
                />
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    placeholder="Nhập 10 số điện thoại"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    disabled={step === 'otp'}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email liên hệ</label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    disabled={step === 'otp'}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Tạo mật khẩu an toàn"
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    disabled={step === 'otp'}
                    minLength={8}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={form.password_confirmation}
                    onChange={(event) => updateField('password_confirmation', event.target.value)}
                    disabled={step === 'otp'}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {step === 'otp' && (
                <div className="form-group otp-group">
                  <label>Mã OTP</label>
                  <input
                    type="text"
                    placeholder="Nhập mã OTP 6 số"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                  <button type="button" className="resend-btn" onClick={sendOtp} disabled={isSubmitting}>
                    Gửi lại OTP
                  </button>
                </div>
              )}
            </div>

            {step === 'form' && (
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                />

                <label htmlFor="agree">
                  Tôi đã đọc và đồng ý với các <a href="#">Điều khoản sử dụng</a> và{' '}
                  <a href="#">Chính sách bảo mật</a> của Chợ Tới Cửa.
                </label>
              </div>
            )}

            {message && <p className="register-message success">{message}</p>}
            {errorMessage && <p className="register-message error">{errorMessage}</p>}

            <button className="submit-btn" disabled={isSubmitting}>
              {step === 'form'
                ? (isSubmitting ? 'Đang gửi OTP...' : 'Đăng ký Đối tác')
                : (isSubmitting ? 'Đang xác minh...' : 'Xác minh OTP')}
            </button>
          </form>

          <p className="login-link">
            Đã có tài khoản? <Link to="/partner-login">Đăng nhập ngay</Link>
          </p>

          <footer>
            © 2026 Chợ Tới Cửa. Nền tảng kết nối nông sản sạch.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default RegisterStore;
