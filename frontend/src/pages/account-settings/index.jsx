import React from 'react';
import { Link } from 'react-router-dom';
import './account-settings.css';

export default function AccountSettings() {
  return (
    <div className="settings-page-core">
      <div className="settings-container-core">
        
        {/* Nút Quay lại (Back) */}
        <div className="settings-header-core">
          <Link to="/logged-in-homepage" className="back-btn-core">
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <h1 className="settings-title-core">Cài đặt tài khoản</h1>
        </div>

        <div className="settings-layout-core">
          {/* NỘI DUNG CHÍNH (Bây giờ sẽ chiếm trọn chiều rộng) */}
          <main className="settings-main-content-core">
            
            {/* Section 1: Thông tin tài khoản */}
            <section className="settings-card-core">
              <h3>Thông tin tài khoản</h3>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Địa chỉ Email</label>
                  <p>nguyenvana@gmail.com</p>
                </div>
                <button className="edit-link-core">Thay đổi</button>
              </div>
            </section>

            {/* Section 2: Thông tin cá nhân */}
            <section className="settings-card-core">
              <h3>Thông tin cá nhân</h3>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Họ và tên</label>
                  <p>Nguyễn Văn A</p>
                </div>
                <button className="edit-link-core">Thay đổi</button>
              </div>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Số điện thoại</label>
                  <p>090 123 4567</p>
                </div>
                <button className="edit-link-core">Xác minh</button>
              </div>
            </section>

            {/* Section 3: Cài đặt thông báo */}
            <section className="settings-card-core">
              <h3>Cài đặt thông báo</h3>
              <div className="settings-row-core">
                <div className="info-group-core">
                  <label>Thông báo qua Email</label>
                  <p>Nhận cập nhật về đơn hàng và khuyến mãi</p>
                </div>
                <label className="switch-core">
                  <input type="checkbox" defaultChecked />
                  <span className="slider-core"></span>
                </label>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}