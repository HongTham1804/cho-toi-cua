import React, { useState } from 'react';
import './logged-in-homepage.css';

import nenBg from '../../assets/ảnh nền.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css'
import winmartLogo from '../../assets/logos/Winmart.jpg';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import coopmartLogo from '../../assets/logos/Coopmart.jpg';
import lottemartLogo from '../../assets/logos/Lottemart.webp';


export default function LoggedInHomepage() {
  const [activeTab, setActiveTab] = useState('Trang chủ');
    // Dữ liệu giả (Mock data) cho các siêu thị để render tự động
  const storeList = [
    { id: 1, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
    { id: 2, name: 'Bách Hóa Xanh', time: '20-25 phút', image: bachHoaXanhLogo },
    { id: 3, name: 'Bách Hóa Xanh', time: '10-15 phút', image: bachHoaXanhLogo },
    { id: 4, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
    { id: 5, name: 'WinMart', time: '15-20 phút', image: winmartLogo },
    { id: 6, name: 'Co.op Mart', time: '20-25 phút', image: coopmartLogo },
    { id: 7, name: 'Lotte Mart', time: '10-15 phút', image: lottemartLogo },
    { id: 8, name: 'Bách Hóa Xanh', time: '15-20 phút', image: bachHoaXanhLogo },
  ];

  return (
    <div className="homepage-wrapper-core">
      {/* --- HEADER --- */}
        
      <div className="layout-body-core">
        {/* --- CỘT TRÁI: SIDEBAR --- */}
        <aside className="sidebar-custom">
          <div className="user-profile-core">
            {/* 1. Đổi Avatar thành ô vuông xanh nhạt */}
            <div className="avatar-box-custom">
              <i className="fa-solid fa-shop"></i>
            </div>
            
            {/* 2. Tên thương hiệu màu xanh */}
            <h3 className="brand-name-sidebar">Chợ Tới Cửa</h3>
          </div>

          <li 
              className={`nav-item-core ${activeTab === 'Trang chủ' ? 'active' : ''}`}
              onClick={() => setActiveTab('Trang chủ')}
            >
              <i className="fa-solid fa-house"></i> Trang chủ
            </li>
            <li 
              className={`nav-item-core ${activeTab === 'Ưu đãi' ? 'active' : ''}`}
              onClick={() => setActiveTab('Ưu đãi')}
            >
              <i className="fa-solid fa-tag"></i> Ưu đãi
            </li>
            <li 
              className={`nav-item-core ${activeTab === 'Sản phẩm yêu thích' ? 'active' : ''}`}
              onClick={() => setActiveTab('Sản phẩm yêu thích')}
            >
              <i className="fa-solid fa-heart"></i> Sản phẩm yêu thích
            </li>
            <li 
              className={`nav-item-core ${activeTab === 'Tài khoản' ? 'active' : ''}`}
              onClick={() => setActiveTab('Tài khoản')}
            >
              <i className="fa-regular fa-user"></i> Tài khoản
            </li>
        </aside>

        {/* --- CỘT PHẢI: NỘI DUNG CHÍNH --- */}
        <main className="main-content-core">
          
          {/* 1. Khu vực Banners */}
          <div className="banner-grid-core">
            <div 
            className="banner-card-custom banner-fresh"
            style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.3)), url(${nenBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            >

            
            {/* Sửa lại tiêu đề h1 này */}
            <h1 className="fresh-title-core">
                <span className="text-highlight">Tươi Ngon</span><br/>
                Mỗi Ngày
            </h1>
            
            {/* Sửa lại thẻ p này */}
            <p className="fresh-subtitle-core">Trải nghiệm nông sản sạch từ nông trại đến tận cửa nhà bạn.</p>
            
            <button className="btn-buy-now">Mua ngay ➔</button>
            </div>
            <div className="banner-card-custom banner-offer">
                {/* Icon in chìm khổng lồ */}
                <i className="fa-solid fa-gift watermark-icon-custom"></i>
  
                {/* Bọc nội dung lại để nó nổi lên trên icon */}
                <div className="offer-content-core">
                <h2>Ưu đãi hôm nay</h2>
                <p>Giảm 20% cho đơn hàng đầu tiên.</p>
                <h1 className="discount-text-core">-20%</h1>
                </div>
            </div>
        </div>

          {/* 2. Khu vực Danh sách siêu thị */}
          <section className="store-section-core">
            <h2>Chọn siêu thị gần bạn</h2>
            <div className="store-grid-layout">
              {storeList.map((store) => (
                <div key={store.id} className="store-card-custom">
                  
                  {/* Thay thế biểu tượng bằng thẻ img */}
                  <div className="store-img-placeholder">
                    <img src={store.image} alt={store.name} className="store-logo-img" />
                  </div>
                  
                  <div className="store-info-core">
                    <h3>{store.name}</h3>
                    <span className="time-delivery-core">⏱ {store.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}