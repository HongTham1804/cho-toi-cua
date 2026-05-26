import '@fortawesome/fontawesome-free/css/all.min.css';
import logoMain from '../../assets/logo-main.png'; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerHeader({ onMenuClick, onLoginClick, onRegisterClick, variant = 'customer' }) {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const isGuest = variant === 'guest';

    return (
    <header className={`header-core ${isGuest ? 'guest-header-core' : ''}`}>
      <div className="header-container">
        {!isGuest && <i className="fa-solid fa-bars menu-trigger" onClick={onMenuClick}></i>}

        <div className="header-logo">
          <img src={logoMain} alt="logo" className="logo-icon" />
          <span className="logo-text">Chợ Tới Cửa</span>
        </div>

        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            className="search-input"
          />
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </div>

        {isGuest ? (
          <div className="guest-auth-actions-core">
            {onLoginClick ? (
              <button
                type="button"
                className="guest-auth-btn-core guest-auth-btn-core--outline"
                onClick={onLoginClick}
              >
                Đăng nhập
              </button>
            ) : (
              <Link to="/login" className="guest-auth-btn-core guest-auth-btn-core--outline">
                Đăng nhập
              </Link>
            )}
            {onRegisterClick ? (
              <button
                type="button"
                className="guest-auth-btn-core guest-auth-btn-core--solid"
                onClick={onRegisterClick}
              >
                Đăng ký
              </button>
            ) : (
              <Link to="/select-role" className="guest-auth-btn-core guest-auth-btn-core--solid">
                Đăng ký
              </Link>
            )}
          </div>
        ) : (
          <div className="header-icons">
            <div className="icon-item" onClick={() => setIsAddressModalOpen(true)}>
            <i className="fa-solid fa-location-dot"></i>
            </div>
            <Link to="/shopping-cart" className="icon-item">
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
            <Link to="/notifications" className="icon-item">
              <i className="fa-solid fa-bell"></i>
            </Link>
          </div>
        )}
      </div>
      {!isGuest && isAddressModalOpen && (
        <div className="address-overlay-core" onClick={() => setIsAddressModalOpen(false)}>
          {/* Dùng stopPropagation để khi click vào khung trắng không bị đóng modal */}
          <div className="address-box-core" onClick={(e) => e.stopPropagation()}>
            <button className="address-close-btn-core" onClick={() => setIsAddressModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <h2 className="address-title-core">Chọn địa chỉ giao hàng</h2>
            
            <div className="address-search-core">
              <input type="text" placeholder="Nhập địa chỉ của bạn..." autoFocus />
              <i className="fa-solid fa-magnifying-glass search-icon-core"></i>
            </div>

            <div className="address-list-core">
              {/* Đây là giao diện ví dụ 1 địa chỉ, sau này bạn có thể dùng map() để render */}
              <div className="address-item-core">
                <i className="fa-solid fa-location-crosshairs target-icon-core"></i>
                <div className="address-info-core">
                  <h4>Sử dụng vị trí hiện tại</h4>
                </div>
              </div>
              <div className="address-item-core">
                <i className="fa-solid fa-building"></i>
                <div className="address-info-core">
                  <h4>Khu Công Nghệ Cao</h4>
                  <p>Thành phố Thủ Đức, TP. Hồ Chí Minh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
