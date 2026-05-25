import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer-core">
      <div className="footer-inner-core">
        
        {/* CỘT 1: Logo và Tagline */}
        <div className="footer-brand-core">
          <a href="/" className="footer-logo-core">
            <span className="logo-text-core">Chợ Tới Cửa</span>
          </a>
          <p className="footer-tagline-core">
            © 2026 Chợ Tới Cửa. Tươi ngon từ nông trại<br />đến tận cửa nhà.
          </p>
        </div>

        {/* CỘT 2: Khám phá */}
        <div className="footer-col-core">
          <h4 className="footer-col-title-core">Khám phá</h4>
          <ul className="footer-links-core">
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>

        {/* CỘT 3: Hỗ trợ */}
        <div className="footer-col-core">
          <h4 className="footer-col-title-core">Hỗ trợ</h4>
          <ul className="footer-links-core">
            <li><a href="#">Liên hệ hỗ trợ</a></li>
            <li><a href="#">Trung tâm giúp đỡ</a></li>
          </ul>
        </div>

        {/* CỘT 4: Pháp lý */}
        <div className="footer-col-core">
          <h4 className="footer-col-title-core">Pháp lý</h4>
          <ul className="footer-links-core">
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}