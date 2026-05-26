import React, { useState } from 'react';
import './shopping-cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

export default function ShoppingCart() {
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [cartItems, setCartItems] = useState([

    {
      id: 1,
      name: 'Cô Chua Cherry Hủi Cà Đỏ Lạt',
      description: 'Hộp 500g',
      price: 45000,
      quantity: 2,
      image: '🍒'
    },
    {
      id: 2,
      name: 'Phí là Cà Hồ Nội Nơi Tuei',
      description: 'Khay 300g - Cắt thái sẵn',
      price: 185000,
      quantity: 1,
      image: '🧡'
    }
  ]);

  const recommendedProducts = [
    {
      id: 3,
      name: 'Nành lá, Ngh í lá bạt',
      price: 15000,
      image: '🌿'
    },
    {
      id: 4,
      name: 'Chanh không hạt Vĩnh Long',
      price: 22000,
      image: '🍋'
    }
  ];

  const handleQuantityChange = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleAddRecommended = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      handleQuantityChange(product.id, 1);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 15000;
  const total = subtotal + shippingFee;

  return (
    <div className="shopping-cart-wrapper">

      {/* --- MAIN CONTENT --- */}
      <div className="shopping-cart-main-container">
        <div className="page-title-section">
          {/* NÚT QUAY LẠI MUA SẮM (MỚI THÊM) */}
          <div className="back-to-shop">
            <Link to="/supermarket-details" className="back-link">
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
                      <span className="emoji-placeholder">{item.image}</span>
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
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="amount">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="summary-row">
                  <span>Phí giao hàng</span>
                  <span className="amount">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Tổng cộng</span>
                <span className="total-amount">{total.toLocaleString('vi-VN')}₫</span>
              </div>

              {/* Nút bấm mở Popup Khuyến Mãi */}
              <div className="promo-trigger-core" onClick={() => setIsPromoOpen(true)}>
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
                        <input type="text" placeholder="Nhập mã khuyến mãi..." />
                        <button className="btn-apply-core">Áp dụng</button>
                      </div>

                      {/* Danh sách Voucher cuộn */}
                      <div className="promo-list-core">
                        
                        {/* Thẻ Voucher 1: Đủ điều kiện (Màu sáng, có nút chọn) */}
                        <label className="promo-card-core active">
                          <div className="promo-card-left">
                            <span className="discount-amount">GIẢM 20K</span>
                          </div>
                          <div className="promo-card-right">
                            <div className="promo-info">
                              <h4>Giảm 20k cho đơn từ 500k</h4>
                              <p>HSD: 30/05/2026</p>
                            </div>
                            <input type="radio" name="selectedPromo" className="promo-radio" />
                          </div>
                        </label>

                        {/* Thẻ Voucher 2: Đủ điều kiện */}
                        <label className="promo-card-core active freeship">
                          <div className="promo-card-left">
                            <span className="discount-amount">FREESHIP</span>
                          </div>
                          <div className="promo-card-right">
                            <div className="promo-info">
                              <h4>Miễn phí vận chuyển</h4>
                              <p>HSD: 15/06/2026</p>
                            </div>
                            <input type="radio" name="selectedPromo" className="promo-radio" />
                          </div>
                        </label>

                        {/* Thẻ Voucher 3: KHÔNG đủ điều kiện (Làm mờ, báo lỗi đỏ) */}
                        <div className="promo-card-core disabled">
                          <div className="promo-card-left">
                            <span className="discount-amount">GIẢM 50K</span>
                          </div>
                          <div className="promo-card-right">
                            <div className="promo-info">
                              <h4>Giảm 50k cho đơn từ 1 Triệu</h4>
                              <p>HSD: 30/05/2026</p>
                              <span className="error-msg">Mua thêm 450.000đ để sử dụng</span>
                            </div>
                          </div>
                        </div>

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
              <button className="btn-checkout">
                <span>Tiến hành thanh toán</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              {/* Support Icons */}
              <div className="support-icons">
                <div className="support-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="support-icon">
                  <i className="fa-solid fa-comment"></i>
                </div>
              </div>
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
                    <span className="emoji-placeholder">{product.image}</span>
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
