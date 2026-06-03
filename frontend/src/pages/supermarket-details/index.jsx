import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './supermarket-details.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { addCartItem } from '../../services/cartStorage';
import {
  getFlashSaleReminderIds,
  saveFlashSaleReminder,
} from '../../services/flashSaleReminderStorage';
import {
  fetchFlashSales,
  fetchStoreCatalog,
  mapApiProduct,
  saveVoucher,
} from '../../services/productApi';
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

const formatStoreRating = (store) => {
  const reviewCount = Number(store?.review_count || 0);
  const averageRating = Number(store?.average_rating || 0);

  if (!reviewCount || !averageRating) return '⭐ Chưa có đánh giá';

  return `⭐ ${averageRating.toFixed(1)} (${reviewCount.toLocaleString('vi-VN')} đánh giá)`;
};

const formatPrice = (price) => `${Number(price).toLocaleString('vi-VN')}đ`;

const formatShortMoney = (value) => `${Math.round(Number(value) / 1000)}K`;

const formatVoucherLabel = (voucher) => {
  if (voucher.discount_type === 'freeship') return 'Free ship';
  if (voucher.discount_type === 'percentage') return `-${Number(voucher.discount_amount)}%`;
  return `-${formatShortMoney(voucher.discount_amount)}`;
};

const formatVoucherSub = (voucher) => {
  const date = new Date(voucher.end_date);
  const endDate = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  return `HSD: ${endDate}`;
};

const formatCountdown = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(' : ');
};

const formatMaskedFlashPrice = (price) => {
  const formattedPrice = formatPrice(price);
  return formattedPrice.replace(/\d/, '?');
};

const getDisplayFlashSale = (flashSales, nowMs = Date.now()) =>
  [...flashSales]
    .filter((flashSale) => new Date(flashSale.end_time).getTime() > nowMs)
    .sort((first, second) => new Date(first.start_time).getTime() - new Date(second.start_time).getTime())[0] || null;

const getFlashSaleTiming = (flashSale, nowMs = Date.now()) => {
  if (!flashSale) {
    return {
      phase: 'none',
      label: 'Bắt đầu trong',
      secondsLeft: 0,
    };
  }

  const startMs = new Date(flashSale.start_time).getTime();
  const endMs = new Date(flashSale.end_time).getTime();

  if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
    return {
      phase: 'none',
      label: 'Bắt đầu trong',
      secondsLeft: 0,
    };
  }

  if (nowMs < startMs) {
    return {
      phase: 'upcoming',
      label: 'Bắt đầu trong',
      secondsLeft: Math.max(0, Math.floor((startMs - nowMs) / 1000)),
    };
  }

  if (nowMs <= endMs) {
    return {
      phase: 'active',
      label: 'Kết thúc trong',
      secondsLeft: Math.max(0, Math.floor((endMs - nowMs) / 1000)),
    };
  }

  return {
    phase: 'ended',
    label: 'Bắt đầu trong',
    secondsLeft: 0,
  };
};

const mapFlashSaleItems = (displayFlashSale) => {
  const flashItems = displayFlashSale?.products || [];

  return flashItems.map((item) => ({
    ...mapApiProduct({
      ...item.product,
      is_flash_sale: true,
      flash_sale_price: item.flash_sale_price,
      original_price: item.original_price,
      flash_sale_sold_percent: item.sold_percent,
      flash_sale_remaining: item.remaining,
      flash_sale_end_time: displayFlashSale?.end_time,
    }),
    flashSaleProductId: item.id,
    soldPercent: item.sold_percent,
    remaining: item.remaining,
  }));
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
  const [products, setProducts] = useState([]);
  const [flashSale, setFlashSale] = useState(null);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [flashReminderNotice, setFlashReminderNotice] = useState('');
  const [remindedFlashProductIds, setRemindedFlashProductIds] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [voucherNotice, setVoucherNotice] = useState('');
  const [savingVoucherIds, setSavingVoucherIds] = useState([]);
  const [recentlySavedVoucherIds, setRecentlySavedVoucherIds] = useState([]);
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(() => isStoreOpenNow());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const storeId = Number(searchParams.get('store_id') || location.state?.store_id || 1);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingProducts(true);
    setProductError('');
    setProducts([]);
    setVouchers([]);
    setFlashSale(null);
    setFlashSaleProducts([]);

    fetchStoreCatalog({ storeId, userId: getCurrentCustomerId() })
      .then((catalog) => {
        if (!isMounted) return;
        setStore(catalog.store || null);
        setCategories([DEFAULT_CATEGORY, ...(catalog.categories || []).map((category) => category.name)]);
        setProducts(catalog.products || []);
        setVouchers(catalog.vouchers || []);
        const displayFlashSale = getDisplayFlashSale(catalog.flashSales || []);
        setFlashSale(displayFlashSale || null);
        setFlashSaleProducts(mapFlashSaleItems(displayFlashSale));
      })
      .catch(() => {
        if (!isMounted) return;
        setStore(null);
        setCategories([DEFAULT_CATEGORY]);
        setProducts([]);
        setVouchers([]);
        setFlashSale(null);
        setFlashSaleProducts([]);
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
    let isMounted = true;

    return undefined;

    setIsLoadingProducts(true);
    setProductError('');
    setProducts([]);
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
    let isMounted = true;
    let refreshTimerId = null;

    setFlashSaleProducts([]);

    const loadFlashSale = () => {
      fetchFlashSales({ storeId, status: 'all' })
        .then((apiFlashSales) => {
          if (!isMounted) return;

          const displayFlashSale = getDisplayFlashSale(apiFlashSales);
          setFlashSale(displayFlashSale || null);

          setFlashSaleProducts(mapFlashSaleItems(displayFlashSale));
        })
        .catch(() => {
          if (!isMounted) return;
          setFlashSale(null);
          setFlashSaleProducts([]);
        });
    };

    refreshTimerId = window.setInterval(loadFlashSale, 60 * 1000);

    return () => {
      isMounted = false;
      if (refreshTimerId) window.clearInterval(refreshTimerId);
    };
  }, [storeId]);

  useEffect(() => {
    setFlashVisibleCount(4);
    setProductVisibleCount(8);
  }, [storeId]);

  useEffect(() => {
    setRemindedFlashProductIds(getFlashSaleReminderIds());
  }, [flashSale?.id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateStoreStatus = () => setIsStoreOpen(isStoreOpenNow());

    updateStoreStatus();
    const timer = window.setInterval(updateStoreStatus, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  const flashSaleTiming = useMemo(() => getFlashSaleTiming(flashSale, nowMs), [flashSale, nowMs]);
  const isFlashSaleActive = flashSaleTiming.phase === 'active';
  const isFlashSaleUpcoming = flashSaleTiming.phase === 'upcoming';
  const flashProducts = flashSaleProducts;

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

  const handleFlashReminder = (product) => {
    const reminder = saveFlashSaleReminder({ product, flashSale, storeId });

    if (!reminder) {
      setFlashReminderNotice('Chưa thể lưu nhắc nhở cho sản phẩm này.');
      window.setTimeout(() => setFlashReminderNotice(''), 2400);
      return;
    }

    setRemindedFlashProductIds(getFlashSaleReminderIds());
    setFlashReminderNotice(`Đã lưu nhắc nhở cho ${product.name}.`);
    window.setTimeout(() => setFlashReminderNotice(''), 2400);
  };

  const getFlashReminderId = (product) => `${flashSale?.id}:${product.flashSaleProductId || product.id}`;

  const handleAddToCart = (product) => {
    if (!product.isAvailable) {
      return;
    }

    addCartItem(product);
  };

  const openProductDetail = (product) => {
    navigate(`/product-detail/${product.id}`, {
      state: { productId: product.id, storeId },
    });
  };

  const handleProductCardKeyDown = (event, product) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetail(product);
    }
  };

  const handleSaveVoucher = async (voucher) => {
    const voucherId = Number(voucher.id);
    setSavingVoucherIds((ids) => [...ids, voucherId]);

    try {
      const savedVoucher = await saveVoucher({ voucherId: voucher.id });

      setVouchers((items) =>
        items.map((item) => {
          if (Number(item.id) !== voucherId) return item;

          return {
            ...item,
            ...savedVoucher,
            is_saved: true,
          };
        })
      );
      setRecentlySavedVoucherIds((ids) => [...new Set([...ids, voucherId])]);
      window.setTimeout(() => {
        setRecentlySavedVoucherIds((ids) => ids.filter((id) => id !== voucherId));
      }, 1300);
      setVoucherNotice(`Đã lưu mã ${voucher.code}.`);
    } catch (error) {
      setVoucherNotice(error.message || 'Không lưu được voucher.');
    } finally {
      setSavingVoucherIds((ids) => ids.filter((id) => id !== voucherId));
    }

    window.setTimeout(() => setVoucherNotice(''), 2600);
  };

  useEffect(() => {
    setProductVisibleCount(8);
  }, [activeCategory, products, sortMode]);

  return (
    <div className="supermarket-wrapper">
      <div className="supermarket-main-container">
        <div className="shop-header-section">
          <div className={getStoreBannerClass(store)}>
            <img src={getStoreBanner(store)} alt={`${store?.name || 'Siêu thị'} banner`} fetchPriority="high" />
          </div>

          <div className="shop-info-card">
            <div className="shop-logo-box">
              <img src={getStoreLogo(store)} alt={store?.name || 'Siêu thị'} />
            </div>
            <div className="shop-detail-text">
              <h1>{store?.name || 'Đang tải siêu thị'}</h1>
              <div className="shop-meta">
                <span>{formatStoreRating(store)}</span>
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
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className={`coupon-card-custom ${voucher.discount_type === 'freeship' ? 'freeship' : 'discount'}`}
              >
                <div className="coupon-left">{formatVoucherLabel(voucher)}</div>
                <div className="coupon-right">
                  <p className="cp-title">{voucher.title}</p>
                  <p className="cp-sub">
                    Đơn tối thiểu {formatPrice(voucher.min_order_value)}
                  </p>
                  <p className="cp-sub">{formatVoucherSub(voucher)}</p>
                  <button
                    className={`btn-save-cp ${recentlySavedVoucherIds.includes(Number(voucher.id)) ? 'saved-feedback' : ''}`}
                    type="button"
                    disabled={
                      voucher.is_used ||
                      savingVoucherIds.includes(Number(voucher.id)) ||
                      recentlySavedVoucherIds.includes(Number(voucher.id))
                    }
                    onClick={() => handleSaveVoucher(voucher)}
                  >
                    {voucher.is_used
                      ? 'Đã dùng'
                      : savingVoucherIds.includes(Number(voucher.id))
                        ? 'Đang lưu...'
                        : recentlySavedVoucherIds.includes(Number(voucher.id))
                          ? 'Đã lưu'
                        : 'Lưu'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {voucherNotice && <p className="voucher-notice">{voucherNotice}</p>}
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
                  ⚡ Giờ Vàng Giá Sốc
                  <span className={`countdown-label countdown-label--${flashSaleTiming.phase}`}>
                    {flashSaleTiming.label}
                  </span>
                  <span className="countdown">{formatCountdown(flashSaleTiming.secondsLeft)}</span>
                </h2>
              </div>

              <div className="flash-sale-grid">
                {visibleFlashProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flash-product-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => openProductDetail(product)}
                    onKeyDown={(event) => handleProductCardKeyDown(event, product)}
                  >
                    <span className="discount-badge">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                    <div className={getFlashImageBoxClass(product)}>
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    </div>
                    <div className="p-info-flash">
                      <h3>{product.name}</h3>
                      <div className={`price-box ${isFlashSaleUpcoming ? 'price-box--upcoming' : ''}`}>
                        <span className="p-price">
                          {isFlashSaleUpcoming ? formatMaskedFlashPrice(product.price) : formatPrice(product.price)}
                        </span>
                        <span className="p-original">{formatPrice(product.originalPrice)}</span>
                      </div>
                      {isFlashSaleActive ? (
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${product.soldPercent || 0}%` }}></div>
                          <span className="progress-text">Đã bán {product.soldPercent || 0}%</span>
                        </div>
                      ) : (
                        <button
                          className={`btn-remind-flash ${remindedFlashProductIds.includes(getFlashReminderId(product)) ? 'is-reminded' : ''}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleFlashReminder(product);
                          }}
                        >
                          {remindedFlashProductIds.includes(getFlashReminderId(product)) ? 'Đã nhắc' : 'Nhắc nhở tôi'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {flashReminderNotice && <p className="flash-reminder-notice">{flashReminderNotice}</p>}

              {!isLoadingProducts && visibleFlashProducts.length === 0 && (
                <p className="products-end-note">
                  {flashSale
                    ? 'Chưa có sản phẩm flash sale trong đợt này.'
                    : 'Chưa có lịch flash sale sắp tới.'}
                </p>
              )}

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
                  <div
                    key={product.id}
                    className={`product-card-v2 ${!product.isAvailable ? 'is-out-of-stock' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => openProductDetail(product)}
                    onKeyDown={(event) => handleProductCardKeyDown(event, product)}
                  >
                    <div className={getProductImageBoxClass(product)}>
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    </div>
                    <div className="p-info">
                      <h3>{product.name}</h3>
                      <div className="product-price-stack">
                        <p className={`p-price ${product.isFlashSale ? 'p-price--flash' : ''}`}>
                          {formatPrice(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="p-original">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>
                      <button
                        className={`btn-add-cart ${!product.isAvailable ? 'btn-add-cart--out' : ''}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.isAvailable}
                        title={product.isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                      >
                        {product.isAvailable ? '+' : 'Hết hàng'}
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
