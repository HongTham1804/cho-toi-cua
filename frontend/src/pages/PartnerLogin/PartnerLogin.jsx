import React, { useState } from 'react';
import { FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './PartnerLogin.scss';

const PartnerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="partner-login-page">
      <div className="login-card">
        
        {/* CỘT TRÁI: Hình ảnh & Thương hiệu */}
        <div className="login-left">
          <div className="overlay"></div>
          <div className="branding-content">
            <h1 className="logo">Chợ Tới Cửa</h1>
            <div className="slogan">
              <h2>Trở thành đối tác cung cấp</h2>
              <p>Kết nối nông sản sạch của bạn trực tiếp đến hàng ngàn gia đình mỗi ngày.</p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Form Đăng nhập */}
        <div className="login-right">
          <div className="form-header">
            <h1>Đăng nhập Đối tác</h1>
            <p>Vui lòng nhập thông tin để truy cập bảng điều khiển.</p>
          </div>

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            {/* Nhập số điện thoại */}
            <div className="input-group">
              <label>Số điện thoại</label>
              <div className="input-wrapper">
                <FiPhone className="input-icon" />
                <input type="text" placeholder="Nhập số điện thoại" />
              </div>
            </div>

            {/* Nhập mật khẩu */}
            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Nhập mật khẩu" 
                />
                <button 
                  type="button" 
                  className="btn-eye" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Ghi nhớ & Quên mật khẩu */}
            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>

            {/* Nút Submit */}
            <button type="submit" className="btn-submit">Đăng nhập</button>
          </form>

          {/* Footer Form */}
          <div className="form-footer">
            <p>Chưa có tài khoản đối tác? <a href="#">Đăng ký ngay</a></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnerLogin;