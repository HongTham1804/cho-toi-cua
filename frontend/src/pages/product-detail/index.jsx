import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import "../inventory/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import imgTomato1  from "../../assets/cà chua 1.jpg";
import imgTomato2  from "../../assets/cà chua 2.webp";
import imgSuplo1   from "../../assets/súp lơ 1.jpg";
import imgSuplo2   from "../../assets/súp lơ 2.webp";
import imgBeef1    from "../../assets/thịt bò 1.jpg";
import imgBeef2    from "../../assets/thịt bò 2.jpg";


/* ─── Product DB (dùng chung với inventory) ──────────────────────── */
const PRODUCTS_DB = {
  "TOM-001": {
    id: "TOM-001",
    sku: "TOM-MC-001",
    name: "Cà chua Mộc Châu",
    description:
      "Cà chua hữu cơ tươi ngon thu hoạch từ các nông trại đạt chuẩn VietGAP tại Mộc Châu. Vỏ mỏng, ruột đặc, vị chua ngọt thanh mát, thích hợp cho các món salad hoặc nấu súp.",
    price: 35000,
    unit: "kg",
    stock: 120,
    monthlySales: 450,
    active: true,
    category: "Rau củ quả > Quả mọng",
    brand: "HTX Nông nghiệp Mộc Châu",
    harvestDate: "Cập nhật hàng ngày",
    certifications: "VietGAP, Hữu cơ",
    imgs: [imgTomato1, imgTomato2],
    history: [
      { time: "24/10/2023 14:30", actor: "Nguyễn Văn A", action: "cap-nhat-kho", actionLabel: "Cập nhật kho", detail: "Tồn kho: 80kg → 120kg" },
      { time: "22/10/2023 09:15", actor: "Hệ thống", action: "tru-kho", actionLabel: "Trừ kho (Đơn hàng)", detail: "Tồn kho: 85kg → 80kg (Đơn #MD-092)" },
      { time: "18/10/2023 10:00", actor: "Trần Thị B", action: "sua-gia", actionLabel: "Sửa giá", detail: "Giá: 32.000đ → 35.000đ" },
    ],
  },
  "BRO-002": {
    id: "BRO-002",
    sku: "BRO-002",
    name: "Súp lơ xanh baby",
    description:
      "Súp lơ xanh baby tươi non, kích thước nhỏ gọn, phù hợp cho các gia đình. Được trồng theo quy trình an toàn, không thuốc trừ sâu, giàu vitamin C và chất xơ.",
    price: 45000,
    unit: "kg",
    stock: 0,
    monthlySales: 210,
    active: false,
    category: "Rau củ quả > Rau xanh",
    brand: "Nông trại Xanh Sạch",
    harvestDate: "3 ngày/lần",
    certifications: "VietGAP",
    imgs: [imgSuplo1, imgSuplo2],
    history: [
      { time: "23/10/2023 08:15", actor: "Hệ thống", action: "tru-kho", actionLabel: "Trừ kho (Đơn hàng)", detail: "Tồn kho: 30kg → 0kg (Đơn #MD-101)" },
      { time: "20/10/2023 11:00", actor: "Nguyễn Văn A", action: "cap-nhat-kho", actionLabel: "Cập nhật kho", detail: "Tồn kho: 15kg → 30kg" },
    ],
  },
  "BEEF-101": {
    id: "BEEF-101",
    sku: "BEEF-AU-101",
    name: "Thịt bò Úc nhập khẩu",
    description:
      "Thịt bò thăn ngoại nhập khẩu từ Úc, được chăn nuôi theo tiêu chuẩn quốc tế. Thịt mềm, thớ đều, vị ngọt tự nhiên. Phù hợp để áp chảo, nướng BBQ hoặc nấu lẩu.",
    price: 250000,
    unit: "kg",
    stock: 15,
    monthlySales: 180,
    active: true,
    category: "Thịt tươi > Thịt bò",
    brand: "Beef Australia Premium",
    harvestDate: "Nhập hàng 2 lần/tuần",
    certifications: "HACCP, ISO 22000",
    imgs: [imgBeef1, imgBeef2],
    history: [
      { time: "24/10/2023 14:00", actor: "Trần Thị B", action: "cap-nhat-kho", actionLabel: "Cập nhật kho", detail: "Tồn kho: 10kg → 15kg" },
      { time: "21/10/2023 16:30", actor: "Hệ thống", action: "tru-kho", actionLabel: "Trừ kho (Đơn hàng)", detail: "Tồn kho: 18kg → 10kg (Đơn #MD-089)" },
      { time: "19/10/2023 09:00", actor: "Nguyễn Văn A", action: "sua-gia", actionLabel: "Sửa giá", detail: "Giá: 230.000đ → 250.000đ" },
    ],
  },
};

const NAV_ITEMS = [
  { id: "orders", label: "Đơn hàng", icon: "fa-solid fa-clipboard-list", path: "/order-management" },
  { id: "categories", label: "Danh mục", icon: "fa-solid fa-tags", path: "/inventory" },
  { id: "store", label: "Cửa hàng", icon: "fa-solid fa-store", path: null },
  { id: "stats", label: "Thống kê", icon: "fa-solid fa-chart-bar", path: null },
];

function formatCurrency(v) {
  return Number(v).toLocaleString("vi-VN") + "đ";
}

const ACTION_STYLES = {
  "cap-nhat-kho": "pd-action--blue",
  "tru-kho": "pd-action--orange",
  "sua-gia": "pd-action--purple",
};

/* ─── Page ───────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS_DB[id];

  const [isOpen, setIsOpen] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <i className="fa-solid fa-box-open" />
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* ── Sidebar (dùng lại class inv-) ── */}
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
      <div className="pd-right">
        {/* Header */}
        <header className="pd-header">
          <div className="pd-search-wrap">
            <i className="fa-solid fa-magnifying-glass pd-search-icon" />
            <input
              type="search"
              className="pd-search"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
            />
          </div>
          <div className="pd-header-icons">
            <button className="pd-icon-btn" aria-label="Thông báo">
              <i className="fa-regular fa-bell" />
            </button>
            <button className="pd-icon-btn" aria-label="Hỗ trợ">
              <i className="fa-regular fa-circle-question" />
            </button>
            <button className="pd-icon-btn" aria-label="Cài đặt">
              <i className="fa-solid fa-gear" />
            </button>
            <button className="pd-icon-btn pd-icon-btn--avatar" aria-label="Tài khoản">
              <i className="fa-solid fa-circle-user" />
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="pd-main">
          {/* Breadcrumb + actions */}
          <div className="pd-topbar">
            <h1 className="pd-page-title">Chi tiết sản phẩm</h1>
            <div className="pd-topbar-actions">
              <button className="pd-btn-edit" onClick={() => showToast("Chỉnh sửa sản phẩm...")}>
                <i className="fa-solid fa-pen" /> Chỉnh sửa
              </button>
              <button className="pd-btn-delete" onClick={() => showToast("Đã xóa sản phẩm!")}>
                <i className="fa-regular fa-trash-can" /> Xóa sản phẩm
              </button>
            </div>
          </div>

          {/* Product card */}
          <div className="pd-card">
            {/* Left: images */}
            <div className="pd-images">
              <div className="pd-img-main-wrap">
                <img
                  src={product.imgs[activeImg]}
                  alt={product.name}
                  className="pd-img-main"
                />
              </div>
              <div className="pd-thumbnails">
                {product.imgs.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb-btn ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: info */}
            <div className="pd-info">
              <div className="pd-info-top">
                <span className="pd-sku">SKU: {product.sku}</span>
                <span className={`pd-status-badge ${product.active ? "active" : "inactive"}`}>
                  <span className="pd-status-dot-sm" />
                  {product.active ? "Đang bán" : "Tạm dừng"}
                </span>
              </div>

              <h2 className="pd-product-name">{product.name}</h2>
              <p className="pd-description">{product.description}</p>

              <p className="pd-price">
                {formatCurrency(product.price)}
                <span className="pd-unit"> /{product.unit}</span>
              </p>

              <div className="pd-divider" />

              <div className="pd-stats">
                <div className="pd-stat">
                  <span className="pd-stat-label">Tồn kho hiện tại</span>
                  <span className="pd-stat-value">
                    {product.stock} <span className="pd-stat-unit">{product.unit}</span>
                  </span>
                </div>
                <div className="pd-stat">
                  <span className="pd-stat-label">Doanh số tháng</span>
                  <span className="pd-stat-value">
                    {product.monthlySales} <span className="pd-stat-unit">{product.unit}</span>
                  </span>
                </div>
              </div>

              <div className="pd-divider" />

              <div className="pd-meta-grid">
                <div className="pd-meta-item">
                  <span className="pd-meta-label">Danh mục</span>
                  <span className="pd-meta-value">{product.category}</span>
                </div>
                <div className="pd-meta-item">
                  <span className="pd-meta-label">Thương hiệu / Nguồn gốc</span>
                  <span className="pd-meta-value">{product.brand}</span>
                </div>
                <div className="pd-meta-item">
                  <span className="pd-meta-label">Ngày thu hoạch dự kiến</span>
                  <span className="pd-meta-value">{product.harvestDate}</span>
                </div>
                <div className="pd-meta-item">
                  <span className="pd-meta-label">Chứng nhận</span>
                  <span className="pd-meta-value">{product.certifications}</span>
                </div>
              </div>
            </div>
          </div>

          {/* History table */}
          <div className="pd-history">
            <h2 className="pd-history-title">Lịch sử cập nhật</h2>
            <div className="pd-history-table-wrap">
              <table className="pd-history-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người thực hiện</th>
                    <th>Hành động</th>
                    <th>Chi tiết thay đổi</th>
                  </tr>
                </thead>
                <tbody>
                  {product.history.map((row, i) => (
                    <tr key={i} className="pd-history-row">
                      <td className="pd-history-time">{row.time}</td>
                      <td className="pd-history-actor">{row.actor}</td>
                      <td>
                        <span className={`pd-action-badge ${ACTION_STYLES[row.action] ?? ""}`}>
                          {row.actionLabel}
                        </span>
                      </td>
                      <td className="pd-history-detail">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="pd-footer">
          <span>© 2024 GreenHub Partner Network. All rights reserved.</span>
          <div className="pd-footer-links">
            <a href="#">Hỗ trợ</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản dịch vụ</a>
          </div>
        </footer>
      </div>

      {toast && (
        <div className="pd-toast show" role="alert">{toast}</div>
      )}
    </div>
  );
}
