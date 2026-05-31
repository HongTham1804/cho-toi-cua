import React from 'react';
import { Link } from 'react-router-dom';
import './select-role.css';

// Import ảnh
import logoMain from '../../assets/logo-main.png';
import customerImg from '../../assets/toi-la-nguoi-mua.jpg'; 
import partnerImg from '../../assets/toi-la-doi-tac.jpg';   

export default function SelectRole() {
  return (
    <div className="select-role-page-core">
      {/* 1. LOGO CHÍNH GIỮA */}
      <div className="role-logo-wrap-core">
        <img src={logoMain} alt="Logo" className="role-main-logo-core" />
      </div>

      {/* 2. TIÊU ĐỀ CHÀO MỪNG */}
      <div className="role-intro-section-core">
        <h1 className="role-huge-title-core">Chào mừng đến với Chợ Tới Cửa</h1>
        <p className="role-subtitle-text-core">
          Vui lòng chọn vai trò của bạn để chúng tôi có thể mang<br />đến trải nghiệm tốt nhất.
        </p>
      </div>

      {/* 3. HAI KHUNG CHỌN VAI TRÒ */}
      <div className="role-cards-container-core">
        
        {/* THẺ NGƯỜI MUA */}
        <Link to="/guest-homepage" className="role-selection-card-core">
          <div className="role-card-banner-core">
            <img src={customerImg} alt="Người mua" />
          </div>
          <div className="role-card-info-core">
            <h2 className="role-card-head-core customer-color-core">
              <i className="fa-solid fa-basket-shopping"></i> Tôi muốn đi chợ
            </h2>
            <p className="role-card-paragraph-core">
              Mua sắm thực phẩm tươi sạch, an toàn từ các siêu thị và cửa hàng hàng đầu trực tiếp đến cửa nhà bạn.
            </p>
            <div className="role-card-link-core customer-color-core">
              Tiếp tục như Người mua <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </Link>

        {/* THẺ ĐỐI TÁC */}
        <Link to="/partner-login" className="role-selection-card-core">
          <div className="role-card-banner-core">
            <img src={partnerImg} alt="Đối tác" />
          </div>
          <div className="role-card-info-core">
            <h2 className="role-card-head-core partner-color-core">
              <i className="fa-solid fa-store"></i> Tôi là Đối tác
            </h2>
            <p className="role-card-paragraph-core">
              Mở rộng quy mô kinh doanh, quản lý cửa hàng dễ dàng và tiếp cận hàng ngàn khách hàng tiềm năng mỗi ngày.
            </p>
            <div className="role-card-link-core partner-color-core">
              Tiếp tục như Đối tác <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </Link>

      </div>

      {/* 4. FOOTER LINK */}
      <div className="role-bottom-link-core">
        <a href="#">Tìm hiểu thêm về nền tảng</a>
      </div>
    </div>
  );
}