import React, { useState } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom'; // <-- Cần import thêm Outlet
import './App.css';

// --- IMPORT CÁC THÀNH PHẦN DÙNG CHUNG ---
import Header from "./components/Header/Header"; // Header cũ của Admin
import CustomerHeader from "./components/CustomerHeader/CustomerHeader"; // Header mới của Khách
import Footer from "./components/Footer/Footer"; 

// --- IMPORT CÁC TRANG ---
import RegisterStore from './pages/register-store';
import Login from './pages/login';
import Notifications from './pages/notifications';
import OrderHistory from './pages/order-history';
import Review from './pages/review';
import Tracking from './pages/tracking';
import OrderManagement from './pages/order-management';
import ProductManagement from './pages/ProductManagement/ProductManagement'; 
import LoggedInHomepage from './pages/logged-in-homepage';
import SupermarketDetails from './pages/supermarket-details'; 
import PartnerLogin from './pages/PartnerLogin/PartnerLogin'; 
import ShoppingCart from './pages/shopping-cart'; 
import SelectRole from './pages/select-role';
import UserDetail from './pages/UserDetail/UserDetail'; 

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ==========================================
  // 1. TẠO KHUNG (LAYOUT) CHO KHÁCH HÀNG
  // ==========================================
  const CustomerLayout = () => (
    <div className="customer-layout">
      <CustomerHeader onMenuClick={() => setIsMenuOpen(true)} />
      <div className="main-content">
        <Outlet /> {/* <-- Các trang của khách sẽ tự động nhét vào đây */}
      </div>
      <Footer />
    </div>
  );

  // ==========================================
  // 2. TẠO KHUNG (LAYOUT) CHO ADMIN / ĐỐI TÁC
  // ==========================================
  const AdminLayout = () => (
    <div className="admin-container">
      <Header /> {/* Gọi Header cũ */}
      <div className="main-content">
        <Outlet /> {/* <-- Các trang của Admin sẽ tự động nhét vào đây */}
      </div>
    </div>
  );

  return (
    <div className="App">
      
      {/* Cửa sổ trượt Sidebar của khách hàng */}
      {isMenuOpen && (
        <div className="modal-overlay-core" onClick={() => setIsMenuOpen(false)}>
          <div className="sidebar-modal-core" onClick={(e) => e.stopPropagation()}>
            <div className="user-profile-core">
              <i className="fa-solid fa-user-circle"></i>
              <h3>Chào, Khách hàng</h3>
            </div>
            <nav className="menu-links-core">
              <a href="#"><i className="fa-solid fa-house"></i> Cửa hàng</a>
              <a href="#"><i className="fa-solid fa-receipt"></i> Đơn hàng của bạn</a>
              <a href="#"><i className="fa-solid fa-gear"></i> Cài đặt tài khoản</a>
              <a href="#" className="logout-btn"><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
            </nav>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ========================================== */}
        {/* NHÓM TRANG KHÁCH HÀNG (Có Header xanh + Footer) */}
        <Route element={<CustomerLayout />}>
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/supermarket-details" element={<SupermarketDetails />} />
          <Route path="/logged-in-homepage" element={<LoggedInHomepage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/review" element={<Review />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* ========================================== */}
        {/* NHÓM TRANG ADMIN (Có Header cũ, Không có Footer) */}
        <Route element={<AdminLayout />}>
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/order-management" element={<OrderManagement />} />
        </Route>

        {/* ========================================== */}
        {/* CÁC TRANG ĐỘC LẬP (Không Header, Không Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/partner-login" element={<PartnerLogin />} />
        <Route path="/register-store" element={<RegisterStore />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/UserDetail" element={<UserDetail />} />
      </Routes>
    </div>
  );
}

export default App