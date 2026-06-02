import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  fetchPartnerProducts,
  updatePartnerProductInfo,
  updatePartnerProductStock,
  updatePartnerProductStatus,
} from "../../services/partnerInventoryApi";
import "./index.css";

const NAV_ITEMS = [
  { id: "orders", label: "Đơn hàng", icon: "fa-solid fa-clipboard-list", path: "/order-management" },
  { id: "inventory", label: "Quản lý kho", icon: "fa-solid fa-tags", path: "/inventory" },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

export default function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStock, setEditingStock] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setPageError("");

    fetchPartnerProducts()
      .then(({ store: apiStore, products: apiProducts }) => {
        if (!isMounted) return;
        setStore(apiStore);
        setProducts(apiProducts);
        setIsOpen(apiStore?.status !== "inactive");
      })
      .catch((error) => {
        if (!isMounted) return;
        setPageError(error.message || "Không lấy được sản phẩm trong kho.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    window.setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }

  function handlePartnerLogout() {
    window.localStorage.removeItem("partner_token");
    window.localStorage.removeItem("partner_user");
    window.localStorage.removeItem("partner_store");
    window.sessionStorage.removeItem("partner_token");
    window.sessionStorage.removeItem("partner_user");
    window.sessionStorage.removeItem("partner_store");
    navigate("/partner-login", { replace: true });
  }

  function handleViewDetail(id) {
    navigate(`/product/${id}`);
  }

  function startEditStock(product) {
    setEditingStock(product.id);
    setStockInput(String(product.stock));
  }

  function cancelEditStock() {
    setEditingStock(null);
    setStockInput("");
  }

  async function commitStock(id) {
    const nextStock = Number.parseInt(stockInput, 10);

    if (Number.isNaN(nextStock) || nextStock < 0) {
      showToast("Số lượng không hợp lệ.", "error");
      cancelEditStock();
      return;
    }

    cancelEditStock();

    try {
      const updatedProduct = await updatePartnerProductStock(id, nextStock);
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === id ? updatedProduct : product))
      );
      showToast("Đã cập nhật tồn kho.");
    } catch (error) {
      showToast(error.message || "Không cập nhật được tồn kho.", "error");
    }
  }

  async function handleToggleProduct(product) {
    const nextActive = !product.active;

    try {
      const updatedProduct = await updatePartnerProductStatus(product.id, nextActive);
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? updatedProduct : item))
      );
      showToast(
        nextActive ? `Đã bật bán "${product.name}".` : `Đã tạm hết hàng "${product.name}".`,
        nextActive ? "success" : "warn"
      );
    } catch (error) {
      showToast(error.message || "Không cập nhật được trạng thái sản phẩm.", "error");
    }
  }

  async function handleSaveProductInfo({ id, name, originalPrice }) {
    const cleanName = name.trim();
    const nextOriginalPrice = Number(originalPrice);

    if (!cleanName || Number.isNaN(nextOriginalPrice) || nextOriginalPrice < 0) {
      showToast("Tên sản phẩm hoặc giá gốc không hợp lệ.", "error");
      return;
    }

    try {
      const updatedProduct = await updatePartnerProductInfo(id, {
        name: cleanName,
        originalPrice: nextOriginalPrice,
      });
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === id ? updatedProduct : product))
      );
      setEditingProduct(null);
      showToast("Đã cập nhật tên và giá gốc sản phẩm.");
    } catch (error) {
      showToast(error.message || "Không cập nhật được sản phẩm.", "error");
    }
  }

  const filters = useMemo(() => {
    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return [
      { id: "all", label: "Tất cả" },
      ...categories.map((category) => ({ id: category, label: category })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeFilter === "all" || product.category === activeFilter;
      const matchesSearch = !keyword || product.name.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, products, searchTerm]);

  return (
    <div className="inv-page">
      <aside className="inv-sidebar">
        <div className="inv-brand">
          <div className="inv-brand-icon">
            <i className="fa-solid fa-cart-shopping" />
          </div>
          <div>
            <p className="inv-brand-name">Partner Dashboard</p>
            <p className={`inv-store-status ${isOpen ? "open" : "closed"}`}>
              <span className="inv-status-dot" />
              {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`inv-toggle-btn ${isOpen ? "is-open" : "is-closed"}`}
          onClick={() => {
            setIsOpen((value) => !value);
            showToast(isOpen ? "Đã đóng cửa hàng." : "Đã mở cửa hàng!");
          }}
        >
          Mở/Đóng cửa hàng
        </button>

        <nav className="inv-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`inv-nav-item ${item.id === "inventory" ? "active" : ""}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <i className={`inv-nav-icon ${item.icon}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="inv-logout-btn" type="button" onClick={handlePartnerLogout}>
          <i className="fa-solid fa-right-from-bracket inv-nav-icon" />
          <span>Đăng xuất</span>
        </button>
      </aside>

      <div className="inv-right">
        <header className="inv-header">
          <div className="inv-search-wrap">
            <i className="fa-solid fa-magnifying-glass inv-search-icon" />
            <input
              type="search"
              className="inv-search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </header>

        <main className="inv-main">
          <div className="inv-main-top">
            <div>
              <h1 className="inv-title">Cập nhật tồn kho</h1>
              <p className="inv-subtitle">
                {store?.name || "Theo dõi và cập nhật sản phẩm của bạn."}
              </p>
            </div>

            <div className="inv-actions">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`inv-filter-btn ${activeFilter === filter.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá gốc (Base Price)</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Cập nhật cuối</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableMessage icon="fa-solid fa-spinner fa-spin" message="Đang tải sản phẩm..." />
                ) : pageError ? (
                  <TableMessage icon="fa-solid fa-triangle-exclamation" message={pageError} />
                ) : filteredProducts.length === 0 ? (
                  <TableMessage icon="fa-solid fa-box-open" message="Không có sản phẩm nào" />
                ) : (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isEditingStock={editingStock === product.id}
                      stockInput={stockInput}
                      onStockInputChange={setStockInput}
                      onStartEdit={startEditStock}
                      onCommitStock={commitStock}
                      onCancelStock={cancelEditStock}
                      onToggleProduct={handleToggleProduct}
                      onEditProduct={setEditingProduct}
                      onViewDetail={handleViewDetail}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {toast.msg && (
        <div className={`inv-toast show inv-toast--${toast.type}`} role="alert">
          {toast.msg}
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProductInfo}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}

function TableMessage({ icon, message }) {
  return (
    <tr>
      <td colSpan={7} className="inv-empty-row">
        <i className={icon} /> {message}
      </td>
    </tr>
  );
}

function ProductRow({
  product,
  isEditingStock,
  stockInput,
  onStockInputChange,
  onStartEdit,
  onCommitStock,
  onCancelStock,
  onToggleProduct,
  onEditProduct,
  onViewDetail,
}) {
  return (
    <tr
      className={`inv-row ${!product.active ? "inv-row--inactive" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={() => {
        if (!isEditingStock) onViewDetail(product.id);
      }}
    >
      <td>
        <div className="inv-product-img-wrap">
          {product.img ? (
            <img src={product.img} alt={product.name} className="inv-product-img" />
          ) : (
            <i className="fa-solid fa-box-open" />
          )}
        </div>
      </td>

      <td>
        <p className="inv-product-name">{product.name}</p>
        <p className="inv-product-code">Mã: SP-{product.id}</p>
      </td>

      <td>
        <span className="inv-price">{formatCurrency(product.price)}</span>
      </td>

      <td onClick={(event) => event.stopPropagation()}>
        {isEditingStock ? (
          <div className="inv-stock-edit">
            <input
              className="inv-stock-input"
              type="number"
              min="0"
              value={stockInput}
              autoFocus
              onChange={(event) => onStockInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") {
                  event.currentTarget.dataset.cancelled = "true";
                  onCancelStock();
                }
              }}
              onBlur={(event) => {
                if (event.currentTarget.dataset.cancelled === "true") return;
                onCommitStock(product.id);
              }}
            />
            <span className="inv-stock-unit">{product.unit}</span>
          </div>
        ) : (
          <button
            type="button"
            className={`inv-stock-badge ${product.stock === 0 ? "out" : "in"}`}
            title="Nhấn để chỉnh sửa"
            onClick={() => onStartEdit(product)}
          >
            {product.stock} {product.unit}
          </button>
        )}
      </td>

      <td onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={`inv-toggle ${product.active ? "on" : "off"}`}
          role="switch"
          aria-checked={product.active}
          onClick={() => onToggleProduct(product)}
          title={product.active ? "Đang bán - nhấn để tạm hết hàng" : "Tạm hết hàng - nhấn để bán lại"}
        >
          <span className="inv-toggle-thumb" />
        </button>
      </td>

      <td>
        <span className="inv-updated">{product.updatedAt}</span>
      </td>

      <td onClick={(event) => event.stopPropagation()}>
        <div className="inv-row-actions">
          <button
            type="button"
            className="inv-row-btn inv-row-btn--edit"
            title="Chỉnh sửa"
            onClick={() => onEditProduct(product)}
          >
            <i className="fa-solid fa-pen" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EditProductModal({ product, onSave, onCancel }) {
  const [name, setName] = useState(product.name);
  const [originalPrice, setOriginalPrice] = useState(String(product.price));

  const canSave = name.trim() && originalPrice !== "" && Number(originalPrice) >= 0;

  return (
    <div className="inv-overlay" onClick={onCancel}>
      <div className="inv-modal inv-modal--add" onClick={(event) => event.stopPropagation()}>
        <div className="inv-modal-head">
          <h2 className="inv-modal-title">Chỉnh sửa sản phẩm</h2>
          <button className="inv-modal-close" type="button" onClick={onCancel}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="inv-modal-body">
          <div className="inv-modal-fields">
            <div className="inv-field">
              <label className="inv-modal-label" htmlFor="edit-product-name">
                Tên sản phẩm
              </label>
              <input
                id="edit-product-name"
                className="inv-modal-input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="inv-field">
              <label className="inv-modal-label" htmlFor="edit-product-price">
                Giá gốc (VND)
              </label>
              <div className="inv-input-suffix">
                <input
                  id="edit-product-price"
                  className="inv-modal-input"
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(event) => setOriginalPrice(event.target.value)}
                />
                <span className="inv-suffix">đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="inv-modal-footer">
          <button className="inv-modal-btn-cancel" type="button" onClick={onCancel}>
            Hủy
          </button>
          <button
            className="inv-modal-btn-save"
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ id: product.id, name, originalPrice })}
          >
            <i className="fa-solid fa-floppy-disk" /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
