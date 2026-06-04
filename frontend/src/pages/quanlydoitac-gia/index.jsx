import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { Search, Store as StoreIcon, UserCheck, Lock } from 'lucide-react';
import bachHoaXanhLogo from '../../assets/logos/BHX.webp';
import winmartLogo from '../../assets/logos/Winmart.jpg';
import goLogo from '../../assets/logos/GO.png';
import logoMain from '../../assets/logo-main.png';

const API_BASE_URL = 'http://localhost:8000/api';
const MANAGED_STORE_NAMES = ['Bách Hóa Xanh Lê Văn Chí', 'WinMart Lê Văn Việt', 'GO! Dĩ An'];

function getStoreLogo(storeName = '') {
  if (storeName.includes('WinMart')) return winmartLogo;
  if (storeName.includes('GO')) return goLogo;
  return bachHoaXanhLogo;
}

function normalizeStores(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function isStoreOpenNow() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 22;
}

function formatRating(value) {
  const rating = Number(value || 0);
  return rating > 0 ? rating.toFixed(1) : '0.0';
}

async function fetchStores() {
  const response = await fetch(`${API_BASE_URL}/stores`);

  if (!response.ok) {
    throw new Error('Không lấy được danh sách đối tác.');
  }

  const payload = await response.json();
  return normalizeStores(payload);
}

export default function PartnerPricing() {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadStores() {
      setIsLoading(true);
      try {
        const nextStores = await fetchStores();
        if (!isMounted) return;

        setStores(nextStores);
        setErrorMessage('');
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message || 'Không lấy được danh sách đối tác.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStores();

    return () => {
      isMounted = false;
    };
  }, []);

  const isOpen = isStoreOpenNow();

  const managedStores = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return stores
      .filter((store) => MANAGED_STORE_NAMES.includes(store.name))
      .sort((a, b) => MANAGED_STORE_NAMES.indexOf(a.name) - MANAGED_STORE_NAMES.indexOf(b.name))
      .filter((store) => {
        if (!keyword) return true;
        return `${store.name} ${store.address || ''}`.toLowerCase().includes(keyword);
      });
  }, [searchQuery, stores]);

  const totalPartners = MANAGED_STORE_NAMES.length;
  const activePartners = isOpen ? totalPartners : 0;
  const inactivePartners = totalPartners - activePartners;

  return (
    <div className="ctc-admin-container">
      <header className="ctc-top-header">
        <div className="ctc-search-box">
          <span className="ctc-search-icon"><Search size={16} /></span>
          <input
            type="text"
            placeholder="Tìm kiếm đối tác..."
            className="ctc-search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
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
            <h1 className="ctc-page-title">Quản lý đối tác</h1>
            <p className="ctc-page-subtitle">Kiểm soát danh sách đối tác.</p>
          </div>
        </div>

        <div className="ctc-tab-panel">
          <div className="ctc-stats-grid">
            <div className="ctc-stat-card">
              <div>
                <p className="ctc-stat-label">Tổng số đối tác</p>
                <h3 className="ctc-stat-value">{totalPartners}</h3>
                <span className="ctc-stat-badge ctc-badge-emerald">3 siêu thị mặc định</span>
              </div>
              <div className="ctc-stat-icon ctc-icon-green"><StoreIcon size={20} /></div>
            </div>
            <div className="ctc-stat-card">
              <div>
                <p className="ctc-stat-label">Đối tác đang hoạt động</p>
                <h3 className="ctc-stat-value">{activePartners}</h3>
                <span className="ctc-stat-badge ctc-badge-emerald">07:00 - 22:00</span>
              </div>
              <div className="ctc-stat-icon ctc-icon-blue"><UserCheck size={20} /></div>
            </div>
            <div className="ctc-stat-card">
              <div>
                <p className="ctc-stat-label">Đối tác không hoạt động</p>
                <h3 className="ctc-stat-value">{inactivePartners}</h3>
                <span className="ctc-stat-badge ctc-badge-muted">Ngoài giờ mở cửa</span>
              </div>
              <div className="ctc-stat-icon ctc-icon-red"><Lock size={18} /></div>
            </div>
          </div>

          <div className="ctc-table-card">
            <div className="ctc-table-responsive">
              <table className="ctc-data-table">
                <thead>
                  <tr>
                    <th>Đối tác</th>
                    <th>Đang hoạt động</th>
                    <th>Đánh giá sao</th>
                    <th>Đơn hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan="4" className="ctc-empty-cell">Đang tải danh sách đối tác...</td>
                    </tr>
                  )}

                  {!isLoading && errorMessage && (
                    <tr>
                      <td colSpan="4" className="ctc-empty-cell">{errorMessage}</td>
                    </tr>
                  )}

                  {!isLoading && !errorMessage && managedStores.length === 0 && (
                    <tr>
                      <td colSpan="4" className="ctc-empty-cell">Không tìm thấy đối tác phù hợp.</td>
                    </tr>
                  )}

                  {!isLoading && !errorMessage && managedStores.map((store) => {
                    const rating = formatRating(store.average_rating);
                    const reviewCount = Number(store.review_count || 0);
                    const completedOrders = Number(store.completed_orders_count || 0);
                    const logo = getStoreLogo(store.name);

                    return (
                      <tr key={store.id}>
                        <td>
                          <div className="ctc-partner-profile">
                            <div className="ctc-partner-logo-frame">
                              <img
                                src={logo}
                                alt={store.name}
                                className="ctc-partner-logo"
                              />
                            </div>
                            <div>
                              <div className="ctc-partner-name">{store.name}</div>
                              <div className="ctc-partner-phone">{store.address}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`ctc-status-badge ${isOpen ? 'status-online' : 'status-offline'}`}>
                            <span className="ctc-status-dot"></span>
                            {isOpen ? 'Đang hoạt động' : 'Đang đóng cửa'}
                          </span>
                        </td>
                        <td className="font-medium text-slate-900">
                          <Link className="ctc-rating-link" to={`/supermarket-details?store_id=${store.id}`}>
                            <span className="ctc-star-icon">★</span> {rating} ({reviewCount} đánh giá)
                          </Link>
                        </td>
                        <td className="font-bold text-slate-900">{completedOrders.toLocaleString('vi-VN')} đơn</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
