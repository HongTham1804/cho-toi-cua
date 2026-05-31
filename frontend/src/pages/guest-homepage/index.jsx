import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Bổ sung axios để kết nối API Backend
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import Footer from '../../components/Footer/Footer';
import heroImage from '../../assets/ảnh nền.jpg';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import coopmartLogo from '../../assets/logos/Coopmart.jpg';
import lottemartLogo from '../../assets/logos/Lottemart.webp';
import './guest-homepage.css';

const partnerStores = [
  { id: 1, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
  { id: 2, name: 'Bách Hóa Xanh', time: '20-25 phút', image: bachHoaXanhLogo },
  { id: 3, name: 'Bách Hóa Xanh', time: '10-15 phút', image: bachHoaXanhLogo },
  { id: 4, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
  { id: 5, name: 'WinMart', time: '15-20 phút', image: winmartLogo },
  { id: 6, name: 'Co.op Mart', time: '20-25 phút', image: coopmartLogo },
  { id: 7, name: 'Lotte Mart', time: '10-15 phút', image: lottemartLogo },
  { id: 8, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
];

export default function GuestHomepage({ initialAuth = null }) {
  const [authMode, setAuthMode] = useState(initialAuth);
  const isRegisterOpen = authMode === 'register';
  const isLoginOpen = authMode === 'login';

  // --- THÀNH PHẦN BỔ SUNG: STATE QUẢN LÝ SẢN PHẨM & BỘ LỌC ĐÚNG ĐỀ BÀI ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Mặc định: Mới nhất

  const categories = ['Tất cả', 'Rau củ', 'Thịt', 'Đồ khô', 'Trái cây'];

  useEffect(() => {
    setAuthMode(initialAuth);
  }, [initialAuth]);

  // --- THÀNH PHẦN BỔ SUNG: GỌI API LẤY SẢN PHẨM TỪ LARAVEL ---
  useEffect(() => {
    const fetchGuestProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        const data = response.data.data || response.data;
        // Khách hàng chỉ xem các sản phẩm được kích hoạt "Đang bán" (hoặc không set trạng thái ẩn)
        const activeProducts = data.filter(p => p.status === 'Đang bán' || !p.status);
        setProducts(activeProducts);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm trang khách:", error);
      }
    };
    fetchGuestProducts();
  }, []);

  // --- THÀNH PHẦN BỔ SUNG: XỬ LÝ BỘ LỌC (FILTER) VÀ TÌM KIẾM (SEARCH) NÂNG CAO ---
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Thực hiện Lọc (Filter) dữ liệu trước
    let result = products.filter((product) => {
      const name = product.name ? product.name.toLowerCase() : '';
      const price = Number(product.price || 0);

      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
      
      // Lọc theo khoảng giá (Chỉ lọc nếu người dùng có nhập số)
      const matchesMinPrice = minPrice === '' || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    // 2. Thực hiện Sắp xếp (Sort) theo tiêu chí chọn lựa
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price)); // Giá tăng dần
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price)); // Giá giảm dần
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id); // Mới nhất lên đầu (Dựa vào ID tự tăng)
    }

    return result;
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, sortBy]);

  return (
    <div className="guest-home-page">
      <CustomerHeader
        variant="guest"
        onLoginClick={() => setAuthMode('login')}
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

        {/* SECTION SIÊU THỊ ĐỐI TÁC */}
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

        {/* ========================================================================= */}
        {/* THÀNH PHẦN BỔ SUNG MỚI: TOÀN BỘ CỤM BỘ LỌC & TÌM KIẾM SẢN PHẨM TRANG CHỦ KHACH */}
        {/* ========================================================================= */}
        <section className="guest-marketplace" style={{ marginTop: '50px' }}>
          <div className="guest-section-head">
            <h2>Sản phẩm tươi ngon hôm nay</h2>
          </div>

          {/* Thanh công cụ lọc đa năng */}
          <div className="guest-filter-controls" style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
              {/* Tìm kiếm tên */}
              <div className="search-input-box" style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="🔍 Tìm sản phẩm theo tên..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Lọc khoảng giá */}
              <div className="price-filter-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Khoảng giá (VND):</span>
                <input 
                  type="number" 
                  placeholder="Từ giá" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '110px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Đến giá" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '110px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {/* Sắp xếp giá / thời gian */}
              <div className="sort-filter-box">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: '500' }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Lọc theo Tabs danh mục */}
            <div className="category-tab-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === cat ? '#10b981' : '#f1f5f9',
                    color: selectedCategory === cat ? '#fff' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ô lưới hiển thị sản phẩm dạng Card của Khách */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="guest-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredAndSortedProducts.map((product) => (
                <article 
                  className="guest-product-card" 
                  key={product.id} 
                  style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}
                >
                  <div style={{ height: '180px', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>Hình ảnh sản phẩm</span>
                    )}
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                      {product.category || 'Rau củ'}
                    </span>
                  </div>
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'between' }}>
                    <h3 style={{ fontSize: '15px', margin: '0 0 10px 0', color: '#1e293b', fontWeight: '600' }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '16px' }}>
                        {Number(product.price || 0).toLocaleString()}đ
                      </span>
                      <button type="button" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                        Chọn mua
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlignment: 'center', padding: '40px', background: '#fff', borderRadius: '8px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc tìm kiếm của bạn.
            </div>
          )}
        </section>
      </main>

      <Footer />

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setAuthMode(null)}
          onShowLogin={() => setAuthMode('login')}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setAuthMode(null)}
          onShowRegister={() => setAuthMode('register')}
        />
      )}
    </div>
  );
}

// ==========================================
// CÁC HÀM MODAL GIỮ NGUYÊN KHÔNG THAY ĐỔI
// ==========================================
function RegisterModal({ onClose, onShowLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
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
              <input type="text" placeholder="Nhập họ và tên của bạn" required />
            </span>
          </label>

          <label>
            Số điện thoại
            <span className="guest-register-field">
              <i className="fa-solid fa-phone"></i>
              <input type="tel" placeholder="Nhập số điện thoại" required />
            </span>
          </label>

          <label>
            Email
            <span className="guest-register-field">
              <i className="fa-regular fa-envelope"></i>
              <input type="email" placeholder="example@gmail.com" required />
            </span>
          </label>

          <label>
            Mật khẩu
            <span className="guest-register-field guest-register-field--password">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ít nhất 8 ký tự"
                minLength="8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </span>
          </label>

          <button className="guest-register-submit" type="submit">
            Đăng ký <i className="fa-solid fa-arrow-right"></i>
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

function LoginModal({ onClose, onShowRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
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
          <label>
            Số điện thoại
            <span className="guest-register-field">
              <i className="fa-solid fa-phone"></i>
              <input type="tel" placeholder="Nhập số điện thoại" required />
            </span>
          </label>

          <label>
            Mật khẩu
            <a className="guest-login-forgot" href="#">Quên mật khẩu?</a>
            <span className="guest-register-field guest-register-field--password">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </span>
          </label>

          <div className="guest-login-location-group">
            <p className="guest-login-section-title">Địa chỉ hiện tại</p>
            <button className="guest-location-card" type="button">
              <span className="guest-location-icon">
                <i className="fa-solid fa-location-crosshairs"></i>
              </span>
              <span>
                <strong>Cập nhật vị trí</strong>
                <small>Sử dụng vị trí hiện tại của bạn</small>
              </span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <button className="guest-register-submit" type="submit">
            Đăng nhập <i className="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>

        <p className="guest-register-login">
          Chưa có tài khoản? <button type="button" onClick={onShowRegister}>Đăng ký ngay</button>
        </p>
      </section>
    </div>
  );
}