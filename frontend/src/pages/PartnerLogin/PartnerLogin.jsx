import React, { useState } from 'react';
import './PartnerLogin.scss';

// Import Icons nếu bạn dùng thư viện như Lucide-React / React-Icons. 
// Nếu không, bạn có thể thay thế bằng các thẻ <img /> chứa mã SVG tương ứng.
import { Phone, Lock, Eye, EyeOff } from 'lucide-react'; 

const PartnerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log({ phone, password, rememberMe });
  };

  return (
    <div className="partner-login-page">
      <main className="main-content">
        <div className="login-card">
          
          {/* Left Side: Image / Branding */}
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

          {/* Right Side: Login Form */}
          <div className="form-side">
            <div className="form-header">
              <h1>Đăng nhập Đối tác</h1>
              <p>Vui lòng nhập thông tin để truy cập bảng điều khiển.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Phone Input */}
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <div className="input-container">
                  <span className="input-icon">
                    <Phone size={15} />
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
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
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember & Forgot Password */}
              <div className="remember-forgot-container">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot-password" className="forgot-password-link">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn">
                Đăng nhập
              </button>
            </form>

            {/* Register Footer */}
            <div className="form-footer">
              <p>
                Chưa có tài khoản đối tác?{' '}
                <a href="#register" className="register-link">
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PartnerLogin;