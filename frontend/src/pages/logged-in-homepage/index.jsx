import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logged-in-homepage.css';

import nenBg from '../../assets/ảnh nền.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css'
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import goLogo from '../../assets/logos/GO.png';
import { fetchStores } from '../../services/productApi';

const getStoreLogo = (store) => {
  if (store.logo_url?.includes('Winmart')) return winmartLogo;
  if (store.logo_url?.includes('GO')) return goLogo;
  return bachHoaXanhLogo;
};

const getDeliveryTime = (storeId) => (Number(storeId) === 3 ? '20-25 phút' : '15-20 phút');

const getShortStoreName = (storeName = '') => {
  if (storeName.includes('WinMart')) return 'WinMart';
  if (storeName.includes('GO')) return 'GO!';
  return 'Bách Hóa Xanh';
};


export default function LoggedInHomepage() {
  const [activeTab, setActiveTab] = useState('Trang chủ');
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores()
      .then((apiStores) => setStores(apiStores.slice(0, 3)))
      .catch(() => setStores([]));
  }, []);

  const repeatedStores = stores.length
    ? Array.from({ length: 9 }, (_, index) => {
        const store = stores[index % stores.length];
        return {
          ...store,
          cardId: `${store.id}-${index}`,
          displayName: getShortStoreName(store.name),
          image: getStoreLogo(store),
          time: getDeliveryTime(store.id),
        };
      })
    : [];

  const openStoreDetails = (store) => {
    navigate(`/supermarket-details?store_id=${store.id}`, {
      state: { store_id: store.id },
    });
  };

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
              onClick={() => {
                setActiveTab('Trang chủ');
                navigate('/logged-in-homepage');
              }}
            >
              <i className="fa-solid fa-house"></i> Trang chủ
            </li>
            <li 
              className={`nav-item-core ${activeTab === 'Sản phẩm yêu thích' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('Sản phẩm yêu thích');
                navigate('/favorite-products');
              }}
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
            
            <button
              className="btn-buy-now"
              onClick={() => document.querySelector('.store-section-core')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Mua ngay ➔
            </button>
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
              {repeatedStores.map((store) => (
                <button
                  key={store.cardId}
                  type="button"
                  className="store-card-custom"
                  onClick={() => openStoreDetails(store)}
                >
                  
                  {/* Thay thế biểu tượng bằng thẻ img */}
                  <div className="store-img-placeholder">
                    <img src={store.image} alt={store.name} className="store-logo-img" />
                  </div>

                  <div className="store-info-core">
                    <h3>{store.displayName}</h3>
                    <span className="time-delivery-core">⏱ {store.time}</span>
                  </div>

                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
