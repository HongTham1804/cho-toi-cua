// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { productsData } from './data';

const Home = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Classic - Chợ Tới Cửa</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {productsData.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
            <h3>{product.name}</h3>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {product.price.toLocaleString('vi-VN')}₫
            </p>
            
            {/* Đây là điểm mấu chốt: Tạo link động dẫn đến ID của sản phẩm */}
            <Link 
              to={`/product/${product.id}`} 
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '8px 16px',
                background: '#00796b',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;