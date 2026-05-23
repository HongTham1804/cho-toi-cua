import React, { useState } from 'react';
import './supermarket-details.css';
import logoMain from '../../assets/logo-main.png';
import bannerWinmart from '../../assets/bannerwinmart.webp';
import '@fortawesome/fontawesome-free/css/all.min.css'
import logoWinmart from '../../assets/logos/Winmart.jpg';
import tom_the from '../../assets/tôm thẻ.webp';
import tao_gala from '../../assets/táo gala.webp';
export default function SupermarketDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    'Tất cả sản phẩm',
    'Rau cu quả',
    'Thịt, Cá, Hải sản',
    'Sữa & Trứng',
    'Bột ưng',
    'Bột lúa mì'
  ];

  const coupons = [
    { discount: '-10%', code: 'NSC-3029' },
    { discount: '-30%', code: 'NSC-3020' },
    { discount: '-25%', code: 'NSC-3021' }
  ];

  const products = [
    { name: 'Bộ cát bơi độc lạ 500g', price: '88,000đ', original: '178,000đ', discount: '-50%' },
    { name: 'Nhà cung ứng hàng hóa Quốc tế 500g', price: '180,000đ', original: '280,000đ', discount: '-35%' },
    { name: 'Rau cải xanh ớt chuối (thái cắt) 3 bộ', price: '120,000đ', original: '', discount: '' },
    { name: 'Sườn non nạc (Meatbutt) chuẩn 450g', price: '118,000đ', original: '', discount: '' },
    { name: 'Rau Xoăn Mix VietGAP gói 200g', price: '26,000đ', original: '', discount: '' },
    { name: 'Sữa tươi UHT Hình Vinamilk 100% không đường hộp 1L', price: '35,000đ', original: '', discount: '' },
    { name: 'Bộ cái xanh ớt Lúa (thái cắt) 3', price: '120,000đ', original: '', discount: '' },
    { name: 'Óp BT28 Ông Cua tây Món chém hàng tủ 5kg', price: '190,000đ', original: '', discount: '' },
  ];

  return (
    <div className="supermarket-wrapper">
      {/* --- HEADER (Giữ nguyên) --- */}
      <header className="header-core">
        <div className="header-container">
          <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="header-logo">
            <img src={logoMain} alt="logo" className="logo-icon" />
            <span className="logo-text">Chợ Tới Cửa</span>
          </div>
          <div className="search-bar-wrapper">
            <input type="text" placeholder="Tìm kiếm sản phẩm tại WinMart..." className="search-input" />
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
          </div>
          <div className="header-icons">
             <div className="icon-item"><i className="fa-solid fa-location-dot"></i></div>
             <div className="icon-item"><i className="fa-solid fa-cart-shopping"></i></div>
             <div className="icon-item"><i className="fa-solid fa-bell"></i></div>
          </div>
        </div>
      </header>

      {/* --- CẤU TRÚC BODY MỚI TRẢI DÀI --- */}
      <div className="supermarket-main-container">
        
        {/* 1. Banner & Shop Info Card */}
        <div className="shop-header-section">
          <div className="supermarket-banner-large">
            <img src={bannerWinmart} alt="banner" />
          </div>
          
          {/* Card thông tin Shop đè lên banner */}
          <div className="shop-info-card">
            <div className="shop-logo-box">
              <img src={logoWinmart} alt="logo" />
            </div>
            <div className="shop-detail-text">
              <h1>WinMart - Landmark 81</h1>
              <div className="shop-meta">
                <span>⭐ 4.8 (2k+ đánh giá)</span>
                <span>•</span>
                <span>07:00 - 22:00</span>
                <span className="status-badge">Đang mở cửa</span>
              </div>
              <p className="shop-address">📍 Tầng B1, Landmark 81, Vinhomes Central Park</p>
            </div>
          </div>
        </div>

        {/* 2. Mã giảm giá của Shop */}
        <section className="section-container">
          <h2>Mã giảm giá của Shop</h2>
          <div className="coupon-scroll-wrapper">
            <div className="coupon-card-custom freeship">
               <div className="coupon-left">Free ship</div>
               <div className="coupon-right">
                  <p className="cp-title">Giảm 15k phí ship</p>
                  <p className="cp-sub">Đơn tối thiểu 150k</p>
                  <button className="btn-save-cp">Lưu</button>
               </div>
            </div>
            {coupons.map((coupon, index) => (
              <div key={index} className="coupon-card-custom discount">
                 <div className="coupon-left">{coupon.discount}</div>
                 <div className="coupon-right">
                    <p className="cp-title">Giảm {coupon.discount} tối đa 50k</p>
                    <p className="cp-sub">HSD: 30/11</p>
                    <button className="btn-save-cp">Lưu</button>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Danh mục sản phẩm */}
        {/* --- KHU VỰC 2 CỘT: DANH MỤC (TRÁI) VÀ SẢN PHẨM (PHẢI) --- */}
        <div className="supermarket-content-layout">
          
          {/* CỘT TRÁI: DANH MỤC DỌC */}
          <aside className="sidebar-categories">
            <h2>Danh mục</h2>
            <ul className="category-vertical-list">
              {categories.map((cat, index) => (
                <li 
                  key={index} 
                  /* Kiểm tra xem index hiện tại có khớp với state không, nếu khớp thì tô xanh */
                  className={activeCategory === index ? "active" : ""}
                  /* Bắt sự kiện click để cập nhật lại state */
                  onClick={() => setActiveCategory(index)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* CỘT PHẢI: KHU VỰC SẢN PHẨM */}
          <div className="main-products-area">
            
          {/* 1. Giờ Vàng Giá Sốc */}
            <section className="flash-sale-section">
              <div className="flash-sale-header">
                <h2>⚡ Giờ Vàng Giá Sốc <span className="countdown">02 : 15 : 30</span></h2>
                {/* Đã xóa thẻ <a> chứa chữ "Xem tất cả" ở đây */}
              </div>
              
              <div className="flash-sale-grid">
                {/* Tôi đổi thành lấy 4 sản phẩm (slice(0, 4)) để nó lấp đầy 1 hàng 4 cột cho đẹp nhé */}
                {products.slice(0, 4).map((product, index) => (
                  <div key={index} className="flash-product-card">
                    <span className="discount-badge">{product.discount || '-50%'}</span>
                    <div className="p-img-flash">
                      <img src={tom_the} alt="Product" />
                    </div>
                    <div className="p-info-flash">
                      <h3>{product.name}</h3>
                      <div className="price-box">
                        <span className="p-price">{product.price}</span>
                        <span className="p-original">{product.original}</span>
                      </div>
                      {/* Thanh phần trăm đã bán */}
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: '60%' }}></div>
                        <span className="progress-text">Đã bán 60%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thêm nút Xem thêm sản phẩm nằm ở dưới cùng */}
              <div className="load-more-container">
                <button className="btn-load-more">Xem thêm sản phẩm</button>
              </div>
            </section>

            {/* 2. Tất cả sản phẩm */}
            <section className="all-products-section">
              <div className="all-products-header">
                <h2>Tất cả sản phẩm</h2>
                <div className="sort-dropdown">
                  <span>Sắp xếp: </span>
                  <select>
                    <option>Bán chạy nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao xuống thấp</option>
                  </select>
                </div>
              </div>
              
              <div className="product-grid-custom">
                {/* Hiển thị các sản phẩm còn lại */}
                {products.slice(2).map((product, index) => (
                  <div key={index} className="product-card-v2">
                    <div className="p-img">
                      <img src={tao_gala} alt="Product" />
                    </div>
                    <div className="p-info">
                      <h3>{product.name}</h3>
                      <p className="p-price">{product.price}</p>
                      <button className="btn-add-cart">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút xem thêm */}
              <div className="load-more-container">
                <button className="btn-load-more">Xem thêm sản phẩm</button>
              </div>
            </section>

          </div>
        </div>
      </div>
    {/* ... (Các code sản phẩm ở trên) ... */}
        

      {/* =========================================
          THÊM FOOTER VÀO ĐÂY
      ========================================= */}
      <footer className="footer-core">
        <div className="footer-container">
          
          <div className="footer-top">
            {/* Cột 1: Logo và Slogan */}
            <div className="footer-brand">
              <h2>Chợ Tới Cửa</h2>
              <p>Tươi ngon từ nông trại đến tận cửa nhà.</p>
            </div>
            
            {/* Cột 2: Cụm link 1 */}
            <div className="footer-links">
              <ul>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Chính sách bảo mật</a></li>
              </ul>
            </div>
            
            {/* Cột 3: Cụm link 2 */}
            <div className="footer-links">
              <ul>
                <li><a href="#">Điều khoản sử dụng</a></li>
                <li><a href="#">Tải ứng dụng</a></li>
              </ul>
            </div>
          </div>

          {/* Đường kẻ ngang */}
          <div className="footer-divider"></div>

          {/* Dòng bản quyền dưới cùng */}
          <div className="footer-bottom">
            <p>© 2026 Chợ Tới Cửa. Tươi ngon từ nông trại đến tận cửa nhà.</p>
          </div>
          
        </div>
      </footer>
    </div>
  );
}
