import React from 'react';
import './style.css';

const ReviewModal = ({ reviews, rating, reviewsCount, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đánh giá sản phẩm ({reviewsCount})</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="rating-overview">
          <div className="rating-score">
            <h2>{rating}</h2>
            <div className="stars">★★★★★</div>
            <p>{reviewsCount} đánh giá</p>
          </div>
          {/* Bạn có thể thêm phần thanh bar thống kê 5 sao, 4 sao ở đây */}
        </div>

        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-user-info">
                <div className="avatar">{review.user.charAt(0)}</div>
                <div>
                  <h4>{review.user}</h4>
                  <span className="time">{review.time}</span>
                </div>
                <div className="review-stars">★★★★★</div>
              </div>
              <p className="review-text">{review.content}</p>
              {review.image && <img src={review.image} alt="review" className="review-img" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
