import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    setAuthMode(initialAuth);
  }, [initialAuth]);

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
