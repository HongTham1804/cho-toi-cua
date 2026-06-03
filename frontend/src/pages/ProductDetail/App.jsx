// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProductDetail from './ProductDetail';

const App = () => {
  return (
    <BrowserRouter>
      {/* Navbar có thể đặt ở đây để nó hiển thị trên mọi trang */}
      <nav style={{ padding: '15px', background: '#333', color: 'white' }}>
        <h2>Hệ thống Giao hàng</h2>
      </nav>

      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<Home />} />
        
        {/* Đường dẫn động cho trang chi tiết. 
            Dấu hai chấm (:) khai báo 'id' là một tham số (parameter) */}
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};
 
export default App;