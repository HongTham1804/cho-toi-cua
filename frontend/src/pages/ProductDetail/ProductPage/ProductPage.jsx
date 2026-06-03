import React, { useState } from 'react';

import './ProductPage.scss';

import imgCaChuaMain from '../../assets/Cà chua Mộc Châu.png';
import imgCaChuaThumb1 from '../../assets/cà chua 1.jpg';
import imgCaChuaThumb2 from '../../assets/cà chua 2.webp';

import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import Sidebar from '../../components/Sidebar/Sidebar'; 
import ReviewModal from '../../ProductPage/ReviewModal'; // Component Modal được tách riêng

// Import Icons cho phần chi tiết sản phẩm
import { FiMapPin, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const ProductPage = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Gắn trực tiếp biến ảnh đã import vào mảng
  const images = [imgCaChuaMain, imgCaChuaThumb1, imgCaChuaThumb2];

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="product-page-container">
      {/* Sử dụng Component Header có sẵn */}
      <Header />

     {/* SIDEBAR */}
        <div className="sidebar-section">
          <Sidebar />
        </div>

      {/* NỘI DUNG CHÍNH CỦA SẢN PHẨM */}
      <main className="product-details">
        {/* Left Column: Gallery */}
        <div className="product-gallery">
          <div className="badge-bestseller">Bán chạy nhất</div>
          <img src={images[activeImage]} alt="Cà Chua Mộc Châu" className="main-image" />
          <div className="thumbnail-list">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <img src={img} alt={`thumb-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="product-info">
          <div className="shipping-badge">🚚 Giao hỏa tốc 2h</div>
          <h1 className="product-title">Cà Chua Mộc Châu Tươi Sạch (500g)</h1>
          
          <div className="rating-summary" onClick={() => setIsReviewModalOpen(true)}>
            <div className="stars">
              <FaStar className="star-icon filled" />
              <FaStar className="star-icon filled" />
              <FaStar className="star-icon filled" />
              <FaStar className="star-icon filled" />
              <FaStarHalfAlt className="star-icon filled" />
            </div>
            <span className="rating-text">(128 Đánh giá)</span>
            <span className="divider">•</span>
            <span className="sold-text">Đã bán 1.2k</span>
          </div>

          <div className="price">35,000đ</div>
          <p className="vat-note">Giá đã bao gồm thuế VAT. Đơn vị tính: Khay 500g.</p>

          <div className="specs">
            <div className="spec-box">
              <FiMapPin className="spec-icon" />
              <div>
                <div className="spec-title">Xuất xứ</div>
                <div className="spec-value">Mộc Châu, Sơn La</div>
              </div>
            </div>
            <div className="spec-box">
              <FiUser className="spec-icon" />
              <div>
                <div className="spec-title">Bảo quản</div>
                <div className="spec-value">Ngăn mát hoặc nơi thoáng mát</div>
              </div>
            </div>
          </div>

          <div className="description">
            Cà chua được trồng theo tiêu chuẩn sạch tại vùng cao nguyên Mộc Châu với khí hậu mát mẻ quanh năm. Trái chín tự nhiên, căng mọng, vỏ mỏng, thịt dày và có vị ngọt thanh tự nhiên. 
          </div>

          <div className="divider-line"></div>

          <div className="actions-section">
            <div className="quantity-selector">
              <span className="label">Số lượng:</span>
              <div className="control">
                <button onClick={handleDecrease}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={handleIncrease}>+</button>
              </div>
              <span className="stock">Còn 24 khay</span>
            </div>

            <div className="buttons">
              <button className="btn-add-cart">
                <FiShoppingCart className="btn-icon" /> Thêm vào giỏ
              </button>
              <button className="btn-favorite">
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Gọi Modal Đánh giá đã được tách ra component riêng */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
    </div>
  );
};

export default ProductPage;