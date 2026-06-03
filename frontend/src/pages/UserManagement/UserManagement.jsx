import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getAdminToken } from '../../services/adminAuthApi';
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiLock,
  FiMoreVertical,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import './UserManagement.scss';

const API_BASE_URL = 'http://localhost:8000/api';
const ITEMS_PER_PAGE = 8;
const ROLE_QUERY_MAP = {
  delivery: 'shipper',
  shipper: 'shipper',
};
const ROLE_OPTIONS = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'partner', label: 'Đối tác' },
  { value: 'shipper', label: 'Nhân viên giao hàng' },
];
const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'locked', label: 'Bị khóa' },
];

const resolveRoleFilter = (value) => ROLE_QUERY_MAP[value] || value || 'all';

const normalizePage = (payload) => ({
  data: Array.isArray(payload?.data?.data) ? payload.data.data : [],
  currentPage: Number(payload?.data?.current_page || 1),
  lastPage: Number(payload?.data?.last_page || 1),
  total: Number(payload?.data?.total || 0),
});

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';

  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 ? `${words[0][0]}${words[words.length - 1][0]}` : words[0]?.slice(0, 2);
  return (initials || 'U').toUpperCase();
};

const requestAdmin = async (path, options = {}) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Không thể xử lý yêu cầu.');
  }

  return payload;
};

const UserManagement = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(() => resolveRoleFilter(searchParams.get('role')));
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [toast, setToast] = useState('');
  const [detailUser, setDetailUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const currentUsers = users;
  const canSelectAll = currentUsers.length > 0 && !isLoading;

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      per_page: String(ITEMS_PER_PAGE),
      role: roleFilter,
      status: statusFilter,
    });

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    return params.toString();
  }, [currentPage, debouncedSearch, roleFilter, statusFilter]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    try {
      const payload = await requestAdmin(`/admin/users?${queryString}`);
      const page = normalizePage(payload);
      setUsers(page.data);
      setCurrentPage(page.currentPage);
      setLastPage(page.lastPage);
      setTotalUsers(page.total);
      setSelectedUsers([]);
    } catch (error) {
      setPageError(error.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setIsLoading(false);
    }
  }, [queryString]);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
    setDetailUser(null);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  useEffect(() => {
    if (!isDetailOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeDetail();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [closeDetail, isDetailOpen]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(currentUsers.map((user) => `${user.type}:${user.id}`));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (user) => {
    const key = `${user.type}:${user.id}`;
    setSelectedUsers((current) =>
      current.includes(key) ? current.filter((userId) => userId !== key) : [...current, key]
    );
  };

  const toggleDropdown = (user) => {
    const key = `${user.type}:${user.id}`;
    setActiveDropdown((current) => (current === key ? null : key));
  };

  const openDetail = async (user) => {
    setActiveDropdown(null);
    setDetailUser(user);
    setIsDetailOpen(true);

    try {
      const payload = await requestAdmin(`/admin/users/${user.type}/${user.id}`);
      setDetailUser(payload.data);
    } catch (error) {
      showToast(error.message || 'Không thể lấy chi tiết người dùng.');
    }
  };

  const handleLockUser = async (user) => {
    setActiveDropdown(null);

    if (user.role_key === 'admin') {
      showToast('Không thể khóa tài khoản quản trị viên.');
      return;
    }

    if (user.type === 'shipper') {
      showToast('Nhân viên giao hàng chưa có tài khoản đăng nhập để khóa.');
      return;
    }

    try {
      const payload = await requestAdmin(`/admin/users/${user.type}/${user.id}/lock`, {
        method: 'PATCH',
        body: '{}',
      });
      setUsers((current) =>
        current.map((item) => (item.type === user.type && item.id === user.id ? payload.data : item))
      );
      setDetailUser((current) =>
        current?.type === user.type && current?.id === user.id ? payload.data : current
      );
      showToast(payload.message || 'Đã khóa tài khoản.');
    } catch (error) {
      showToast(error.message || 'Không thể khóa tài khoản.');
    }
  };

  const handleDeleteUser = async (user) => {
    setActiveDropdown(null);

    if (user.role_key === 'admin') {
      showToast('Không thể xóa tài khoản quản trị viên.');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa "${user.name}"?`)) return;

    try {
      const payload = await requestAdmin(`/admin/users/${user.type}/${user.id}`, {
        method: 'DELETE',
      });
      setUsers((current) =>
        current.filter((item) => !(item.type === user.type && item.id === user.id))
      );
      setTotalUsers((current) => Math.max(0, current - 1));
      showToast(payload.message || 'Đã xóa người dùng.');
    } catch (error) {
      showToast(error.message || 'Không thể xóa người dùng.');
    }
  };

  const exportExcel = () => {
    const rows = users.map((user) => `
      <tr>
        <td>${user.uid}</td>
        <td>${user.name}</td>
        <td>${user.email || ''}</td>
        <td>${user.phone || ''}</td>
        <td>${user.role_label}</td>
        <td>${user.status_label}</td>
        <td>${user.stats?.cancel_rate ?? 0}%</td>
      </tr>
    `).join('');
    const html = `
      <html><head><meta charset="UTF-8" /></head><body>
      <table border="1">
        <thead><tr><th>UID</th><th>Tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Tỷ lệ hủy</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </body></html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <Header
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Tìm theo Tên, Email, Số điện thoại, ID..."
          showCategoryFilter={false}
        />

        <div className="content-canvas">
          <div className="page-header">
            <div className="title-section">
              <h2>Quản lý người dùng</h2>
              <p>Giám sát người tham gia hệ thống, vai trò và trạng thái tài khoản.</p>
            </div>
            <div className="actions">
              <button className="btn-export" type="button" onClick={exportExcel}>
                <FiDownload /> Xuất Excel
              </button>
            </div>
          </div>

          <div className="filters">
            <div className="filter-item">
              <label>Vai trò tài khoản</label>
              <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setCurrentPage(1); }}>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label>Trạng thái tài khoản</label>
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {pageError && <div className="um-page-error">{pageError}</div>}

          <div className="data-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={canSelectAll && selectedUsers.length === currentUsers.length}
                      disabled={!canSelectAll}
                    />
                  </th>
                  <th>Hồ sơ người dùng</th>
                  <th>Thông tin liên hệ</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(3)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="skeleton-row">
                      <td className="checkbox-cell"><div className="skeleton-box" style={{ width: '16px', margin: '0 auto' }}></div></td>
                      <td><div className="skeleton-flex"><div className="skeleton-avatar"></div><div className="skeleton-text-group"><div className="skeleton-box" style={{ width: '120px' }}></div><div className="skeleton-box" style={{ width: '80px', height: '14px' }}></div></div></div></td>
                      <td><div className="skeleton-text-group"><div className="skeleton-box" style={{ width: '150px' }}></div><div className="skeleton-box" style={{ width: '100px', height: '14px' }}></div></div></td>
                      <td><div className="skeleton-box" style={{ width: '100px' }}></div></td>
                      <td><div className="skeleton-box" style={{ width: '80px' }}></div></td>
                      <td><div className="skeleton-box" style={{ width: '80px', borderRadius: '12px' }}></div></td>
                      <td className="action-cell"><div className="skeleton-box" style={{ width: '24px', float: 'right' }}></div></td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const rowKey = `${user.type}:${user.id}`;
                    const isAdmin = user.role_key === 'admin';
                    const isLocked = user.status_key === 'locked';

                    return (
                      <tr key={rowKey} className={isLocked ? 'row-banned' : ''}>
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(rowKey)}
                            onChange={() => handleSelectUser(user)}
                          />
                        </td>
                        <td className="profile-cell">
                          <div className="avatar-fallback">{getInitials(user.name)}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-id">UID: {user.uid}</div>
                          </div>
                        </td>
                        <td className="contact-cell">
                          <div>{user.email || 'Không có email'}</div>
                          <div className="phone">{user.phone || 'Chưa cập nhật SĐT'}</div>
                        </td>
                        <td className="role-cell">
                          <div>{user.role_label}</div>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          <span className={`status-badge ${isLocked ? 'banned' : 'active'}`}>
                            {user.status_label}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button className="btn-more" type="button" onClick={() => toggleDropdown(user)}>
                            <FiMoreVertical />
                          </button>
                          {activeDropdown === rowKey && (
                            <div className="action-dropdown">
                              <button type="button" onClick={() => openDetail(user)}><FiEye /> Xem chi tiết</button>
                              <button type="button" disabled={isAdmin || isLocked} onClick={() => handleLockUser(user)}><FiLock /> Khóa tài khoản</button>
                              <button type="button" className="btn-delete" disabled={isAdmin} onClick={() => handleDeleteUser(user)}><FiTrash2 /> Xóa</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <div className="page-info">
                Hiển thị {totalUsers === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} trong số {totalUsers} người dùng
                {selectedUsers.length > 0 ? ` (Đã chọn ${selectedUsers.length})` : ''}
              </div>
              <div className="page-controls">
                <button
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <FiChevronLeft /> Trước
                </button>
                {[...Array(lastPage)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => setCurrentPage(index + 1)}
                    disabled={isLoading}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === lastPage || lastPage === 0 || isLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Sau <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isDetailOpen && detailUser && (
          <div className="um-modal-overlay" onMouseDown={closeDetail}>
            <section className="um-modal" onMouseDown={(event) => event.stopPropagation()}>
              <header className="um-modal-header">
                <div>
                  <h3>{detailUser.name}</h3>
                  <p>{detailUser.uid} - {detailUser.role_label}</p>
                </div>
                <button type="button" onClick={closeDetail} aria-label="Đóng"><FiX /></button>
              </header>
              <div className="um-modal-body">
                <div className="um-detail-avatar">{getInitials(detailUser.name)}</div>
                <div className="um-detail-grid">
                  <span>Email</span><strong>{detailUser.email || 'Không có email'}</strong>
                  <span>Số điện thoại</span><strong>{detailUser.phone || 'Chưa cập nhật'}</strong>
                  <span>Trạng thái</span><strong>{detailUser.status_label}</strong>
                  <span>Ngày tham gia</span><strong>{formatDate(detailUser.created_at)}</strong>
                  {detailUser.license_plate && <><span>Biển số</span><strong>{detailUser.license_plate}</strong></>}
                  {detailUser.locked_reason && <><span>Lý do khóa</span><strong>{detailUser.locked_reason}</strong></>}
                </div>
                <div className="um-order-stats">
                  <div><span>Tổng đơn</span><strong>{detailUser.stats?.total_orders || 0}</strong></div>
                  <div><span>Hoàn thành</span><strong>{detailUser.stats?.completed_orders || 0}</strong></div>
                  <div><span>Đã hủy</span><strong>{detailUser.stats?.cancelled_orders || 0}</strong></div>
                  <div className={(detailUser.stats?.cancel_rate || 0) >= 50 ? 'danger' : ''}>
                    <span>Tỷ lệ hủy</span><strong>{detailUser.stats?.cancel_rate || 0}%</strong>
                  </div>
                </div>
                {detailUser.role_key === 'customer' && (
                  <p className="um-lock-note">
                    Khách hàng được phép khóa 30 ngày khi có ít nhất 5 đơn và tỷ lệ hủy từ 50% trở lên.
                  </p>
                )}
              </div>
              <footer className="um-modal-footer">
                <button type="button" className="btn-secondary" onClick={closeDetail}>Đóng</button>
                <button
                  type="button"
                  className="btn-lock"
                  disabled={detailUser.role_key === 'admin' || detailUser.status_key === 'locked' || detailUser.type === 'shipper'}
                  onClick={() => handleLockUser(detailUser)}
                >
                  Khóa 30 ngày
                </button>
              </footer>
            </section>
          </div>
        )}

        {toast && <div className="um-toast" role="alert">{toast}</div>}
      </main>
    </div>
  );
};

export default UserManagement;
