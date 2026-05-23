import React, { useState } from 'react';
import Sidebar from "./components/Sidebar/Sidebar"; 
import Header from "./components/Header/Header";
import ProductManagement from './pages/ProductManagement/ProductManagement'; 
import "./App.css";

function App() {
  const [searchValue, setSearchValue] = useState("");
  // Tạo trạng thái để biết đang ở màn hình nào (Mặc định mở lên là trang sản phẩm 'products')
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="app-container">
      {/* Truyền tab hiện tại và hàm đổi tab sang cho Sidebar dùng */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <Header searchTerm={searchValue} onSearchChange={setSearchValue} />
        
        {/* Logic chuyển trang: Nếu tab là 'products' thì mới mở bảng sản phẩm */}
        {activeTab === "products" && <ProductManagement />}
        
        {/* Trang Quản lý người dùng (sau này bạn code giao diện thì thay thế vào đây) */}
        {activeTab === "users" && (
          <div style={{ padding: "32px" }}>
            <h2>Quản Lý Người Dùng</h2>
            <p>Giao diện quản lý người dùng đang được phát triển...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;