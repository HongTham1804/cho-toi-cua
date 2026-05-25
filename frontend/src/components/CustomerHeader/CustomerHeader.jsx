import '@fortawesome/fontawesome-free/css/all.min.css';
import logoMain from '../../assets/logo-main.png'; // Chỉnh lại đường dẫn ảnh cho đúng nhé

export default function CustomerHeader({ onMenuClick }) {
  return (
    <header className="header-core">
      <div className="header-container">
        <i className="fa-solid fa-bars menu-trigger" onClick={onMenuClick}></i>

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

        <div className="header-icons">
          <div className="icon-item"><i className="fa-solid fa-location-dot"></i></div>
          <div className="icon-item"><i className="fa-solid fa-cart-shopping"></i></div>
          <div className="icon-item"><i className="fa-solid fa-bell"></i></div>
        </div>
      </div>
    </header>
  );
}
