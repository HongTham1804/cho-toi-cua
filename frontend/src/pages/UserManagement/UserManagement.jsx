import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { usersData } from './mockData';
import { 
  FiDownload, FiUserPlus, FiFilter, FiMoreVertical, 
  FiEdit2, FiLock, FiTrash2, FiEye, FiArrowUp, FiArrowDown,
  FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import './UserManagement.scss';

const UserManagement = () => {
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'Khách hàng' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // State MỚI: Trạng thái Loading
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập thời gian tải dữ liệu từ Backend mất 1.5 giây khi mới mở trang
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer); // Dọn dẹp timer
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, typeFilter]);

  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchType = typeFilter === 'all' || user.roleType === typeFilter;
    return matchSearch && matchRole && matchStatus && matchType;
  });

  const sortedUsers = useMemo(() => {
    let sortableItems = [...filteredUsers];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'joinDate') {
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUsers, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleResetFilters = () => {
    setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); setTypeFilter('all'); setSortConfig(null);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const userToAdd = {
      id: `#CU${Math.floor(Math.random() * 9000) + 1000}`,
      name: newUser.name, email: newUser.email, phone: newUser.phone,
      role: newUser.role, roleType: "MỚI", roleColor: "#004395",
      badgeBg: "#D8E2FF", badgeColor: "#004395",
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: "Đang hoạt động", avatar: `https://i.pravatar.cc/150?u=${newUser.email}`
    };
    setUsers([userToAdd, ...users]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: 'Khách hàng' });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allUserIds = currentUsers.map(user => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleDropdown = (id) => setActiveDropdown(activeDropdown === id ? null : id);

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    setActiveDropdown(null);
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <div className="content-canvas">
          <div className="page-header">
            <div className="title-section">
              <h2>Quản lý người dùng</h2>
              <p>Giám sát người tham gia hệ thống, vai trò và trạng thái tài khoản.</p>
            </div>
            <div className="actions">
              <button className="btn-export"><FiDownload /> Xuất Excel</button>
              <button className="btn-create" onClick={() => setIsModalOpen(true)}><FiUserPlus /> Tạo người dùng mới</button>
            </div>
          </div>

          <div className="filters">
            <div className="filter-item">
              <label>Vai trò tài khoản</label>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">Tất cả vai trò</option>
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Nhân viên giao hàng">Nhân viên giao hàng</option>
                <option value="Khách hàng">Khách hàng</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Trạng thái tài khoản</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Bị khóa">Bị khóa</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Loại thành viên</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Tất cả các loại</option>
                <option value="VIP">VIP</option>
                <option value="THƯỜNG">THƯỜNG</option>
                <option value="MỚI">MỚI</option>
              </select>
            </div>
            <button className="btn-reset-filter" onClick={handleResetFilters}><FiFilter /> Đặt lại bộ lọc</button>
          </div>

          <div className="data-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                      disabled={isLoading} // Khóa ô chọn khi đang tải
                    />
                  </th>
                  <th className="sortable" onClick={() => handleSort('name')}>
                    Hồ sơ người dùng 
                    {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <FiArrowUp className="sort-icon" /> : <FiArrowDown className="sort-icon" />)}
                  </th>
                  <th>Thông tin liên hệ</th>
                  <th>Vai trò & Loại</th>
                  <th className="sortable" onClick={() => handleSort('joinDate')}>
                    Ngày tham gia
                    {sortConfig?.key === 'joinDate' && (sortConfig.direction === 'asc' ? <FiArrowUp className="sort-icon" /> : <FiArrowDown className="sort-icon" />)}
                  </th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* Lôgic render mới: Kiểm tra isLoading trước */}
                {isLoading ? (
                  // Hiển thị 3 hàng Skeleton giả lập dữ liệu đang tải
                  [...Array(3)].map((_, index) => (
                    <tr key={`skeleton-${index}`} className="skeleton-row">
                      <td className="checkbox-cell"><div className="skeleton-box" style={{ width: '16px', margin: '0 auto' }}></div></td>
                      <td>
                        <div className="skeleton-flex">
                          <div className="skeleton-avatar"></div>
                          <div className="skeleton-text-group">
                            <div className="skeleton-box" style={{ width: '120px' }}></div>
                            <div className="skeleton-box" style={{ width: '80px', height: '14px' }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="skeleton-text-group">
                          <div className="skeleton-box" style={{ width: '150px' }}></div>
                          <div className="skeleton-box" style={{ width: '100px', height: '14px' }}></div>
                        </div>
                      </td>
                      <td>
                        <div className="skeleton-text-group">
                          <div className="skeleton-box" style={{ width: '100px' }}></div>
                          <div className="skeleton-box" style={{ width: '50px', height: '14px' }}></div>
                        </div>
                      </td>
                      <td><div className="skeleton-box" style={{ width: '80px' }}></div></td>
                      <td><div className="skeleton-box" style={{ width: '80px', borderRadius: '12px' }}></div></td>
                      <td className="action-cell"><div className="skeleton-box" style={{ width: '24px', float: 'right' }}></div></td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  // Dữ liệu thật khi đã tải xong
                  currentUsers.map((user) => (
                    <tr key={user.id} className={user.status === "Bị khóa" ? "row-banned" : ""}>
                      <td className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="profile-cell">
                        <img src={user.avatar} alt={user.name} />
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">UID: {user.id}</div>
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div>{user.email}</div>
                        <div className="phone">{user.phone}</div>
                      </td>
                      <td className="role-cell">
                        <div style={{ color: user.roleColor, fontWeight: 600 }}>{user.role}</div>
                        <span className="badge" style={{ backgroundColor: user.badgeBg, color: user.badgeColor }}>
                          {user.roleType}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <span className={`status-badge ${user.status === "Bị khóa" ? "banned" : "active"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        <button className="btn-more" onClick={() => toggleDropdown(user.id)}>
                          <FiMoreVertical />
                        </button>
                        {activeDropdown === user.id && (
                          <div className="action-dropdown">
                            <button><FiEye /> Xem chi tiết</button>
                            <button><FiEdit2 /> Chỉnh sửa</button>
                            <button><FiLock /> Khóa tài khoản</button>
                            <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}><FiTrash2 /> Xóa</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  // Báo lỗi nếu không có kết quả
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
                Hiển thị {sortedUsers.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedUsers.length)} trong số {sortedUsers.length} người dùng
                {selectedUsers.length > 0 ? ` (Đã chọn ${selectedUsers.length})` : ''}
              </div>
              <div className="page-controls">
                <button 
                  disabled={currentPage === 1 || isLoading} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <FiChevronLeft /> Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1} 
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => setCurrentPage(i + 1)}
                    disabled={isLoading}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages || totalPages === 0 || isLoading} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Sau <FiChevronRight />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thêm người dùng mới</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group"><label>Họ và Tên</label><input type="text" required placeholder="Nhập họ tên" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})}/></div>
              <div className="form-group"><label>Email</label><input type="email" required placeholder="name@example.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})}/></div>
              <div className="form-group"><label>Số điện thoại</label><input type="text" required placeholder="+84..." value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})}/></div>
              <div className="form-group">
                <label>Vai trò</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                  <option value="Nhân viên giao hàng">Nhân viên giao hàng</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="btn-save">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
