import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

// Import ảnh cho modal đánh giá
import avatarMinhAnh from '../../assets/images/avatar-minhanh.jpg';
import reviewImgCaChua from '../../assets/images/review-ca-chua.jpg';

const ReviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Nếu không mở thì không render gì cả

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Đánh giá sản phẩm (128)</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Rating Overview */}
          <div className="rating-overview">
            <div className="score-box">
              <div className="score">4.8</div>
              <div className="stars">
                <FaStar className="star-icon filled" />
                <FaStar className="star-icon filled" />
                <FaStar className="star-icon filled" />
                <FaStar className="star-icon filled" />
                <FaStarHalfAlt className="star-icon filled" />
              </div>
              <div className="total-reviews">128 đánh giá</div>
            </div>
            {/* ... Phần thanh tiến trình (Progress bars) giữ nguyên như cũ ... */}
          </div>

          {/* Review List */}
          <div className="review-list">
            <div className="review-item">
              <div className="review-user">
                {/* Sử dụng ảnh đã import */}
                <img src={avatarMinhAnh} alt="Minh Anh" className="avatar" />
                <div className="user-info">
                  <div className="name">Minh Anh</div>
                  <div className="time">2 ngày trước</div>
                </div>
                <div className="user-stars">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="star-icon filled" />)}
                </div>
              </div>
              <div className="review-content">
                Cà chua rất tươi, trái chín đều tăm tắp và không bị dập nát quả nào khi giao đến. Mình mua về trộn salad ăn ngọt thanh, mọng nước dã man. Sẽ ủng hộ shop lâu dài!
              </div>
              {/* Sử dụng ảnh đánh giá đã import */}
              <img src={reviewImgCaChua} alt="Review Cà Chua" className="review-image" />
            </div>
            
            {/* ... Các review khác ... */}
          </div>

          <button className="btn-load-more">Xem thêm đánh giá</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;