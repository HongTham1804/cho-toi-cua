import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { getAdminToken } from '../../services/adminAuthApi';
import './ProductManagement.scss';

const API_BASE_URL = 'http://localhost:8000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const PAGE_SIZE = 8;
const ALL_CATEGORIES = 'all';
const ALL_STATUSES = 'all';
const EMPTY_FORM = {
  store_id: '',
  category_id: '',
  name: '',
  original_price: '',
  price: '',
  discount_price: '',
  stock: '1',
  unit: '',
  image_url: '',
  description: '',
  status: 'available',
};

const normalizeList = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizePagination = (payload) => ({
  items: normalizeList(payload),
  currentPage: Number(payload?.data?.current_page || 1),
  lastPage: Number(payload?.data?.last_page || 1),
  total: Number(payload?.data?.total || normalizeList(payload).length),
});

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

const formatProductCode = (id) => `#CTC-${String(id).padStart(3, '0')}`;
const formatStoreCode = (id) => `#ST-${String(id || 0).padStart(3, '0')}`;

const getProductStatus = (product) => {
  if (product.is_active === false || Number(product.stock || 0) <= 0) {
    return { value: 'out_of_stock', label: 'Hết hàng' };
  }

  return { value: 'available', label: 'Đang bán' };
};

const mapProduct = (product) => {
  const status = getProductStatus(product);

  return {
    ...product,
    id: Number(product.id),
    store_id: Number(product.store_id || 0),
    category_id: Number(product.category_id || 0),
    code: formatProductCode(product.id),
    storeCode: formatStoreCode(product.store_id),
    categoryName: product.category?.name || 'Chưa có danh mục',
    storeName: product.store?.name || '',
    image: resolveImageUrl(product.image_url),
    priceNumber: Number(product.price || 0),
    originalPriceNumber: Number(product.original_price || product.price || 0),
    discountPriceNumber: product.discount_price ? Number(product.discount_price) : '',
    stockNumber: Number(product.stock || 0),
    statusValue: status.value,
    statusLabel: status.label,
  };
};

const requestJson = async (url, options = {}) => {
  const token = getAdminToken();
  const response = await fetch(url, {
    ...options,
    headers: {
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

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedStatus, setSelectedStatus] = useState(ALL_STATUSES);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageError, setPageError] = useState('');
  const [toast, setToast] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const selectedCategoryName = useMemo(
    () => categories.find((category) => String(category.id) === String(selectedCategory))?.name || '',
    [categories, selectedCategory]
  );
  const hasMoreProducts = page < lastPage;
  const isFormMode = modalMode === 'create' || modalMode === 'edit';
  const isReadOnly = modalMode === 'view';

  useEffect(() => {
    let isMounted = true;

    async function loadFilters() {
      try {
        const [categoryPayload, storePayload] = await Promise.all([
          requestJson(`${API_BASE_URL}/categories`),
          requestJson(`${API_BASE_URL}/stores`),
        ]);

        if (!isMounted) return;

        const nextCategories = normalizeList(categoryPayload);
        const nextStores = normalizeList(storePayload);
        setCategories(nextCategories);
        setStores(nextStores);
        setFormData((current) => ({
          ...current,
          category_id: current.category_id || String(nextCategories[0]?.id || ''),
          store_id: current.store_id || String(nextStores[0]?.id || ''),
        }));
      } catch (error) {
        if (isMounted) setPageError(error.message || 'Không thể tải danh mục hoặc siêu thị.');
      }
    }

    loadFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }, []);

  const buildProductParams = useCallback((nextPage) => {
    const params = new URLSearchParams({
      per_page: String(PAGE_SIZE),
      page: String(nextPage),
      sort: 'newest',
    });

    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCategory !== ALL_CATEGORIES) params.set('category_id', selectedCategory);
    if (selectedStatus !== ALL_STATUSES) params.set('stock_status', selectedStatus);

    return params;
  }, [searchTerm, selectedCategory, selectedStatus]);

  const loadProducts = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setPageError('');
    }

    try {
      const payload = await requestJson(`${API_BASE_URL}/products?${buildProductParams(nextPage).toString()}`);
      const pagination = normalizePagination(payload);
      const nextProducts = pagination.items.map(mapProduct);

      setProducts((currentProducts) => (append ? [...currentProducts, ...nextProducts] : nextProducts));
      setPage(pagination.currentPage);
      setLastPage(pagination.lastPage);
      setTotalProducts(pagination.total);
    } catch (error) {
      if (!append) setPageError(error.message || 'Không thể tải danh sách sản phẩm.');
      else showToast(error.message || 'Không thể tải thêm sản phẩm.');
    } finally {
      if (append) setIsLoadingMore(false);
      else setIsLoading(false);
    }
  }, [buildProductParams, showToast]);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setSelectedProduct(null);
    setFormData(EMPTY_FORM);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProducts({ nextPage: 1, append: false });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  useEffect(() => {
    if (!modalMode) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeModal, modalMode]);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      ...EMPTY_FORM,
      category_id: String(categories[0]?.id || ''),
      store_id: String(stores[0]?.id || ''),
    });
    setModalMode('create');
  };

  const openViewModal = async (product) => {
    setSelectedProduct(product);
    setModalMode('view');

    try {
      const payload = await requestJson(`${API_BASE_URL}/products/${product.id}`);
      setSelectedProduct(mapProduct(payload.data));
    } catch (error) {
      showToast(error.message || 'Không thể lấy chi tiết sản phẩm.');
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      store_id: String(product.store_id || ''),
      category_id: String(product.category_id || ''),
      name: product.name || '',
      original_price: String(product.originalPriceNumber || ''),
      price: String(product.priceNumber || ''),
      discount_price: product.discountPriceNumber === '' ? '' : String(product.discountPriceNumber),
      stock: String(product.stockNumber || 0),
      unit: product.unit || '',
      image_url: product.image_url || '',
      description: product.description || '',
      status: product.statusValue,
    });
    setModalMode('edit');
  };

  const buildProductPayload = () => {
    const nextStock = formData.status === 'out_of_stock' ? 0 : Number(formData.stock || 0);

    return {
      store_id: Number(formData.store_id),
      category_id: Number(formData.category_id),
      name: formData.name.trim(),
      original_price: Number(formData.original_price || formData.price || 0),
      price: Number(formData.price || 0),
      discount_price: formData.discount_price === '' ? null : Number(formData.discount_price),
      stock: nextStock,
      unit: formData.unit.trim() || null,
      image_url: formData.image_url.trim() || null,
      description: formData.description.trim() || null,
      is_active: true,
    };
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = buildProductPayload();
      const isEditMode = modalMode === 'edit' && selectedProduct;
      const endpoint = isEditMode
        ? `${API_BASE_URL}/products/${selectedProduct.id}`
        : `${API_BASE_URL}/products`;
      const method = isEditMode ? 'PATCH' : 'POST';
      const responsePayload = await requestJson(endpoint, {
        method,
        body: JSON.stringify(payload),
      });
      const savedProduct = mapProduct(responsePayload.data);

      if (isEditMode) {
        setProducts((currentProducts) =>
          currentProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product))
        );
      } else {
        setProducts((currentProducts) => [savedProduct, ...currentProducts]);
        setTotalProducts((currentTotal) => currentTotal + 1);
      }

      closeModal();
      showToast(isEditMode ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm mới.');
    } catch (error) {
      showToast(error.message || 'Không thể lưu sản phẩm.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) return;

    try {
      await requestJson(`${API_BASE_URL}/products/${product.id}`, { method: 'DELETE' });
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
      setTotalProducts((currentTotal) => Math.max(0, currentTotal - 1));
      showToast('Đã xóa sản phẩm.');
    } catch (error) {
      showToast(error.message || 'Không thể xóa sản phẩm.');
    }
  };

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const getCategoryStyle = (categoryId) => {
    const tones = ['badge-green', 'badge-blue', 'badge-red', 'badge-default'];
    const index = categories.findIndex((category) => Number(category.id) === Number(categoryId));
    return tones[index % tones.length] || 'badge-default';
  };

  return (
    <div className="new-admin-layout">
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <div className="search-box">
              <Search size={18} className="icon-search" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="category-filter">
              <span>Danh mục:</span>
              <div className="dropdown">
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option value={ALL_CATEGORIES}>Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="icon-chevron" />
              </div>
            </div>
            <div className="category-filter">
              <span>Trạng thái:</span>
              <div className="dropdown">
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                  <option value={ALL_STATUSES}>Tất cả trạng thái</option>
                  <option value="available">Đang bán</option>
                  <option value="out_of_stock">Hết hàng</option>
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
              <p>Quản lý tồn kho, giá bán và trạng thái hiển thị của sản phẩm.</p>
            </div>
            <button className="btn-primary" onClick={openCreateModal} type="button">
              <Plus size={16} /> Thêm sản phẩm mới
            </button>
          </div>

          {pageError && <div className="page-error">{pageError}</div>}

          <div className="table-card">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Mã siêu thị</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá web</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="8" className="text-center empty-state">Đang tải sản phẩm...</td></tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="col-id">{product.code}</td>
                      <td className="col-id">
                        <span title={product.storeName}>{product.storeCode}</span>
                      </td>
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
                        <span className={`badge ${getCategoryStyle(product.category_id)}`}>
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="col-price">{formatCurrency(product.priceNumber)}</td>
                      <td>
                        <div className="status-container">
                          <span className={`status-dot ${product.statusValue === 'available' ? 'active' : 'inactive'}`}></span>
                          <span className={`status-text ${product.statusValue === 'available' ? 'active' : 'inactive'}`}>
                            {product.statusLabel}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons">
                          <button className="btn-icon btn-view" type="button" title="Xem chi tiết" onClick={() => openViewModal(product)}><Eye size={16} /></button>
                          <button className="btn-icon btn-edit" type="button" title="Chỉnh sửa" onClick={() => openEditModal(product)}><Edit size={16} /></button>
                          <button className="btn-icon btn-delete" type="button" title="Xóa" onClick={() => handleDelete(product)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="text-center empty-state">Không tìm thấy sản phẩm nào.</td></tr>
                )}
              </tbody>
            </table>

            <div className="table-footer">
              {hasMoreProducts ? (
                <button
                  className="btn-outline"
                  type="button"
                  onClick={() => loadProducts({ nextPage: page + 1, append: true })}
                  disabled={isLoadingMore}
                >
                  <ChevronDown size={16} /> {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
                </button>
              ) : <div style={{ width: '135px' }}></div>}
              <span className="footer-info">
                Hiển thị {products.length === 0 ? 0 : 1}-{products.length} trong số {totalProducts} sản phẩm
                {selectedCategoryName ? ` thuộc ${selectedCategoryName}` : ''}
              </span>
            </div>
          </div>
        </div>

        {(isFormMode || isReadOnly) && (
          <div className="modal-overlay" onMouseDown={closeModal}>
            <div className="modal-content" onMouseDown={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {modalMode === 'create' && 'Thêm sản phẩm mới'}
                  {modalMode === 'edit' && 'Chỉnh sửa sản phẩm'}
                  {modalMode === 'view' && 'Chi tiết sản phẩm'}
                </h3>
                <button className="close-btn" onClick={closeModal} type="button"><X size={20} /></button>
              </div>

              {isReadOnly ? (
                <div className="product-detail-panel">
                  <div className="detail-image">
                    {selectedProduct?.image ? <img src={selectedProduct.image} alt={selectedProduct.name} /> : <span>No Img</span>}
                  </div>
                  <div className="detail-grid">
                    <span>Mã sản phẩm</span><strong>{selectedProduct?.code}</strong>
                    <span>Mã siêu thị</span><strong>{selectedProduct?.storeCode}</strong>
                    <span>Tên sản phẩm</span><strong>{selectedProduct?.name}</strong>
                    <span>Danh mục</span><strong>{selectedProduct?.categoryName}</strong>
                    <span>Giá web</span><strong>{formatCurrency(selectedProduct?.priceNumber)}</strong>
                    <span>Tồn kho</span><strong>{selectedProduct?.stockNumber}</strong>
                    <span>Đơn vị</span><strong>{selectedProduct?.unit || 'Chưa cập nhật'}</strong>
                    <span>Trạng thái</span><strong>{selectedProduct?.statusLabel}</strong>
                    <span>Mô tả</span><strong>{selectedProduct?.description || 'Chưa có mô tả'}</strong>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProduct} className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Mã siêu thị</label>
                      <select required value={formData.store_id} onChange={(event) => updateForm('store_id', event.target.value)}>
                        <option value="">Chọn siêu thị</option>
                        {stores.map((store) => (
                          <option key={store.id} value={String(store.id)}>
                            {formatStoreCode(store.id)} - {store.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Danh mục</label>
                      <select required value={formData.category_id} onChange={(event) => updateForm('category_id', event.target.value)}>
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                          <option key={category.id} value={String(category.id)}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input type="text" required value={formData.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="VD: Cải bó xôi" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giá gốc (VND)</label>
                      <input type="number" min="0" required value={formData.original_price} onChange={(event) => updateForm('original_price', event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Giá web (VND)</label>
                      <input type="number" min="0" required value={formData.price} onChange={(event) => updateForm('price', event.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giá khuyến mãi (nếu có)</label>
                      <input type="number" min="0" value={formData.discount_price} onChange={(event) => updateForm('discount_price', event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Tồn kho</label>
                      <input type="number" min="0" required value={formData.stock} onChange={(event) => updateForm('stock', event.target.value)} disabled={formData.status === 'out_of_stock'} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Trạng thái</label>
                      <select value={formData.status} onChange={(event) => updateForm('status', event.target.value)}>
                        <option value="available">Đang bán</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Đơn vị</label>
                      <input type="text" value={formData.unit} onChange={(event) => updateForm('unit', event.target.value)} placeholder="VD: 500g, 1kg" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Link ảnh (URL)</label>
                    <input type="text" value={formData.image_url} onChange={(event) => updateForm('image_url', event.target.value)} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea value={formData.description} onChange={(event) => updateForm('description', event.target.value)} rows="3" placeholder="Mô tả ngắn về sản phẩm" />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
                    <button type="submit" className="btn-primary" disabled={isSaving}>
                      {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {toast && <div className="pm-toast" role="alert">{toast}</div>}
      </main>
    </div>
  );
};

export default ProductManagement;
