import React, { useEffect, useState, useMemo } from 'react'; // Đã import useMemo chuẩn chỉnh
import axios from 'axios'; 
import { NavLink, useNavigate } from 'react-router-dom'; 
import { 
  LayoutDashboard, Package, Users, Briefcase, Truck, 
  Settings, LogOut, Search, Bell,
  ChevronDown, Plus, Edit, Trash2, X,
} from 'lucide-react';
import './ProductManagement.scss';

const ProductManagement = () => {
  const navigate = useNavigate();

  // --- 1. ĐỊNH NGHĨA TOÀN BỘ STATE QUẢN LÝ ---
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State phục vụ Tìm kiếm & Phân trang hiển thị
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [visibleCount, setVisibleCount] = useState(4);
  const categories = ['Tất cả danh mục', 'Rau củ', 'Thịt', 'Đồ khô', 'Trái cây'];

  // State cấu trúc dữ liệu Form trùng khớp với cấu trúc migration Laravel
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    stock: '100',       // Mặc định giá trị dự phòng
    store_id: 1,        // Mặc định giá trị dự phòng
    category_id: 1,     // Mặc định giá trị dự phòng
    category: 'Rau củ',
    status: 'Đang bán',
    image: ''
  });

  // --- 2. HÀM GỌI API LẤY DANH SÁCH SẢN PHẨM ---
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      // Laravel phân trang sẽ trả dữ liệu về trong .data.data, trường hợp không phân trang sẽ lấy luôn .data
      const data = response.data.data || response.data;
      setProducts(data); 
    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 3. BỘ LỌC TÌM KIẾM SẢN PHẨM (SỬ DỤNG USEMEMO) ---
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.name ? product.name.toLowerCase() : '';
      const productId = product.id ? String(product.id).toLowerCase() : '';
      
      const matchesSearch = productName.includes(searchTerm.toLowerCase()) || 
                            productId.includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Tất cả danh mục' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // --- 4. CÁC HÀM XỬ LÝ SỰ KIỆN CRUD VÀ ĐIỀU HƯỚNG ---

  // Bấm nút "Thêm sản phẩm mới" -> Mở Modal rỗng
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ 
      name: '', price: '', original_price: '', stock: '100', 
      store_id: 1, category_id: 1, category: 'Rau củ', status: 'Đang bán', image: '' 
    });
    setIsModalOpen(true);
  };

  // Bấm nút "Sửa" -> Đổ thông tin cũ lên Form
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      original_price: product.original_price || product.price || '',
      stock: product.stock || '100',
      store_id: product.store_id || 1,
      category_id: product.category_id || 1,
      category: product.category || 'Rau củ',
      status: product.status || 'Đang bán',
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  // Bấm nút "Lưu" (Submit Form) -> Gửi yêu cầu sang Laravel
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    // Đảm bảo ép kiểu dữ liệu chuẩn số trước khi truyền lên DB
    const payload = {
      ...formData,
      price: Number(formData.price),
      original_price: Number(formData.original_price || formData.price),
      stock: Number(formData.stock),
      store_id: Number(formData.store_id),
      category_id: Number(formData.category_id)
    };

    try {
      if (editingId) {
        // Gọi API cập nhật sản phẩm (PUT)
        await axios.put(`http://127.0.0.1:8000/api/products/${editingId}`, payload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Gửi API tạo mới sản phẩm (POST)
        await axios.post('http://127.0.0.1:8000/api/products', payload);
        alert("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false); // Đóng modal
      fetchProducts();       // Làm mới bảng danh sách
    } catch (error) {
      console.error("Lỗi chi tiết từ Backend:", error.response?.data);
      if (error.response?.data?.errors) {
        alert("Lỗi dữ liệu đầu vào: " + JSON.stringify(error.response.data.errors));
      } else {
        alert("Lỗi hệ thống: " + (error.response?.data?.message || "Không thể thực hiện yêu cầu"));
      }
    }
  };

  // Bấm nút "Xóa" sản phẩm
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts(); 
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm này.");
      }
    }
  };
  // Hàm bật / tắt bán sản phẩm nhanh bằng API Patch
const handleToggleStatus = async (id, currentStatus) => {
  const nextStatus = currentStatus === 'Đang bán' ? 'Đã ẩn' : 'Đang bán';
  try {
    await axios.patch(`http://127.0.0.1:8000/api/products/${id}/toggle-status`, {
      status: nextStatus
    });
    alert(`Đã chuyển trạng thái sản phẩm sang: ${nextStatus}`);
    fetchProducts(); // Refresh danh sách công khai
  } catch (error) {
    console.error("Lỗi thay đổi trạng thái:", error);
    alert("Không thể thay đổi trạng thái sản phẩm.");
  }
};

  // Đăng xuất tài khoản admin
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị không?")) {
      navigate('/login');
    }
  };

  // Màu sắc Badge trạng thái danh mục
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
      {/* SIDEBAR */}
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
                            <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                          ) : (
                            <div className="no-img">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="col-name">{product.name}</td>
                      <td>
                        <span className={`badge ${getCategoryStyle(product.category || 'Rau củ')}`}>
                          {product.category || 'Rau củ'}
                        </span>
                      </td>
                      <td className="col-price">{Number(product.price || 0).toLocaleString()} VND</td>
                      <td>
                        <div 
    className="status-container" 
    onClick={() => handleToggleStatus(product.id, product.status || 'Đang bán')}
    style={{ cursor: 'pointer' }} 
    title="Click để bật/tắt bán nhanh"
  >
    <span className={`status-dot ${product.status === 'Đang bán' || !product.status ? 'active' : 'inactive'}`}></span>
    <span className={`status-text ${product.status === 'Đang bán' || !product.status ? 'active' : 'inactive'}`}>
      {product.status || 'Đang bán'}
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
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="VD: 45000" />
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