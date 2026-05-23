import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import imgTomato from "../../assets/Cà chua Mộc Châu.png";
import imgSuplo from "../../assets/Súp lơ xanh.png";
import imgBeef from "../../assets/Thịt bò.png";

/* ─── Mock data ──────────────────────────────────────────────────── */
const INITIAL_PRODUCTS = [
  {
    id: "TOM-001",
    name: "Cà chua Mộc Châu",
    price: 35000,
    stock: 120,
    unit: "kg",
    category: "rau",
    active: true,
    updatedAt: "10:30, 24/10",
    img: imgTomato,
  },
  {
    id: "BRO-002",
    name: "Súp lơ xanh baby",
    price: 45000,
    stock: 0,
    unit: "kg",
    category: "rau",
    active: false,
    updatedAt: "08:15, 23/10",
    img: imgSuplo,
  },
  {
    id: "BEEF-101",
    name: "Thịt bò Úc nhập khẩu",
    price: 250000,
    stock: 15,
    unit: "kg",
    category: "thit",
    active: true,
    updatedAt: "14:20, 24/10",
    img: imgBeef,
  },
];

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "rau", label: "Rau củ quả" },
  { id: "thit", label: "Thịt tươi" },
  { id: "trai", label: "Trái cây" },
];

const NAV_ITEMS = [
  { id: "orders", label: "Đơn hàng", icon: "fa-solid fa-clipboard-list", path: "/order-management" },
  { id: "categories", label: "Danh mục", icon: "fa-solid fa-tags", path: "/inventory" },
  { id: "store", label: "Cửa hàng", icon: "fa-solid fa-store", path: null },
  { id: "stats", label: "Thống kê", icon: "fa-solid fa-chart-bar", path: null },
];

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(true);

  function handleViewDetail(id) {
    navigate(`/product/${id}`);
  }
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [editingStock, setEditingStock] = useState(null);
  const [stockInput, setStockInput] = useState("");

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }

  function handleToggle(id) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = !p.active;
        showToast(
          next ? `Đã bật bán "${p.name}"` : `Đã tắt bán "${p.name}"`,
          next ? "success" : "warn"
        );
        return { ...p, active: next, updatedAt: nowStr() };
      })
    );
  }

  function startEditStock(product) {
    setEditingStock(product.id);
    setStockInput(String(product.stock));
  }

  function commitStock(id) {
    const val = parseInt(stockInput, 10);
    if (isNaN(val) || val < 0) {
      showToast("Số lượng không hợp lệ.", "error");
      setEditingStock(null);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: val, active: val > 0 ? p.active : false, updatedAt: nowStr() }
          : p
      )
    );
    showToast("Đã cập nhật tồn kho!");
    setEditingStock(null);
  }

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="inv-page">
      {/* ── Sidebar ── */}
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
          className={`inv-toggle-btn ${isOpen ? "is-open" : "is-closed"}`}
          onClick={() => {
            setIsOpen((v) => !v);
            showToast(isOpen ? "Đã đóng cửa hàng." : "Đã mở cửa hàng!");
          }}
        >
          Mở/Đóng cửa hàng
        </button>

        <nav className="inv-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`inv-nav-item ${item.id === "categories" ? "active" : ""}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <i className={`inv-nav-icon ${item.icon}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Right panel ── */}
      <div className="inv-right">
        {/* Header */}
        <header className="inv-header">
          <div className="inv-search-wrap">
            <i className="fa-solid fa-magnifying-glass inv-search-icon" />
            <input
              type="search"
              className="inv-search"
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>
          <div className="inv-header-icons">
            <button className="inv-icon-btn" aria-label="Thông báo">
              <i className="fa-regular fa-bell" />
            </button>
            <button className="inv-icon-btn" aria-label="Tài khoản">
              <i className="fa-regular fa-circle-user" />
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="inv-main">
          <div className="inv-main-top">
            <div>
              <h1 className="inv-title">Cập nhật tồn kho</h1>
              <p className="inv-subtitle">Theo dõi và cập nhật sản phẩm của bạn.</p>
            </div>

            <div className="inv-actions">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`inv-filter-btn ${activeFilter === f.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
              <button className="inv-add-btn">
                <i className="fa-solid fa-plus" /> Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Table */}
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
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="inv-empty-row">
                      <i className="fa-solid fa-box-open" /> Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isEditingStock={editingStock === product.id}
                      stockInput={stockInput}
                      onStockInputChange={setStockInput}
                      onStartEdit={startEditStock}
                      onCommitStock={commitStock}
                      onToggle={handleToggle}
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
    </div>
  );
}

/* ─── Product row ────────────────────────────────────────────────── */
function ProductRow({
  product,
  isEditingStock,
  stockInput,
  onStockInputChange,
  onStartEdit,
  onCommitStock,
  onToggle,
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
      {/* Image */}
      <td>
        <div className="inv-product-img-wrap">
          <img src={product.img} alt={product.name} className="inv-product-img" />
        </div>
      </td>

      {/* Name */}
      <td>
        <p className="inv-product-name">{product.name}</p>
        <p className="inv-product-code">Mã: {product.id}</p>
      </td>

      {/* Price */}
      <td>
        <span className="inv-price">{formatCurrency(product.price)}</span>
      </td>

      {/* Stock */}
      <td onClick={(e) => e.stopPropagation()}>
        {isEditingStock ? (
          <div className="inv-stock-edit">
            <input
              className="inv-stock-input"
              type="number"
              min="0"
              value={stockInput}
              autoFocus
              onChange={(e) => onStockInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onCommitStock(product.id);
                if (e.key === "Escape") onCommitStock(product.id);
              }}
              onBlur={() => onCommitStock(product.id)}
            />
            <span className="inv-stock-unit">{product.unit}</span>
          </div>
        ) : (
          <button
            className={`inv-stock-badge ${product.stock === 0 ? "out" : "in"}`}
            title="Nhấn để chỉnh sửa"
            onClick={() => onStartEdit(product)}
          >
            {product.stock} {product.unit}
          </button>
        )}
      </td>

      {/* Toggle */}
      <td onClick={(e) => e.stopPropagation()}>
        <button
          className={`inv-toggle ${product.active ? "on" : "off"}`}
          role="switch"
          aria-checked={product.active}
          onClick={() => onToggle(product.id)}
          title={product.active ? "Đang bán — nhấn để tắt" : "Tạm dừng — nhấn để bật"}
        >
          <span className="inv-toggle-thumb" />
        </button>
      </td>

      {/* Updated at */}
      <td>
        <span className="inv-updated">{product.updatedAt}</span>
      </td>
    </tr>
  );
}

function nowStr() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `${hh}:${mm}, ${dd}/${mo}`;
}
