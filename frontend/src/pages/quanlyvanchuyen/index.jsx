import { useMemo, useState } from 'react';
import './index.css';
import { Search, Bell, ChevronDown, MapPin, User } from 'lucide-react';

const STORE_SYSTEMS = [
  'GO! Dĩ An',
  'WinMart Lê Văn Việt',
  'Bách Hóa Xanh Lê Văn Chí',
];

const DELIVERY_STATUSES = [
  'Chờ xử lý',
  'Đang lấy hàng',
  'Đang giao',
  'Đã hoàn thành',
  'Đã hủy',
];

const DELIVERIES = [
    {
      orderId: '#ORD-9821',
      shopper: { name: 'Trần Thị B', phone: '0901234567' },
      route: { from: 'GO! Dĩ An', to: '123 Nguyễn Trãi, Q.1' },
      status: 'Chờ xử lý',
      statusClass: 'status-pending',
      time: '10:30, 24/10'
    },
    {
      orderId: '#ORD-9822',
      shopper: { name: 'Nguyễn Văn E', phone: '0912345678' },
      route: { from: 'WinMart Lê Văn Việt', to: '12 Lê Văn Việt, TP. Thủ Đức' },
      status: 'Đang lấy hàng',
      statusClass: 'status-picking',
      time: '10:45, 24/10'
    },
    {
      orderId: '#ORD-9823',
      shopper: { name: 'Lê Thị G', phone: '0934567890' },
      route: { from: 'Bách Hóa Xanh Lê Văn Chí', to: '45 Võ Văn Ngân, TP. Thủ Đức' },
      status: 'Đang giao',
      statusClass: 'status-shipping',
      time: '11:00, 24/10'
    },
    {
      orderId: '#ORD-9824',
      shopper: { name: 'Chưa phân công', phone: '-' },
      shopperStyle: 'shopper-unassigned',
      route: { from: 'GO! Dĩ An', to: '456 Huỳnh Tấn Phát, Q.7' },
      status: 'Chờ xử lý',
      statusClass: 'status-pending',
      time: '11:15, 24/10'
    },
    {
      orderId: '#ORD-9825',
      shopper: { name: 'Phạm Quốc Huy', phone: '0908877665' },
      route: { from: 'WinMart Lê Văn Việt', to: '789 Tô Hiến Thành, Q.10' },
      status: 'Đang lấy hàng',
      statusClass: 'status-picking',
      time: '11:30, 24/10'
    },
    {
      orderId: '#ORD-9826',
      shopper: { name: 'Đỗ Minh Khang', phone: '0977112233' },
      route: { from: 'Bách Hóa Xanh Lê Văn Chí', to: '321 Trần Hưng Đạo, Q.1' },
      status: 'Đang giao',
      statusClass: 'status-shipping',
      time: '12:00, 24/10'
    },
    {
      orderId: '#ORD-9827',
      shopper: { name: 'Mai Anh Thư', phone: '0922123456' },
      route: { from: 'GO! Dĩ An', to: '22 Phạm Văn Đồng, TP. Thủ Đức' },
      status: 'Đã hoàn thành',
      statusClass: 'status-completed',
      time: '12:20, 24/10'
    },
    {
      orderId: '#ORD-9828',
      shopper: { name: 'Trần Đức Nam', phone: '0933001122' },
      route: { from: 'WinMart Lê Văn Việt', to: '88 Xa Lộ Hà Nội, TP. Thủ Đức' },
      status: 'Đã hủy',
      statusClass: 'status-cancelled',
      time: '12:45, 24/10'
    },
    {
      orderId: '#ORD-9829',
      shopper: { name: 'Vũ Hoàng Long', phone: '0911223344' },
      route: { from: 'Bách Hóa Xanh Lê Văn Chí', to: '17 Man Thiện, TP. Thủ Đức' },
      status: 'Đã hoàn thành',
      statusClass: 'status-completed',
      time: '13:00, 24/10'
    },
    {
      orderId: '#ORD-9830',
      shopper: { name: 'Chưa phân công', phone: '-' },
      shopperStyle: 'shopper-unassigned',
      route: { from: 'GO! Dĩ An', to: '9 Hoàng Diệu 2, TP. Thủ Đức' },
      status: 'Chờ xử lý',
      statusClass: 'status-pending',
      time: '13:15, 24/10'
    },
];

const PAGE_SIZE = 5;

export default function DeliveryManagement() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const filteredDeliveries = useMemo(() => {
    return DELIVERIES.filter((delivery) => {
      const matchesStore = selectedStore === 'all' || delivery.route.from === selectedStore;
      const matchesStatus = selectedStatus === 'all' || delivery.status === selectedStatus;
      return matchesStore && matchesStatus;
    });
  }, [selectedStatus, selectedStore]);
  const totalPages = Math.max(1, Math.ceil(filteredDeliveries.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedDeliveries = filteredDeliveries.slice(startIndex, startIndex + PAGE_SIZE);
  const visibleStart = filteredDeliveries.length ? startIndex + 1 : 0;
  const visibleEnd = Math.min(startIndex + pagedDeliveries.length, filteredDeliveries.length);

  function handleStatusChange(value) {
    setSelectedStatus(value);
    setCurrentPage(1);
  }

  function handleStoreChange(value) {
    setSelectedStore(value);
    setCurrentPage(1);
  }

  return (
    <div className="ctc-admin-container">
      {/* Top Navigation Header */}
      <header className="ctc-top-header">
        <div className="ctc-header-left">
          <div className="ctc-search-box">
            <span className="ctc-search-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Tìm kiếm chuyến xe, mã đơn, shopper..."
              className="ctc-search-input"
            />
          </div>

          <div className="ctc-header-filter">
            <span>Trạng thái:</span>
            <div className="ctc-dropdown">
              <select
                className="ctc-filter-select"
                value={selectedStatus}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                {DELIVERY_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown size={16} className="ctc-chevron" />
            </div>
          </div>

          <div className="ctc-header-filter">
            <span>Hệ thống:</span>
            <div className="ctc-dropdown">
              <select
                className="ctc-filter-select"
                value={selectedStore}
                onChange={(event) => handleStoreChange(event.target.value)}
              >
                <option value="all">Tất cả siêu thị</option>
                {STORE_SYSTEMS.map((store) => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
              <ChevronDown size={16} className="ctc-chevron" />
            </div>
          </div>
        </div>

        <div className="ctc-header-actions">
          <button className="ctc-icon-btn" type="button"><Bell size={20} /></button>
          <div className="ctc-divider-v"></div>
          <div className="ctc-user-info">
            <span className="ctc-user-name">Admin</span>
            <span className="ctc-user-role">Quản lý chợ</span>
          </div>
          <img 
            src="https://i.pravatar.cc/150?img=11"
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
        </div>

        {/* Core Data Table Grid */}
        <div className="ctc-table-card">
          <div className="ctc-table-responsive">
            <table className="ctc-data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Shipper vận chuyển</th>
                  <th>Lộ trình (Từ - Đến)</th>
                  <th className="text-center">Trạng thái</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {pagedDeliveries.map((delivery, index) => (
                  <tr key={index}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="ctc-table-pagination">
            <div className="ctc-pagination-info">
              Hiển thị {visibleStart}-{visibleEnd} trong số {filteredDeliveries.length} chuyến giao hàng
            </div>

            <div className="ctc-pagination-controls">
              <button
                className="ctc-page-nav-btn"
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                ‹ Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`ctc-page-num-btn ${safePage === page ? 'active' : ''}`}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="ctc-page-nav-btn"
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Sau ›
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
