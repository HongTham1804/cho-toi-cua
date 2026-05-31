import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import './ProductDetail.css';

const productCatalog = [
  {
    id: '1',
    name: 'Cá Hồi Na Uy Tươi Cắt Lát (500g)',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=90',
    imageAlt: 'Miếng cá hồi Na Uy tươi cắt lát',
    rating: 4.8,
    reviewsCount: 128,
    sold: '1.2k',
    price: 395000,
    unit: 'Khay 500g',
    origin: 'Salmar, Na Uy',
    storage: '0 - 4°C trong 3 ngày',
    stock: 24,
    description:
      'Cá hồi nhập khẩu trực tiếp bằng đường hàng không từ Na Uy. Thịt cá có màu cam đào đặc trưng, những vân mỡ trắng xen kẽ đều đặn. Cực kỳ phù hợp để làm sashimi, áp chảo hoặc nướng. Đảm bảo độ tươi ngon ngọt tự nhiên nhất.',
  },
  {
    id: '2',
    name: 'Thịt Bò Úc Nhập Khẩu (300g)',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1400&q=90',
    imageAlt: 'Thịt bò tươi cắt lát',
    rating: 4.7,
    reviewsCount: 95,
    sold: '850',
    price: 250000,
    unit: 'Khay 300g',
    origin: 'Úc',
    storage: '-18°C',
    stock: 18,
    description:
      'Thịt bò nhập khẩu có độ mềm và vị ngọt tự nhiên, thích hợp làm bít tết, áp chảo hoặc nhúng lẩu. Sản phẩm được đóng gói kỹ và bảo quản lạnh theo tiêu chuẩn.',
  },
];

function formatCurrency(value) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = productCatalog.find((item) => item.id === id) || productCatalog[0];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartNotice, setCartNotice] = useState('');
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  function handleLogout(event) {
    event.preventDefault();

    const isConfirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');

    if (isConfirmed) {
      setIsMenuOpen(false);
      navigate('/select-role', { replace: true });
    }
  }

  function handleZoomMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoom({
      active: true,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  function updateQuantity(nextQuantity) {
    setQuantity(Math.max(1, Math.min(product.stock, nextQuantity)));
    setCartNotice('');
  }

  function handleAddToCart() {
    setCartNotice(`Đã thêm ${quantity} ${product.unit.toLowerCase()} vào giỏ hàng.`);
  }

  return (
    <div className="ctc-product-detail-page">
      <CustomerHeader onMenuClick={() => setIsMenuOpen(true)} />

      {isMenuOpen && (
        <div className="modal-overlay-core" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-modal-core" onClick={(event) => event.stopPropagation()}>
            <div className="user-profile-core">
              <i className="fa-solid fa-user-circle"></i>
              <h3>Chào, Khách hàng</h3>
            </div>
            <nav className="menu-links-core">
              <Link to="/logged-in-homepage" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-house"></i> Cửa hàng
              </Link>
              <Link to="/order-history" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-receipt"></i> Đơn hàng của bạn
              </Link>
              <Link to="/account-settings" onClick={() => setIsMenuOpen(false)}>
                <i className="fa-solid fa-gear"></i> Cài đặt tài khoản
              </Link>
              <a href="#" className="logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </a>
            </nav>
          </div>
        </div>
      )}

      <main className="ctc-product-detail">
        <section className="ctc-product-media" aria-label="Ảnh sản phẩm">
          <div
            className={`ctc-product-image-shell ${zoom.active ? 'is-zooming' : ''}`}
            onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))}
            onMouseMove={handleZoomMove}
            onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
          >
            <img src={product.image} alt={product.imageAlt} className="ctc-product-image" />
            <div
              className="ctc-product-image-zoom"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundPosition: `${zoom.x}% ${zoom.y}%`,
              }}
            />
          </div>
        </section>

        <section className="ctc-product-summary">
          <h1>{product.name}</h1>

          <div className="ctc-product-rating" aria-label={`${product.rating} sao`}>
            <span className="ctc-product-stars" aria-hidden="true">★★★★★</span>
            <span>({product.reviewsCount} Đánh giá)</span>
            <span className="ctc-product-dot" aria-hidden="true">•</span>
            <span>Đã bán {product.sold}</span>
          </div>

          <p className="ctc-product-price">{formatCurrency(product.price)}</p>
          <p className="ctc-product-note">Giá đã bao gồm thuế VAT. Đơn vị tính: {product.unit}.</p>

          <div className="ctc-product-info-grid" aria-label="Thông tin sản phẩm">
            <article className="ctc-product-info-card">
              <i className="fa-regular fa-map"></i>
              <div>
                <span>Xuất xứ</span>
                <strong>{product.origin}</strong>
              </div>
            </article>

            <article className="ctc-product-info-card">
              <i className="fa-regular fa-calendar"></i>
              <div>
                <span>Bảo quản</span>
                <strong>{product.storage}</strong>
              </div>
            </article>
          </div>

          <p className="ctc-product-description">{product.description}</p>

          <div className="ctc-product-purchase">
            <div className="ctc-product-quantity-row">
              <span>Số lượng:</span>
              <div className="ctc-product-quantity" aria-label="Chọn số lượng">
                <button
                  type="button"
                  aria-label="Giảm số lượng"
                  disabled={quantity <= 1}
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  −
                </button>
                <strong>{quantity}</strong>
                <button
                  type="button"
                  aria-label="Tăng số lượng"
                  disabled={quantity >= product.stock}
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <small>Còn {product.stock} khay</small>
            </div>

            <div className="ctc-product-actions">
              <button className="ctc-product-add-cart" type="button" onClick={handleAddToCart}>
                <i className="fa-solid fa-cart-shopping"></i>
                Thêm vào giỏ
              </button>
              <button
                className={`ctc-product-favorite ${isFavorite ? 'is-active' : ''}`}
                type="button"
                aria-label={isFavorite ? 'Bỏ khỏi sản phẩm yêu thích' : 'Thêm vào sản phẩm yêu thích'}
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((value) => !value)}
              >
                <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
              </button>
            </div>

            {cartNotice && (
              <p className="ctc-product-cart-notice" role="status" aria-live="polite">
                {cartNotice}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
