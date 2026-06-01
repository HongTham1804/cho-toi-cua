import React, { useEffect, useMemo, useState } from 'react';
import './shopping-cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { addCartItem, readCartItems, writeCartItems } from '../../services/cartStorage';
import { clearVoucherCache, fetchProducts, fetchUserVouchers, fetchVouchers } from '../../services/productApi';

const API_BASE_URL = 'http://localhost:8000/api';
const DEFAULT_CUSTOMER_ID = 4;

const getCurrentCustomer = () => {
  try {
    return JSON.parse(window.localStorage.getItem('auth_user')) || {};
  } catch {
    return {};
  }
};

const formatCurrency = (value) => `${Number(value).toLocaleString('vi-VN')}₫`;

const isFreeshipVoucher = (voucher) => voucher.discount_type === 'freeship';

const calculateVoucherDiscount = (voucher, subtotal, shippingFee) => {
  if (!voucher || subtotal < Number(voucher.min_order_value || 0)) return 0;

  if (voucher.discount_type === 'freeship') {
    return Math.min(shippingFee, Number(voucher.discount_amount || shippingFee));
  }

  if (voucher.discount_type === 'percentage') {
    const rawDiscount = subtotal * (Number(voucher.discount_amount || 0) / 100);
    return Math.min(rawDiscount, Number(voucher.max_discount_amount || rawDiscount));
  }

  return Math.min(subtotal, Number(voucher.discount_amount || 0));
};

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => readCartItems());
  const [recommendedPool, setRecommendedPool] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [selectedFreeshipVoucher, setSelectedFreeshipVoucher] = useState(null);
  const [selectedDiscountVoucher, setSelectedDiscountVoucher] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const primaryStoreId = cartItems[0]?.store_id || 1;

  useEffect(() => {
    writeCartItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    let isMounted = true;

    fetchProducts({ storeId: primaryStoreId, perPage: 12 })
      .then((products) => {
        if (isMounted) setRecommendedPool(products);
      })
      .catch(() => {
        if (isMounted) setRecommendedPool([]);
      });

    return () => {
      isMounted = false;
    };
  }, [primaryStoreId]);

  const cartItemIds = useMemo(
    () => new Set(cartItems.map((item) => String(item.id))),
    [cartItems]
  );

  const recommendedProducts = useMemo(
    () => recommendedPool.filter((product) => !cartItemIds.has(String(product.id))).slice(0, 4),
    [cartItemIds, recommendedPool]
  );

  const handleQuantityChange = (id, change) => {
    setCartItems(items =>
      items
        .map(item =>
          item.id === id
            ? { ...item, quantity: Number(item.quantity || 0) + change }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleAddRecommended = (product) => {
    setCartItems(addCartItem(product));
  };

  const loadSavedVouchers = async () => {
    try {
      setPromoError('');
      const userId = Number(getCurrentCustomer().id || DEFAULT_CUSTOMER_ID);
      let vouchers = await fetchUserVouchers({ userId, storeId: primaryStoreId });

      if (vouchers.length === 0) {
        const allStoreVouchers = await fetchVouchers({ storeId: primaryStoreId, userId });
        vouchers = allStoreVouchers.filter((voucher) => voucher.is_saved && !voucher.is_used);
      }
      setSavedVouchers(vouchers);
    } catch {
      setSavedVouchers([]);
      setPromoError('Không lấy được ví voucher. Bạn hãy kiểm tra backend/API.');
    }
  };

  const openPromoModal = () => {
    setIsPromoOpen(true);
    loadSavedVouchers();
  };

  const toggleVoucher = (voucher) => {
    if (subtotal < Number(voucher.min_order_value || 0)) return;

    if (isFreeshipVoucher(voucher)) {
      setSelectedFreeshipVoucher((current) =>
        current?.id === voucher.id ? null : voucher
      );
      return;
    }

    setSelectedDiscountVoucher((current) =>
      current?.id === voucher.id ? null : voucher
    );
  };

  const handleApplyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    const voucher = savedVouchers.find((item) => String(item.code).toUpperCase() === code);

    if (!voucher) {
      setPromoError('Mã này chưa có trong ví voucher đã lưu.');
      return;
    }

    if (subtotal < Number(voucher.min_order_value || 0)) {
      setPromoError('Đơn hàng chưa đủ điều kiện để dùng mã này.');
      return;
    }

    setPromoError('');
    toggleVoucher(voucher);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckingOut) return;

    const currentCustomer = getCurrentCustomer();
    const payload = {
      customer_id: Number(currentCustomer.id || DEFAULT_CUSTOMER_ID),
      store_id: Number(primaryStoreId),
      voucher_id: selectedDiscountVoucher?.id,
      shipping_voucher_id: selectedFreeshipVoucher?.id,
      shipping_address:
        currentCustomer.address || 'Thu Duc, TP.HCM',
      payment_method: 'cod',
      note: orderNote.trim() || null,
      shipping_fee: shippingFee,
      items: cartItems.map((item) => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity),
        is_flash_sale: Boolean(item.originalPrice),
      })),
    };

    setIsCheckingOut(true);
    setCheckoutError('');

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Không thể tạo đơn hàng.');
      }

      writeCartItems([]);
      clearVoucherCache();
      setCartItems([]);
      setSavedVouchers([]);
      setSelectedDiscountVoucher(null);
      setSelectedFreeshipVoucher(null);
      setOrderNote('');
      navigate('/order-history?status=pending');
    } catch (error) {
      setCheckoutError(error.message || 'Không thể tạo đơn hàng. Bạn kiểm tra backend/API rồi thử lại.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const shippingDiscount = calculateVoucherDiscount(selectedFreeshipVoucher, subtotal, shippingFee);
  const orderDiscount = calculateVoucherDiscount(selectedDiscountVoucher, subtotal, shippingFee);
  const finalShippingFee = Math.max(0, shippingFee - shippingDiscount);
  const total = Math.max(0, subtotal + finalShippingFee - orderDiscount);

  return (
    <div className="shopping-cart-wrapper">

      {/* --- MAIN CONTENT --- */}
      <div className="shopping-cart-main-container">
        <div className="page-title-section">
          {/* NÚT QUAY LẠI MUA SẮM (MỚI THÊM) */}
          <div className="back-to-shop">
            <Link to={`/supermarket-details?store_id=${primaryStoreId}`} className="back-link">
                <i className="fa-solid fa-arrow-left"></i> Tiếp tục mua sắm
            </Link>
          </div>

          <h1>Giỏ hàng & Thanh toán</h1>
        </div>

        <div className="shopping-cart-layout">
          {/* LEFT SECTION: CART ITEMS */}
          <div className="cart-items-section">
            <div className="cart-header">
              <h2>Giỏ hàng của bạn</h2>
            </div>

            {/* Delivery Time Banner */}
            <div className="delivery-banner">
              <div className="banner-content">
                <i className="fa-solid fa-circle-check"></i>
                <div className="banner-text">
                  <strong>Thời gian giao hàng dự kiến: 30 - 45 phút</strong>
                  <p>Đơn hàng sẽ được chuẩn bị và giao ngay khi bạn hoàn tất thanh toán.</p>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item-row">
                    <div className="item-image">
                      {String(item.image).startsWith('/') ||
                      String(item.image).startsWith('data:') ||
                      String(item.image).startsWith('http') ? (
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                      ) : (
                        <span className="emoji-placeholder">{item.image}</span>
                      )}
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                    </div>
                    <div className="item-controls">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Xóa sản phẩm"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div className="item-price">
                      <span className="price-value">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-cart">
                  <p>Giỏ hàng của bạn đang trống</p>
                </div>
              )}
            </div>

            {/* Gift Note Section */}
            {cartItems.length > 0 && (
              <div className="gift-note-section">
                <label>
                  <i className="fa-solid fa-gift"></i>
                  Ghi chú cho cửa hàng (Không bắt buộc)
                </label>
                <textarea
                  className="gift-note-input"
                  placeholder="Vd: Chọn giúp mình rau ghi lại xin ghi chú nhé..."
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                ></textarea>
              </div>
            )}
          </div>

          {/* RIGHT SECTION: ORDER SUMMARY */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tổng tiền hàng</span>
                  <span className="amount">{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span className="amount">{formatCurrency(shippingFee)}</span>
                </div>
                {shippingDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Ưu đãi phí vận chuyển</span>
                    <span className="amount">-{formatCurrency(shippingDiscount)}</span>
                  </div>
                )}
                {orderDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Chợ Tới Cửa Voucher</span>
                    <span className="amount">-{formatCurrency(orderDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Thành tiền:</span>
                <span className="total-amount">{formatCurrency(total)}</span>
              </div>

              {/* Nút bấm mở Popup Khuyến Mãi */}
              <div className="promo-trigger-core" onClick={openPromoModal}>
                <div className="promo-trigger-left">
                  <i className="fa-solid fa-tag"></i>
                  <span>Thêm mã khuyến mãi</span>
                </div>
                <i className="fa-solid fa-chevron-right"></i>
              </div>

              {/* Popup Modal Khuyến Mãi */}
              {isPromoOpen && (
                <div className="modal-overlay-core" onClick={() => setIsPromoOpen(false)}>
                  <div className="promo-modal-core" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header Popup */}
                    <div className="promo-header-core">
                      <h3>Chọn mã khuyến mãi</h3>
                      <button className="close-promo-btn" onClick={() => setIsPromoOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {/* Body Popup */}
                    <div className="promo-body-core">
                      {/* Ô nhập mã thủ công */}
                      <div className="promo-input-group-core">
                        <input
                          type="text"
                          placeholder="Nhập mã khuyến mãi..."
                          value={promoCode}
                          onChange={(event) => setPromoCode(event.target.value)}
                        />
                        <button className="btn-apply-core" type="button" onClick={handleApplyPromoCode}>
                          Áp dụng
                        </button>
                      </div>

                      <div className="promo-list-core">
                        {promoError && <p className="promo-error-text">{promoError}</p>}
                        {!promoError && savedVouchers.length === 0 && (
                          <p className="promo-empty-text">Bạn chưa lưu mã nào của siêu thị này.</p>
                        )}

                        {savedVouchers.map((voucher) => {
                          const isDisabled = subtotal < Number(voucher.min_order_value || 0);
                          const isSelected = isFreeshipVoucher(voucher)
                            ? selectedFreeshipVoucher?.id === voucher.id
                            : selectedDiscountVoucher?.id === voucher.id;
                          const endDate = new Date(voucher.end_date).toLocaleDateString('vi-VN');
                          const label = isFreeshipVoucher(voucher)
                            ? 'FREESHIP'
                            : voucher.discount_type === 'percentage'
                              ? `GIẢM ${Number(voucher.discount_amount)}%`
                              : `GIẢM ${Math.round(Number(voucher.discount_amount) / 1000)}K`;

                          return (
                            <label
                              key={voucher.id}
                              className={`promo-card-core ${isDisabled ? 'disabled' : 'active'} ${isFreeshipVoucher(voucher) ? 'freeship' : ''}`}
                            >
                              <div className="promo-card-left">
                                <span className="discount-amount">{label}</span>
                              </div>
                              <div className="promo-card-right">
                                <div className="promo-info">
                                  <h4>{voucher.title}</h4>
                                  <p>HSD: {endDate}</p>
                                  {isDisabled && (
                                    <span className="error-msg">
                                      Mua thêm {formatCurrency(Number(voucher.min_order_value) - subtotal)} để sử dụng
                                    </span>
                                  )}
                                </div>
                                {!isDisabled && (
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleVoucher(voucher)}
                                    className="promo-radio"
                                  />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Popup */}
                    <div className="promo-footer-core">
                      <button className="btn-confirm-promo" onClick={() => setIsPromoOpen(false)}>
                        Xác nhận
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Checkout Button */}
              {checkoutError && <p className="checkout-error">{checkoutError}</p>}

              <button
                className="btn-checkout"
                type="button"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckingOut}
              >
                <span>{isCheckingOut ? 'Đang tạo đơn...' : 'Tiến hành đặt hàng'}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

            </div>
          </div>
        </div>

        {/* RECOMMENDED PRODUCTS SECTION */}
        {recommendedProducts.length > 0 && (
          <section className="recommended-section">
            <h2>Thường mua cùng nhau</h2>
            <div className="recommended-grid">
              {recommendedProducts.map(product => (
                <div key={product.id} className="recommended-card">
                  <div className="rec-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <h4>{product.name}</h4>
                  <p className="rec-price">{product.price.toLocaleString('vi-VN')}₫</p>
                  <button
                    className="btn-add-rec"
                    onClick={() => handleAddRecommended(product)}
                  >
                    + Thêm
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
