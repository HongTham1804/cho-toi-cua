import React from 'react';
import './index.css';
import { Search, Bell, HelpCircle, Grid, Truck, MapPin, User, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function DeliveryManagement() {
  const deliveries = [
    {
      id: '#DEL-9821',
      orderId: '#ORD-9821',
      shopper: { name: 'Trần Thị B', phone: '0901234567' },
      route: { from: 'Co.opmart Cống Quỳnh', to: '123 Nguyễn Trãi, Q.1' },
      status: 'Đang giao',
      statusClass: 'status-shipping',
      time: '10:30, 24/10'
    },
    {
      id: '#DEL-9822',
      orderId: '#ORD-9822',
      shopper: { name: 'Chưa phân công', phone: '-' },
      shopperStyle: 'shopper-unassigned',
      route: { from: 'Lotte Mart Q7', to: '456 Huỳnh Tấn Phát, Q.7' },
      status: 'Chờ nhận',
      statusClass: 'status-waiting',
      time: '11:15, 24/10'
    },
    {
      id: '#DEL-9820',
      orderId: '#ORD-9820',
      shopper: { name: 'Nguyễn Văn E', phone: '0912345678' },
      route: { from: 'BigC Miền Đông', to: '789 Tô Hiến Thành, Q.10' },
      status: 'Đang lấy hàng',
      statusClass: 'status-picking',
      time: '09:45, 24/10'
    },
    {
      id: '#DEL-9815',
      orderId: '#ORD-9815',
      shopper: { name: 'Lê Thị G', phone: '0934567890' },
      route: { from: 'Co.opmart Cống Quỳnh', to: '321 Trần Hưng Đạo, Q.1' },
      status: 'Đã xong',
      statusClass: 'status-completed',
      time: '08:00, 24/10'
    }
  ];

  return (
    <div className="ctc-admin-container">
      {/* Top Navigation Header */}
      <header className="ctc-top-header">
        <div className="ctc-search-box">
          <span className="ctc-search-icon"><Search size={16} /></span>
          <input 
            type="text" 
            placeholder="Tìm kiếm chuyến xe, mã đơn, shopper..." 
            className="ctc-search-input"
          />
        </div>

        <div className="ctc-header-actions">
          <button className="ctc-icon-btn"><Bell size={18} /></button>
          <button className="ctc-icon-btn"><HelpCircle size={18} /></button>
          <button className="ctc-icon-btn"><Grid size={18} /></button>
          <div className="ctc-divider-v"></div>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="Admin Profile" 
            className="ctc-admin-avatar"
          />
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="ctc-main-content">
        <div className="ctc-page-header">
          <div>
            <h1 className="ctc-page-title">Quản lý Vận chuyển</h1>
            <p className="ctc-page-subtitle">Theo dõi lộ trình di chuyển, định vị thời gian thực và quản lý tài xế điều phối.</p>
          </div>
          <button className="ctc-btn-secondary">
            <RefreshCw size={14} /> Tải lại bản đồ
          </button>
        </div>

        {/* Filter Bar Layout */}
        <div className="ctc-filter-toolbar">
          <div className="ctc-filter-item">
            <label className="ctc-filter-label">Trạng thái giao</label>
            <select className="ctc-filter-select">
              <option>Tất cả trạng thái</option>
              <option>Chờ nhận</option>
              <option>Đang lấy hàng</option>
              <option>Đang giao</option>
              <option>Đã xong</option>
            </select>
          </div>
          <div className="ctc-filter-item">
            <label className="ctc-filter-label">Thời gian</label>
            <input 
              type="text" 
              placeholder="mm/dd/yyyy" 
              className="ctc-filter-input"
            />
          </div>
          <div className="ctc-filter-item">
            <label className="ctc-filter-label">Khu vực / Hệ thống</label>
            <select className="ctc-filter-select">
              <option>Tất cả khu vực siêu thị</option>
              <option>Co.opmart Cống Quỳnh</option>
              <option>Lotte Mart Q7</option>
              <option>BigC Miền Đông</option>
            </select>
          </div>
          <div className="ctc-filter-buttons">
            <button className="ctc-btn-reset">Đặt lại</button>
            <button className="ctc-btn-submit">Lọc</button>
          </div>
        </div>

        {/* Core Data Table Grid */}
        <div className="ctc-table-card">
          <div className="ctc-table-responsive">
            <table className="ctc-data-table">
              <thead>
                <tr>
                  <th>Mã vận chuyển</th>
                  <th>Mã đơn</th>
                  <th>Shopper vận chuyển</th>
                  <th>Lộ trình (Từ - Đến)</th>
                  <th className="text-center">Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr key={index}>
                    <td className="font-bold text-slate-900">{delivery.id}</td>
                    <td className="font-bold text-emerald">{delivery.orderId}</td>
                    <td>
                      <div className="ctc-shopper-profile">
                        <div className="ctc-shopper-icon">
                          <User size={14} />
                        </div>
                        <div>
                          <div className={`ctc-shopper-name ${delivery.shopperStyle || ""}`}>{delivery.shopper.name}</div>
                          {delivery.shopper.phone !== '-' && <div className="ctc-shopper-phone">{delivery.shopper.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="ctc-route-cell">
                      <div className="ctc-route-point">
                        <span className="ctc-dot-amber"></span>
                        <span className="ctc-truncate">{delivery.route.from}</span>
                      </div>
                      <div className="ctc-route-point mt-1">
                        <MapPin size={12} className="ctc-icon-rose" />
                        <span className="ctc-truncate font-semibold text-slate-900">{delivery.route.to}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`ctc-status-tag ${delivery.statusClass}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="text-slate-500 font-medium">{delivery.time}</td>
                    <td className="text-center">
                      <button className="ctc-btn-track">
                        <Truck size={14} /> Định vị
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="ctc-table-pagination">
            <div className="ctc-pagination-info">
              Hiển thị <span className="font-semibold text-slate-700">1 đến 4</span> của <span className="font-semibold text-slate-700">42</span> chuyến giao hàng
            </div>
            
            <div className="ctc-pagination-controls">
              <button className="ctc-page-nav-btn"><ChevronLeft size={14} /></button>
              <button className="ctc-page-num-btn active">1</button>
              <button className="ctc-page-num-btn">2</button>
              <button className="ctc-page-num-btn">3</button>
              <button className="ctc-page-nav-btn"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
