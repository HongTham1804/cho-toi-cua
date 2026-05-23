import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import './ProductManagement.scss';
import thitBoUtImg from '/image/assets/thịt thăn bò út.jpg';
const ProductManagement = ({ searchTerm = "" }) => {
  const [products, setProducts] = useState([
    { id: '#SP-001', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=150&auto=format&fit=crop', name: 'Rau Cải Ngọt Hữu Cơ', category: 'Rau củ', catTheme: 'green', price: '25.000đ', status: 'Còn hàng' },
    { 
      id: '#SP-002', 
      image: thitBoUtImg, // <-- Thay đổi ở đây: Bỏ dấu nháy '', dùng trực tiếp tên biến đã import
      name: 'Thịt Thăn Bò Úc', 
      category: 'Thịt tươi', 
      catTheme: 'blue', 
      price: '250.000đ', 
      status: 'Còn hàng' 
    },
    { id: '#SP-003', image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?q=80&w=150&auto=format&fit=crop', name: 'Dứa Mật Lưới Mộc Châu', category: 'Trái cây', catTheme: 'orange', price: '45.000đ', status: 'Hết hàng' }
  ]);

  // 1. Quản lý trạng thái Ẩn/Hiện của Popup
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quản lý ID sản phẩm đang chỉnh sửa (nếu là null nghĩa là đang ở chế độ THÊM MỚI)
  const [editingId, setEditingId] = useState(null);

  // 2. State lưu trữ dữ liệu người dùng nhập vào Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Rau củ',
    price: '',
    status: 'Còn hàng'
  });

  // Logic lọc tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic Xóa sản phẩm
  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${name}" không?`)) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // Hành động: Mở modal ở chế độ THÊM MỚI
  const handleOpenAddModal = () => {
    setNewProduct({ name: '', category: 'Rau củ', price: '', status: 'Còn hàng' });
    setEditingId(null); // Đưa về null để xác định là thêm mới
    setIsModalOpen(true);
  };

  // Hành động: Mở modal ở chế độ CHỈNH SỬA (Đổ dữ liệu cũ vào Form)
  const handleEditClick = (product) => {
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      status: product.status
    });
    setEditingId(product.id); // Lưu lại ID sản phẩm cần sửa
    setIsModalOpen(true);
  };

  // Hành động: Đóng modal và dọn dẹp dữ liệu tạm
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewProduct({ name: '', category: 'Rau củ', price: '', status: 'Còn hàng' });
  };

  // 3. Hàm xử lý khi bấm nút "Lưu" (Xử lý thông minh cho cả Thêm và Sửa)
  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Vui lòng nhập tên và giá sản phẩm!");
      return;
    }

    // Tự động gán mã theme màu cho danh mục tương ứng
    let theme = 'green';
    if (newProduct.category === 'Thịt tươi') theme = 'blue';
    if (newProduct.category === 'Trái cây') theme = 'orange';

    if (editingId) {
      // --- NẾU LÀ CHẾ ĐỘ CHỈNH SỬA ---
      setProducts(products.map((product) => 
        product.id === editingId 
          ? { 
              ...product, 
              name: newProduct.name, 
              category: newProduct.category, 
              catTheme: theme, 
              price: newProduct.price, 
              status: newProduct.status 
            }
          : product
      ));
    } else {
      // --- NẾU LÀ CHẾ ĐỘ THÊM MỚI ---
      const newId = `#SP-00${products.length + 1}`;
      const productToAdd = {
        id: newId,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=150&auto=format&fit=crop', // Ảnh minh họa mặc định
        name: newProduct.name,
        category: newProduct.category,
        catTheme: theme,
        price: newProduct.price,
        status: newProduct.status,
      };
      // Thêm sản phẩm mới lên đầu danh sách
      setProducts([productToAdd, ...products]); 
    }
    
    // Lưu xong thì đóng form
    handleCloseModal();
  };

  return (
    <div className="product-management-page">
      <div className="page-header">
        <div className="title-group">
          <h2>Quản lý sản phẩm</h2>
          <p>Quản lý danh sách sản phẩm, giá cả và tồn kho</p>
        </div>
        {/* Đổi sang gọi hàm mở modal thêm mới */}
        <button className="btn-add" onClick={handleOpenAddModal}>
          <FiPlus className="icon" /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="col-id">Mã SP</th>
                <th className="col-image">Hình ảnh</th>
                <th className="col-name">Tên sản phẩm</th>
                <th className="col-category">Danh mục</th>
                <th className="col-price">Giá bán</th>
                <th className="col-status">Trạng thái</th>
                <th className="col-actions text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="col-id">{product.id}</td>
                    <td className="col-image"><img src={product.image} alt={product.name} /></td>
                    <td className="col-name">{product.name}</td>
                    <td className="col-category"><span className={`badge-category theme-${product.catTheme}`}>{product.category}</span></td>
                    <td className="col-price">{product.price}</td>
                    <td className="col-status">
                      <div className="status-indicator">
                        <span className={`dot ${product.status === 'Còn hàng' ? 'active' : 'inactive'}`}></span>
                        <span className={`text ${product.status === 'Còn hàng' ? 'text-active' : 'text-inactive'}`}>{product.status}</span>
                      </div>
                    </td>
                    <td className="col-actions text-right">
                      <div className="action-buttons">
                        {/* Kích hoạt tính năng sửa khi click biểu tượng cây bút */}
                        <button 
                          className="btn-icon edit" 
                          title="Chỉnh sửa" 
                          onClick={() => handleEditClick(product)}
                        >
                          <FiEdit />
                        </button>
                        <button className="btn-icon delete" title="Xóa" onClick={() => handleDelete(product.id, product.name)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Không tìm thấy sản phẩm phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- GIAO DIỆN POPUP MODAL ĐA NĂNG --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              {/* Tiêu đề tự động thay đổi theo trạng thái */}
              <h3>{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
              <button className="btn-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input 
                  type="text" 
                  placeholder="VD: Cà rốt Đà Lạt..." 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="Rau củ">Rau củ</option>
                  <option value="Thịt tươi">Thịt tươi</option>
                  <option value="Trái cây">Trái cây</option>
                </select>
              </div>
              <div className="form-group">
                <label>Giá bán</label>
                <input 
                  type="text" 
                  placeholder="VD: 40.000đ" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                >
                  <option value="Còn hàng">Còn hàng</option>
                  <option value="Hết hàng">Hết hàng</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Hủy bỏ</button>
              {/* Chữ hiển thị trên nút tự động thay đổi */}
              <button className="btn-submit" onClick={handleSaveProduct}>
                {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;