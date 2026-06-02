import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomerHeader from '../../components/CustomerHeader/CustomerHeader';
import { addCartItem } from '../../services/cartStorage';
import {
  addFavoriteProduct,
  fetchFavoriteProducts,
  removeFavoriteProduct,
} from '../../services/favoriteApi';
import { fetchProductById } from '../../services/productApi';
import './ProductDetail.css';

function formatCurrency(value) {
  return `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))}đ`;
}

function getStockLabel(product) {
  const stock = Number(product?.stock || 0);

  if (!product?.isAvailable || stock <= 0) {
    return 'Hết hàng';
  }

  return `Còn ${stock} sản phẩm`;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteSaving, setIsFavoriteSaving] = useState(false);
  const [cartNotice, setCartNotice] = useState('');
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    let isMounted = true;

    Promise.all([
      fetchProductById(id),
      fetchFavoriteProducts().catch(() => []),
    ])
      .then(([apiProduct, favoriteProducts]) => {
        if (!isMounted) return;
        setProduct(apiProduct);
        setQuantity(apiProduct.isAvailable ? 1 : 0);
        setIsFavorite(favoriteProducts.some((favorite) => String(favorite.id) === String(apiProduct.id)));
      })
      .catch(() => {
        if (!isMounted) return;
        setProduct(null);
        setError('Không lấy được chi tiết sản phẩm từ backend.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

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
    if (!product) return;

    const maxQuantity = Number(product.stock || 0);
    const safeQuantity = maxQuantity > 0 ? Math.max(1, Math.min(maxQuantity, nextQuantity)) : 0;
    setQuantity(safeQuantity);
    setCartNotice('');
  }

  function handleAddToCart() {
    if (!product || !product.isAvailable || quantity <= 0) return;

    Array.from({ length: quantity }).forEach(() => addCartItem(product));
    setCartNotice(`Đã thêm ${quantity} ${product.unit.toLowerCase()} vào giỏ hàng.`);
  }

  async function handleToggleFavorite() {
    if (!product) return;

    setIsFavoriteSaving(true);
    setCartNotice('');

    try {
      if (isFavorite) {
        await removeFavoriteProduct(product.id);
        setIsFavorite(false);
        setCartNotice('Đã xóa sản phẩm khỏi danh sách yêu thích.');
        return;
      }

      await addFavoriteProduct(product.id);
      setIsFavorite(true);
      navigate('/favorite-products');
    } catch (favoriteError) {
      setCartNotice(favoriteError.message || 'Không thể cập nhật sản phẩm yêu thích.');
    } finally {
      setIsFavoriteSaving(false);
    }
  }

  const hasProduct = Boolean(product);
  const pageError = id ? error : 'Không tìm thấy sản phẩm cần xem.';
  const stockLabel = hasProduct ? getStockLabel(product) : '';
  const isPurchasable = Boolean(product?.isAvailable);
  const routeStoreId = Number(
    new URLSearchParams(location.search).get('store_id') ||
    location.state?.storeId ||
    location.state?.store_id ||
    product?.store_id
  );
  const storeDetailUrl = routeStoreId ? `/supermarket-details?store_id=${routeStoreId}` : '';

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

      {isLoading && (
        <main className="ctc-product-detail-state">
          <p>Đang tải chi tiết sản phẩm...</p>
        </main>
      )}

      {!isLoading && pageError && (
        <main className="ctc-product-detail-state">
          <i className="fa-solid fa-box-open"></i>
          <p>{pageError}</p>
          <button type="button" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </main>
      )}

      {!isLoading && hasProduct && (
        <main className="ctc-product-detail">
          <section className="ctc-product-media" aria-label="Ảnh sản phẩm">
            <div
              className={`ctc-product-image-shell ${zoom.active ? 'is-zooming' : ''}`}
              onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))}
              onMouseMove={handleZoomMove}
              onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
            >
              <img src={product.image} alt={product.name} className="ctc-product-image" />
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
            {storeDetailUrl && (
              <Link to={storeDetailUrl} className="ctc-product-store-link">
                <i className="fa-solid fa-store"></i>
                {product.storeName || 'Xem siêu thị đang bán'}
              </Link>
            )}

            <div className="ctc-product-rating" aria-label="Chưa có đánh giá">
              <span className="ctc-product-stars" aria-hidden="true">★★★★★</span>
              <span>Chưa có đánh giá</span>
            </div>

            <p className="ctc-product-price">{formatCurrency(product.price)}</p>
            <p className="ctc-product-note">Giá đã bao gồm thuế VAT. Đơn vị tính: {product.unit}.</p>

            <div className="ctc-product-info-grid" aria-label="Thông tin sản phẩm">
              <article className="ctc-product-info-card">
                <i className="fa-regular fa-calendar"></i>
                <div>
                  <span>Bảo quản</span>
                  <strong>{product.storage}</strong>
                </div>
              </article>
            </div>

            <p className="ctc-product-description">{product.description || 'Sản phẩm chưa có mô tả.'}</p>

            <div className="ctc-product-purchase">
              <div className="ctc-product-quantity-row">
                <span>Số lượng:</span>
                <div className="ctc-product-quantity" aria-label="Chọn số lượng">
                  <button
                    type="button"
                    aria-label="Giảm số lượng"
                    disabled={!isPurchasable || quantity <= 1}
                    onClick={() => updateQuantity(quantity - 1)}
                  >
                    −
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    aria-label="Tăng số lượng"
                    disabled={!isPurchasable || quantity >= product.stock}
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <small>{stockLabel}</small>
              </div>

              <div className="ctc-product-actions">
                <button
                  className="ctc-product-add-cart"
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isPurchasable || quantity <= 0}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  {isPurchasable ? 'Thêm vào giỏ' : 'Hết hàng'}
                </button>
                <button
                  className={`ctc-product-favorite ${isFavorite ? 'is-active' : ''}`}
                  type="button"
                  aria-label={isFavorite ? 'Bỏ khỏi sản phẩm yêu thích' : 'Thêm vào sản phẩm yêu thích'}
                  aria-pressed={isFavorite}
                  onClick={handleToggleFavorite}
                  disabled={isFavoriteSaving}
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
      )}
    </div>
  );
}
