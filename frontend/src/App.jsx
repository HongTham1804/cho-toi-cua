import React, { useState } from 'react';
import Sidebar from "./components/Sidebar/Sidebar"; 
import Header from "./components/Header/Header";
import ProductManagement from './pages/ProductManagement/ProductManagement'; 
import "./App.css";
﻿import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import RegisterStore from './pages/register-store'
import Login from './pages/login'
import Notifications from './pages/notifications'
import OrderHistory from './pages/order-history'
import Review from './pages/review'
import Tracking from './pages/tracking'
import OrderManagement from './pages/order-management'
import LoggedInHomepage from './pages/logged-in-homepage'
import SupermarketDetails from './pages/supermarket-details' 


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
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register-store" element={<RegisterStore />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/review" element={<Review />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/order-management" element={<OrderManagement />} />
      <Route path="/logged-in-homepage" element={<LoggedInHomepage />} />
      <Route path="/supermarket-details" element={<SupermarketDetails />} />
    </Routes>
  
}

export default App;