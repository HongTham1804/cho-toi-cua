// ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Thêm useParams
import { productsData } from './data'; // Import data
import ReviewModal from './ReviewModal';
import './style.css';

const ProductDetail = () => {

    // 1. Lấy ID từ URL (ví dụ: /product/1 -> id = "1")
  const { id } = useParams();

  // 2. Tìm sản phẩm trong mảng data có id khớp với id trên URL
  // Lưu ý: params từ URL luôn là chuỗi (string), nên cần parseInt để so sánh với số
    const product = productsData.find(item => item.id === parseInt(id, 10));
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

// 3. Xử lý trường hợp người dùng gõ sai ID trên URL (vd: /product/999)
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Không tìm thấy sản phẩm!</h2>
        <Link to="/">Quay về trang chủ</Link>
      </div>
    );
    }
    
// 4. Render giao diện như bình thường nếu tìm thấy
  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img src={product.mainImage} alt={product.name} className="main-image" />
        <div className="thumbnail-list">
          {product.thumbnails.map((thumb, index) => (
            <img key={index} src={thumb} alt="thumbnail" className="thumbnail" />
          ))}
        </div>
      </div>

      <div className="product-info-section">
        <span className="badge">Giao hỏa tốc 2h</span>
        <h1 className="product-name">{product.name}</h1>
        
        <div className="product-meta">
          <span className="stars">★★★★★ ({product.reviewsCount} Đánh giá)</span>
          <span className="sold">Đã bán {product.sold}</span>
        </div>

        <h2 className="product-price">{product.price.toLocaleString('vi-VN')}₫</h2>
        
        <div className="product-attributes">
          <div className="attr-box">
            <strong>Xuất xứ</strong>
            <p>{product.origin}</p>
          </div>
          <div className="attr-box">
            <strong>Bảo quản</strong>
            <p>{product.storage}</p>
          </div>
        </div>

        <p className="product-description">{product.description}</p>
        
        <button className="view-reviews-btn" onClick={() => setIsModalOpen(true)}>
          Xem thêm đánh giá
        </button>

        <div className="purchase-action">
          <div className="quantity-control">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className="add-to-cart-btn">Thêm vào giỏ</button>
        </div>
      </div>

      {isModalOpen && (
        <ReviewModal 
          reviews={product.reviews} 
          rating={product.rating}
          reviewsCount={product.reviewsCount}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetail;
