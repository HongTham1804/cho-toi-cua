import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiCalendar, FiMail, FiPhone, FiShield, FiTruck, FiUser } from 'react-icons/fi';
import { getAdminToken } from '../../services/adminAuthApi';
import './UserDetail.scss';

const API_BASE_URL = 'http://localhost:8000/api';

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return (words[0]?.slice(0, 2) || 'U').toUpperCase();
};

async function fetchAdminUserDetail(type, id) {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Bạn cần đăng nhập Admin để xem chi tiết người dùng.');
  }

  const response = await fetch(`${API_BASE_URL}/admin/users/${type}/${id}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể tải chi tiết người dùng.');
  }

  return payload.data;
}

export default function UserDetail() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const type = params.type || searchParams.get('type');
  const id = params.id || searchParams.get('id');

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(type && id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type || !id) {
      setError('Thiếu thông tin người dùng cần xem. Vui lòng mở từ trang Quản lý người dùng.');
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);
    setError('');

    fetchAdminUserDetail(type, id)
      .then((detail) => {
        if (!isMounted) return;
        setUser(detail);
      })
      .catch((detailError) => {
        if (!isMounted) return;
        setError(detailError.message || 'Không thể tải chi tiết người dùng.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  const stats = user?.stats || {};
  const isShipper = user?.type === 'shipper';

  return (
    <div className="user-detail-page">
      <div className="header-bar">
        <div className="title-group">
          <Link to="/user-management" className="breadcrumb">
            <FiArrowLeft /> Quản lý người dùng
          </Link>
          <h1>{user?.name || 'Chi tiết người dùng'}</h1>
          {user && (
            <div className="status-row">
              <span className={`badge-active ${user.status_key === 'locked' ? 'is-locked' : ''}`}>
                <FiShield className="icon-badge" /> {user.status_label}
              </span>
              <span className="uid">UID: {user.uid}</span>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="card user-detail-state">
          <FiUser />
          <p>Đang tải chi tiết người dùng...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="card user-detail-state user-detail-state--error">
          <FiAlertTriangle />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && user && (
        <div className="content-grid">
          <section className="card profile-card">
            <div className="avatar-wrapper avatar-wrapper--text">
              <span>{getInitials(user.name)}</span>
            </div>
            <div className="profile-name">
              <h3>{user.name}</h3>
              <p className="subtitle">{user.role_label}</p>
            </div>

            <div className="info-list">
              <div className="info-item full-width">
                <div className="icon-box"><FiMail /></div>
                <div className="info-text">
                  <strong>Email</strong>
                  <span>{user.email || 'Không có email'}</span>
                </div>
              </div>
              <div className="info-item full-width">
                <div className="icon-box"><FiPhone /></div>
                <div className="info-text">
                  <strong>Số điện thoại</strong>
                  <span>{user.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
              {isShipper && (
                <div className="info-item full-width">
                  <div className="icon-box"><FiTruck /></div>
                  <div className="info-text">
                    <strong>Biển số xe</strong>
                    <span>{user.license_plate || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              )}
              <div className="info-item full-width">
                <div className="icon-box"><FiCalendar /></div>
                <div className="info-text">
                  <strong>Ngày tham gia</strong>
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="right-column">
            <div className="stats-row">
              <div className="card stat-card">
                <div className="stat-header"><span>Tổng đơn</span></div>
                <h3>{Number(stats.total_orders || 0).toLocaleString('vi-VN')}</h3>
              </div>
              <div className="card stat-card">
                <div className="stat-header"><span>Hoàn thành</span></div>
                <h3>{Number(stats.completed_orders || 0).toLocaleString('vi-VN')}</h3>
              </div>
              <div className="card stat-card">
                <div className="stat-header"><span>Đã hủy</span></div>
                <h3>{Number(stats.cancelled_orders || 0).toLocaleString('vi-VN')}</h3>
              </div>
            </div>

            <div className="card history-table-card">
              <div className="card-header">
                <h3>Thông tin trạng thái</h3>
              </div>
              <div className="user-detail-summary">
                <p><strong>Vai trò:</strong> {user.role_label}</p>
                <p><strong>Trạng thái:</strong> {user.status_label}</p>
                <p><strong>Tỷ lệ hủy:</strong> {Number(stats.cancel_rate || 0).toLocaleString('vi-VN')}%</p>
                {user.locked_reason && <p><strong>Lý do khóa:</strong> {user.locked_reason}</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
