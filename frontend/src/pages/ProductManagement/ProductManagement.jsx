import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Thêm thư viện điều hướng
import { 
  LayoutDashboard, Package, Users, Briefcase, Truck, 
  Settings, LogOut, Search, Bell,
  ChevronDown, Plus, Edit, Trash2, X,
} from 'lucide-react';
import './ProductManagement.scss';

const ProductManagement = () => {
  const navigate = useNavigate(); // Hook dùng để chuyển trang cho nút Đăng xuất

  // 1. DỮ LIỆU MẪU
  const [products, setProducts] = useState([
    { id: '#CTC-001', name: 'Cải Bó Xôi Organic', category: 'Rau củ', price: '45,000', status: 'Đang bán', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150&q=80' },
    { id: '#CTC-002', name: 'Thịt Thăn Bò Úc', category: 'Thịt', price: '280,000', status: 'Đang bán', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=150&q=80' },
    { id: '#CTC-003', name: 'Gạo ST25 Túi 5kg', category: 'Đồ khô', price: '195,000', status: 'Đã ẩn', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=150&q=80' },
    { id: '#CTC-004', name: 'Cà Chua Cherry VietGAP', category: 'Rau củ', price: '55,000', status: 'Đang bán', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&q=80' },
    { id: '#CTC-005', name: 'Thịt Ba Chỉ Heo', category: 'Thịt', price: '160,000', status: 'Đang bán', image: 'https://images.unsplash.com/photo-1628318160410-b5413fc4f2fc?w=150&q=80' },
  ]);

  // 2. STATE TÌM KIẾM, LỌC & PHÂN TRANG
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [visibleCount, setVisibleCount] = useState(4);
  const categories = ['Tất cả danh mục', 'Rau củ', 'Thịt', 'Đồ khô', 'Trái cây'];

  // 3. STATE CHO MODAL THÊM/SỬA SẢN PHẨM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Rau củ', price: '', status: 'Đang bán', image: ''
  });

  // ================= XỬ LÝ SỰ KIỆN =================

  // Đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị không?")) {
      navigate('/login');
    }
  };

  // Tìm kiếm và Lọc
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả danh mục' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Xóa sản phẩm
  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Mở Modal Thêm mới
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Rau củ', price: '', status: 'Đang bán', image: '' });
    setIsModalOpen(true);
  };

  // Mở Modal Chỉnh sửa
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // Lưu sản phẩm (Thêm hoặc Sửa)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      const newProduct = { ...formData, id: `#CTC-00${products.length + 1}` };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  // Helpers
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Rau củ': return 'badge-green';
      case 'Thịt': return 'badge-blue';
      case 'Đồ khô': return 'badge-red';
      default: return 'badge-default';
    }
  };

  return (
    <div className="new-admin-layout">
      {/* SIDEBAR ĐÃ ĐƯỢC TÍCH HỢP ĐIỀU HƯỚNG */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Chợ Tới Cửa</h1>
          <p>Market Management</p>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <LayoutDashboard size={20} /><span>Bảng điều khiển</span>
            </NavLink>
            <NavLink to="/product-management" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Package size={20} /><span>Quản lý sản phẩm</span>
            </NavLink>
            <NavLink to="/user-management" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={20} /><span>Quản lý người dùng</span>
            </NavLink>
            <NavLink to="/quanlydoitac-gia" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Briefcase size={20} /><span>Quản lý đối tác</span>
            </NavLink>
            <NavLink to="/quanlyvanchuyen" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Truck size={20} /><span>Quản lý vận chuyển</span>
            </NavLink>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <ul className="nav-list">
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Settings size={20} /><span>Cài đặt</span>
            </NavLink>
            {/* Đổi thẻ Đăng xuất thành dạng có thể click gọi hàm */}
            <li className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogOut size={20} /><span>Đăng xuất</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <div className="search-box">
              <Search size={18} className="icon-search" />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc mã..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <span>Danh mục:</span>
              <div className="dropdown">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown size={16} className="icon-chevron" />
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="notification"><Bell size={20} className="icon-bell" /><span className="dot-red"></span></div>
            <div className="divider"></div>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Quản lý chợ</span>
              </div>
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="avatar" />
            </div>
          </div>
        </header>

        <div className="content-body">
          <div className="page-header">
            <div>
              <h2>Quản lý sản phẩm</h2>
              <p>Manage your inventory, prices, and visibility on the storefront.</p>
            </div>
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={16} /> Thêm sản phẩm mới
            </button>
          </div>

          <div className="table-card">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>HÌNH ẢNH</th>
                  <th>TÊN SẢN PHẨM</th>
                  <th>DANH MỤC</th>
                  <th>GIÁ WEB</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="col-id">{product.id}</td>
                      <td>
                        <div className="img-placeholder">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div className="no-img">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="col-name">{product.name}</td>
                      <td>
                        <span className={`badge ${getCategoryStyle(product.category)}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="col-price">{product.price} VND</td>
                      <td>
                        <div className="status-container">
                          <span className={`status-dot ${product.status === 'Đang bán' ? 'active' : 'inactive'}`}></span>
                          <span className={`status-text ${product.status === 'Đang bán' ? 'active' : 'inactive'}`}>
                            {product.status}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons">
                          <button className="btn-icon btn-edit" onClick={() => handleEdit(product)}><Edit size={16} /></button>
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(product.id, product.name)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="text-center empty-state">Không tìm thấy sản phẩm nào.</td></tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              {visibleCount < filteredProducts.length ? (
                <button className="btn-outline" onClick={() => setVisibleCount(prev => prev + 4)}>
                  <ChevronDown size={16} /> Xem thêm
                </button>
              ) : <div style={{ width: '135px' }}></div>}
              <span className="footer-info">Hiển thị 1-{displayedProducts.length} trong số {filteredProducts.length} sản phẩm</span>
            </div>
          </div>
        </div>

        {/* MODAL THÊM / SỬA SẢN PHẨM */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="modal-form">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="VD: Cải Bó Xôi" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Danh mục</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="Rau củ">Rau củ</option>
                      <option value="Thịt">Thịt</option>
                      <option value="Đồ khô">Đồ khô</option>
                      <option value="Trái cây">Trái cây</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Giá (VND)</label>
                    <input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="VD: 45,000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Đang bán">Đang bán</option>
                      <option value="Đã ẩn">Đã ẩn</option>
                      <option value="Hết hàng">Hết hàng</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Link Ảnh (URL)</label>
                    <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                  <button type="submit" className="btn-primary">Lưu sản phẩm</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
