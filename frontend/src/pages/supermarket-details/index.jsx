import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './supermarket-details.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { addCartItem } from '../../services/cartStorage';
import { fetchCategories, fetchProducts, fetchStores } from '../../services/productApi';
import winmartBanner from '../../assets/bannerwinmart.webp';
import bachHoaXanhBanner from '../../assets/bachhoaxanhbia.png';
import goBanner from '../../assets/gobia.jpeg';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import goLogo from '../../assets/logos/GO.png';

const DEFAULT_CATEGORY = 'Tất cả sản phẩm';

const getStoreLogo = (store) => {
  if (store?.logo_url?.includes('Winmart') || store?.name?.includes('WinMart')) return winmartLogo;
  if (store?.logo_url?.includes('GO') || store?.name?.includes('GO')) return goLogo;
  return bachHoaXanhLogo;
};

const getStoreBanner = (store) => {
  if (store?.name?.includes('GO')) return goBanner;
  if (store?.name?.includes('Bách Hóa Xanh')) return bachHoaXanhBanner;
  return winmartBanner;
};

const getStoreBannerClass = (store) =>
  `supermarket-banner-large ${store?.name?.includes('GO') ? 'supermarket-banner-large--go' : ''}`;

const getDeliveryTime = (storeId) => (Number(storeId) === 3 ? '20-25 phút' : '15-20 phút');

const isStoreOpenNow = (date = new Date()) => {
  const hour = date.getHours();
  return hour >= 7 && hour < 22;
};

const coupons = [
  { discount: '-10%', title: 'Giảm 10% tối đa 50k', sub: 'HSD: 30/11' },
  { discount: '-30%', title: 'Giảm 30% cho đơn rau củ', sub: 'HSD: 30/11' },
  { discount: '-25%', title: 'Giảm 25% cho đơn từ 300k', sub: 'HSD: 30/11' },
];

const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')}đ`;

const formatCountdown = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(' : ');
};

const SAFE_FIT_PRODUCT_NAMES = new Set([
  'Rau cải xanh VietGAP 500g',
  'Rau muống sạch bó 400g',
  'Dưa leo baby túi 500g',
  'Cà rốt Đà Lạt 500g',
  'Nước suối Lavie chai 1.5L',
  'Nước rửa tay Lifebuoy 450g',
  'Snack khoai tây vị tự nhiên 160g',
]);

const getProductImageBoxClass = (product) =>
  `p-img ${SAFE_FIT_PRODUCT_NAMES.has(product.name) ? 'p-img--safe-fit' : ''}`;

const getFlashImageBoxClass = (product) =>
  `p-img-flash ${SAFE_FIT_PRODUCT_NAMES.has(product.name) ? 'p-img-flash--safe-fit' : ''}`;

export default function SupermarketDetails() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [sortMode, setSortMode] = useState('best-seller');
  const [flashVisibleCount, setFlashVisibleCount] = useState(4);
  const [productVisibleCount, setProductVisibleCount] = useState(8);
  const [countdownSeconds, setCountdownSeconds] = useState(2 * 3600 + 15 * 60 + 30);
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(() => isStoreOpenNow());
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const storeId = Number(searchParams.get('store_id') || location.state?.store_id || 1);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchStores(), fetchCategories()])
      .then(([apiStores, apiCategories]) => {
        if (!isMounted) return;
        setStore(apiStores.find((item) => Number(item.id) === storeId) || apiStores[0] || null);
        setCategories([DEFAULT_CATEGORY, ...apiCategories.map((category) => category.name)]);
      })
      .catch(() => {
        if (!isMounted) return;
        setStore(null);
        setCategories([DEFAULT_CATEGORY]);
      });

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingProducts(true);
    setProductError('');
    fetchProducts({ storeId })
      .then((apiProducts) => {
        if (!isMounted) return;
        setProducts(apiProducts);
      })
      .catch(() => {
        if (!isMounted) return;
        setProducts([]);
        setProductError('Không lấy được sản phẩm từ backend. Bạn hãy chạy Docker/Laravel API rồi seed database.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  useEffect(() => {
    setFlashVisibleCount(4);
    setProductVisibleCount(8);
  }, [storeId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdownSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateStoreStatus = () => setIsStoreOpen(isStoreOpenNow());

    updateStoreStatus();
    const timer = window.setInterval(updateStoreStatus, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  const flashProducts = useMemo(
    () => products.filter((product) => product.flashSale),
    [products]
  );

  const sortedProducts = useMemo(() => {
    const productsByCategory =
      activeCategory === DEFAULT_CATEGORY
        ? products
        : products.filter((product) => product.category === activeCategory);

    return [...productsByCategory]
      .sort((first, second) => {
        if (sortMode === 'price-asc') return first.price - second.price;
        if (sortMode === 'price-desc') return second.price - first.price;
        return first.sequence - second.sequence;
      });
  }, [activeCategory, products, sortMode]);

  const visibleFlashProducts = flashProducts.slice(0, flashVisibleCount);
  const visibleProducts = sortedProducts.slice(0, productVisibleCount);
  const hasMoreFlashProducts = flashVisibleCount < flashProducts.length;
  const hasMoreProducts = productVisibleCount < sortedProducts.length;

  const handleLoadMoreFlashProducts = () => {
    setFlashVisibleCount((count) => Math.min(count + 4, flashProducts.length));
  };

  const handleLoadMoreProducts = () => {
    setProductVisibleCount((count) => Math.min(count + 8, sortedProducts.length));
  };

  const handleAddToCart = (product) => {
    addCartItem(product);
  };

  useEffect(() => {
    setProductVisibleCount(8);
  }, [activeCategory, products, sortMode]);

  return (
    <div className="supermarket-wrapper">
      <div className="supermarket-main-container">
        <div className="shop-header-section">
          <div className={getStoreBannerClass(store)}>
            <img src={getStoreBanner(store)} alt={`${store?.name || 'Siêu thị'} banner`} />
          </div>

          <div className="shop-info-card">
            <div className="shop-logo-box">
              <img src={getStoreLogo(store)} alt={store?.name || 'Siêu thị'} />
            </div>
            <div className="shop-detail-text">
              <h1>{store?.name || 'Đang tải siêu thị'}</h1>
              <div className="shop-meta">
                <span>⭐ 4.8 (2k+ đánh giá)</span>
                <span>•</span>
                <span>07:00 - 22:00</span>
                <span>•</span>
                <span>{getDeliveryTime(storeId)}</span>
                <span className={`status-badge ${isStoreOpen ? 'open' : 'closed'}`}>
                  {isStoreOpen ? 'Đang mở cửa' : 'Đang đóng cửa'}
                </span>
              </div>
              <p className="shop-address">📍 {store?.address || 'Đang tải địa chỉ'}</p>
            </div>
          </div>
        </div>

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
            {coupons.map((coupon) => (
              <div key={coupon.title} className="coupon-card-custom discount">
                <div className="coupon-left">{coupon.discount}</div>
                <div className="coupon-right">
                  <p className="cp-title">{coupon.title}</p>
                  <p className="cp-sub">{coupon.sub}</p>
                  <button className="btn-save-cp">Lưu</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="supermarket-content-layout">
          <aside className="sidebar-categories">
            <h2>Danh mục</h2>
            <ul className="category-vertical-list">
              {categories.map((category) => (
                <li
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          <div className="main-products-area">
            <section className="flash-sale-section">
              <div className="flash-sale-header">
                <h2>
                  ⚡ Giờ Vàng Giá Sốc <span className="countdown">{formatCountdown(countdownSeconds)}</span>
                </h2>
              </div>

              <div className="flash-sale-grid">
                {visibleFlashProducts.map((product) => (
                  <div key={product.id} className="flash-product-card">
                    <span className="discount-badge">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                    <div className={getFlashImageBoxClass(product)}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="p-info-flash">
                      <h3>{product.name}</h3>
                      <div className="price-box">
                        <span className="p-price">{formatPrice(product.price)}</span>
                        <span className="p-original">{formatPrice(product.originalPrice)}</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: '60%' }}></div>
                        <span className="progress-text">Đã bán 60%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreFlashProducts && (
                <div className="load-more-container">
                  <button className="btn-load-more" onClick={handleLoadMoreFlashProducts}>
                    Xem thêm sản phẩm
                  </button>
                </div>
              )}
            </section>

            <section className="all-products-section">
              <div className="all-products-header">
                <h2>
                  {activeCategory}
                  {isLoadingProducts && <span className="products-loading-note">Đang tải...</span>}
                </h2>
                <div className="sort-dropdown">
                  <span>Sắp xếp: </span>
                  <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                    <option value="best-seller">Bán chạy nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao xuống thấp</option>
                  </select>
                </div>
              </div>

              <div className="product-grid-custom">
                {productError && <p className="products-error-note">{productError}</p>}
                {visibleProducts.map((product) => (
                  <div key={product.id} className="product-card-v2">
                    <div className={getProductImageBoxClass(product)}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="p-info">
                      <h3>{product.name}</h3>
                      <div className="product-price-stack">
                        <p className="p-price">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="p-original">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                      <button
                        className="btn-add-cart"
                        onClick={() => handleAddToCart(product)}
                        title="Thêm vào giỏ hàng"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreProducts ? (
                <div className="load-more-container">
                  <button className="btn-load-more" onClick={handleLoadMoreProducts}>
                    Xem thêm sản phẩm
                  </button>
                </div>
              ) : (
                <p className="products-end-note">Đã hiển thị tất cả sản phẩm.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
