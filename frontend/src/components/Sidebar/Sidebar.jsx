import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // 1. IMPORT THƯ VIỆN ĐIỀU HƯỚNG
import { 
  MdOutlineSpaceDashboard, MdOutlineInventory2, MdOutlinePeopleAlt, 
  MdOutlineHandshake, MdOutlineLocalShipping, MdOutlinePayments, 
  MdOutlineSettings, MdOutlineLogout 
} from "react-icons/md";
import './Sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate(); // 2. KHỞI TẠO HÀM CHUYỂN TRANG

  // 3. HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1>Chợ Tới Cửa</h1>
        <p>Quản lý chợ</p>
      </div>
      
      {/* 4. SỬ DỤNG NAVLINK ĐỂ ĐIỀU HƯỚNG VÀ TỰ ĐỘNG ACTIVE */}
      <nav className="nav-menu">
        <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlineSpaceDashboard className="nav-icon" /> Bảng điều khiển
        </NavLink>
        
        <NavLink to="/product-management" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlineInventory2 className="nav-icon" /> Quản lý sản phẩm
        </NavLink>
        
        <NavLink to="/user-management" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlinePeopleAlt className="nav-icon" /> Quản lý người dùng
        </NavLink>
        
        <NavLink to="/quanlydoitac-gia" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlineHandshake className="nav-icon" /> Quản lý đối tác
        </NavLink>

        <NavLink to="/quanlyvanchuyen" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlineLocalShipping className="nav-icon" /> Quản lý vận chuyển
        </NavLink>

        <NavLink to="/pricing-config" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlinePayments className="nav-icon" /> Cấu hình giá
        </NavLink>
      </nav>

      <div className="bottom-menu">
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <MdOutlineSettings className="nav-icon" /> Cài đặt
        </NavLink>
        
        {/* Nút đăng xuất không dùng link mà dùng sự kiện click */}
        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <MdOutlineLogout className="nav-icon" /> Đăng xuất
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
