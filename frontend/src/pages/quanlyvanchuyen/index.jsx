import { useEffect, useMemo, useState } from 'react';
import './index.css';
import { Search, ChevronDown, MapPin, User } from 'lucide-react';
import { getAdminToken } from '../../services/adminAuthApi';
import logoMain from '../../assets/logo-main.png';

const API_BASE_URL = 'http://localhost:8000/api';

const STORE_SYSTEMS = [
  'GO! Dĩ An',
  'WinMart Lê Văn Việt',
  'Bách Hóa Xanh Lê Văn Chí',
];

const DELIVERY_STATUSES = [
  { value: 'shipping', label: 'Đang giao', className: 'status-shipping' },
  { value: 'completed', label: 'Đã hoàn thành', className: 'status-completed' },
];

const PAGE_SIZE = 5;

function normalizeOrders(payload) {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatOrderId(id) {
  return `#ORD-${String(id).padStart(4, '0')}`;
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function statusMeta(status) {
  return DELIVERY_STATUSES.find((item) => item.value === status) || DELIVERY_STATUSES[0];
}

function mapOrderToDelivery(order) {
  const status = statusMeta(order.status);
  const shipper = order.shipper || {};

  return {
    orderId: formatOrderId(order.id),
    rawOrderId: String(order.id),
    searchableOrderId: `${order.id} ${formatOrderId(order.id)}`.toLowerCase(),
    shopper: {
      name: shipper.name || 'Chưa phân công',
      phone: shipper.phone || '-',
    },
    shopperStyle: shipper.name ? '' : 'ctc-shopper-unassigned',
    route: {
      from: order.store?.name || 'Siêu thị',
      to: order.delivery_address || order.shipping_address || order.customer?.address || 'Đang cập nhật địa chỉ',
    },
    status: status.label,
    statusValue: status.value,
    statusClass: status.className,
    time: formatDate(order.created_at),
  };
}

async function fetchRealDeliveries() {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}/orders?per_page=50&summary=1&status=shipping,completed`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Không lấy được dữ liệu vận chuyển.');
  }

  const payload = await response.json();

  return normalizeOrders(payload)
    .filter((order) => ['shipping', 'completed'].includes(order.status))
    .map(mapOrderToDelivery);
}

export default function DeliveryManagement() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDeliveries({ silent = false } = {}) {
      if (!silent) setIsLoading(true);
      try {
        const nextDeliveries = await fetchRealDeliveries();
        if (!isMounted) return;

        setDeliveries(nextDeliveries);
        setErrorMessage('');
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message || 'Không lấy được dữ liệu vận chuyển.');
      } finally {
        if (isMounted && !silent) setIsLoading(false);
      }
    }

    loadDeliveries();
    const refreshTimer = window.setInterval(() => loadDeliveries({ silent: true }), 10000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const filteredDeliveries = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const matchesStore = selectedStore === 'all' || delivery.route.from === selectedStore;
      const matchesStatus = selectedStatus === 'all' || delivery.statusValue === selectedStatus;
      const matchesSearch =
        !keyword ||
        delivery.searchableOrderId.includes(keyword) ||
        delivery.shopper.name.toLowerCase().includes(keyword) ||
        delivery.shopper.phone.toLowerCase().includes(keyword) ||
        delivery.route.from.toLowerCase().includes(keyword) ||
        delivery.route.to.toLowerCase().includes(keyword);

      return matchesStore && matchesStatus && matchesSearch;
    });
  }, [deliveries, searchQuery, selectedStatus, selectedStore]);

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

  function handleSearchChange(value) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  return (
    <div className="ctc-admin-container">
      <header className="ctc-top-header">
        <div className="ctc-header-left">
          <div className="ctc-search-box">
            <span className="ctc-search-icon"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn, shipper, siêu thị..."
              className="ctc-search-input"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
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
                  <option key={status.value} value={status.value}>{status.label}</option>
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
          <div className="ctc-user-info">
            <span className="ctc-user-name">Admin</span>
            <span className="ctc-user-role">Quản lý chợ</span>
          </div>
          <img
            src={logoMain}
            alt="Chợ Tới Cửa"
            className="ctc-admin-avatar"
          />
        </div>
      </header>

      <main className="ctc-main-content">
        <div className="ctc-page-header">
          <div>
            <h1 className="ctc-page-title">Quản lý Vận chuyển</h1>
            <p className="ctc-page-subtitle">Theo dõi lộ trình di chuyển, định vị thời gian thực và quản lý tài xế điều phối.</p>
          </div>
        </div>

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
                {isLoading && (
                  <tr>
                    <td colSpan="5" className="ctc-empty-cell">Đang tải dữ liệu vận chuyển...</td>
                  </tr>
                )}

                {!isLoading && errorMessage && (
                  <tr>
                    <td colSpan="5" className="ctc-empty-cell">{errorMessage}</td>
                  </tr>
                )}

                {!isLoading && !errorMessage && pagedDeliveries.length === 0 && (
                  <tr>
                    <td colSpan="5" className="ctc-empty-cell">Chưa có đơn đang giao hoặc đã hoàn thành.</td>
                  </tr>
                )}

                {!isLoading && !errorMessage && pagedDeliveries.map((delivery) => (
                  <tr key={delivery.rawOrderId}>
                    <td className="font-bold text-emerald">{delivery.orderId}</td>
                    <td>
                      <div className="ctc-shopper-profile">
                        <div className="ctc-shopper-icon">
                          <User size={14} />
                        </div>
                        <div>
                          <div className={`ctc-shopper-name ${delivery.shopperStyle}`}>{delivery.shopper.name}</div>
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
