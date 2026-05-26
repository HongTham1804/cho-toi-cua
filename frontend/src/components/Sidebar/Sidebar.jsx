import React from 'react';
import { MdOutlineSpaceDashboard, MdOutlineInventory2, MdOutlinePeopleAlt, MdOutlineHandshake, MdOutlineLocalShipping, MdOutlinePayments, MdOutlineSettings, MdOutlineLogout } from "react-icons/md";
import './Sidebar.scss';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1>Chợ Tới Cửa</h1>
        <p>Quản lý chợ</p>
      </div>
      <nav className="nav-menu">
        <a 
          href="#" 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
        >
          <MdOutlineSpaceDashboard className="nav-icon" /> Bảng điều khiển
        </a>
        
        <a 
          href="#" 
          className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}
        >
          <MdOutlineInventory2 className="nav-icon" /> Quản lý sản phẩm
        </a>
        
        <a 
          href="#" 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}
        >
          <MdOutlinePeopleAlt className="nav-icon" /> Quản lý người dùng
        </a>
        
        <a href="#" className="nav-item"><MdOutlineHandshake className="nav-icon" /> Quản lý đối tác</a>
        <a href="#" className="nav-item"><MdOutlineLocalShipping className="nav-icon" /> Quản lý vận chuyển</a>
        <a href="#" className="nav-item"><MdOutlinePayments className="nav-icon" /> Cấu hình giá</a>
      </nav>
      <div className="bottom-menu">
        <a href="#" className="nav-item"><MdOutlineSettings className="nav-icon" /> Cài đặt</a>
        <a href="#" className="nav-item"><MdOutlineLogout className="nav-icon" /> Đăng xuất</a>
      </div>
    </aside>
  );
};

export default Sidebar;