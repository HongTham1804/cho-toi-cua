import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import imgQR from "../../assets/QR.jpg";

const API_BASE_URL = "http://localhost:8000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};

const formatTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapApiOrder = (order) => ({
  id: `ORD-${String(order.id).padStart(4, "0")}`,
  rawId: String(order.id),
  time: formatTime(order.created_at),
  customer: order.customer?.name || "Khách hàng",
  itemCount: (order.details || []).filter((detail) => detail.product?.name && detail.product?.image_url).length,
  status: "waiting",
  items: (order.details || [])
    .filter((detail) => detail.product?.name && detail.product?.image_url)
    .map((detail) => ({
    name: detail.product?.name || "Sản phẩm",
    qty: Number(detail.quantity || 1),
    price: Number(detail.unit_price || 0),
    image: resolveImageUrl(detail.product?.image_url),
  })),
  total: Number(order.total_amount || 0),
});

async function fetchNewOrders() {
  const response = await fetch(`${API_BASE_URL}/orders?status=pending&per_page=100`);

  if (!response.ok) {
    throw new Error("Không thể tải đơn hàng mới.");
  }

  const payload = await response.json();
  const orders = Array.isArray(payload?.data?.data) ? payload.data.data : [];
  return orders
    .map(mapApiOrder)
    .filter((order) => order.items.length > 0);
}

const SHIPPER_ORDERS = [
  {
    id: "FF-88392A",
    customer: "Trần Thị B",
    address: "123 Nguyễn Văn Linh, Q.7",
    items: "5 Món (Thịt tươi, Rau co)",
    trackingCode: "GHN-7789231",
    urgency: "urgent",
    urgencyLabel: "Giao gấp trong 30p",
  },
  {
    id: "FF-44910B",
    customer: "Lê Văn C",
    address: "45 Lê Lợi, Q.1",
    items: "12 Món (Đồ khô, Gia vị)",
    trackingCode: "GHN-7789198",
    urgency: "standard",
    urgencyLabel: "Giao tiêu chuẩn",
  },
];

const HISTORY_ORDERS = [
  { id: "FF-99210B", time: "10:45 AM", shipper: "Tuấn Anh" },
  { id: "FF-77112C", time: "09:30 AM", shipper: "Minh Khang" },
  { id: "FF-55331A", time: "08:15 AM", shipper: "Hoàng Hải" },
];

const NAV_ITEMS = [
  { id: "orders", label: "Đơn hàng", icon: "fa-solid fa-clipboard-list", path: "/order-management" },
  { id: "categories", label: "Quản lý kho", icon: "fa-solid fa-tags", path: "/inventory" },
  
];

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + " đ";
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function OrderManagement() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("new");
  const [activeNav, setActiveNav] = useState("orders");
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoadingOrders(true);
    fetchNewOrders()
      .then((apiOrders) => {
        if (isMounted) setOrders(apiOrders);
      })
      .catch((error) => {
        if (isMounted) showToast(error.message || "Không thể tải đơn hàng mới.");
      })
      .finally(() => {
        if (isMounted) setIsLoadingOrders(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleReady(orderId) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "ready" } : o))
    );
    showToast(`Đơn #${orderId} đã sẵn sàng giao!`);
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const searchedOrders = orders.filter((order) => {
    if (!normalizedSearch) return true;

    return (
      order.id.toLowerCase().includes(normalizedSearch) ||
      order.customer.toLowerCase().includes(normalizedSearch) ||
      order.items.some((item) => item.name.toLowerCase().includes(normalizedSearch))
    );
  });
  const waitingOrders = searchedOrders.filter((o) => o.status === "waiting");

  return (
    <div className="om-page">
      {/* Sidebar */}
      <aside className="om-sidebar">
        <div className="om-brand">
          <div className="om-brand-icon">
            <i className="fa-solid fa-cart-shopping" />
          </div>
          <div>
            <p className="om-brand-name">Partner Dashboard</p>
            <p className={`om-store-status ${isOpen ? "open" : "closed"}`}>
              <span className="om-status-dot" />
              {isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
            </p>
          </div>
        </div>

        <button
          className={`om-toggle-btn ${isOpen ? "is-open" : "is-closed"}`}
          onClick={() => {
            setIsOpen((v) => !v);
            showToast(isOpen ? "Đã đóng cửa hàng." : "Đã mở cửa hàng!");
          }}
        >
          {isOpen ? "Mở/Đóng cửa hàng" : "Mở/Đóng cửa hàng"}
        </button>

        <nav className="om-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`om-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item.id);
                if (item.path) navigate(item.path);
              }}
            >
              <i className={`om-nav-icon ${item.icon}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Right panel */}
      <div className="om-right">
        {/* Header */}
        <header className="om-header">
          
          <div className="om-search-wrap">
            <i className="fa-solid fa-magnifying-glass om-search-icon" />
            <input
              type="search"
              className="om-search"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
        </header>

        {/* Main content */}
        <main className="om-main">
        <div className="om-main-header">
          <h1 className="om-title">Quản lý Đơn hàng</h1>
          <p className="om-subtitle">Xử lý và bàn giao đơn hàng nhanh chóng.</p>
        </div>

        {/* Tabs */}
        <div className="om-tabs" role="tablist">
          <button
            className={`om-tab ${activeTab === "new" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "new"}
            onClick={() => setActiveTab("new")}
          >
            Đơn hàng mới ({waitingOrders.length})
          </button>
          <button
            className={`om-tab ${activeTab === "shipper" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "shipper"}
            onClick={() => setActiveTab("shipper")}
          >
            Bàn giao cho Shipper ({SHIPPER_ORDERS.length})
          </button>
          <button
            className={`om-tab ${activeTab === "history" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử
          </button>
        </div>

        {/* Tab: Đơn hàng mới */}
        {activeTab === "new" && (
          <>
            {isLoadingOrders ? (
              <EmptyState faIcon="fa-solid fa-spinner fa-spin" title="Đang tải đơn mới" sub="Đang lấy dữ liệu từ backend." />
            ) : waitingOrders.length > 0 ? (
              <div className="om-orders-grid">
                {waitingOrders.map((order) => (
                  <NewOrderCard
                    key={order.id}
                    order={order}
                    onReady={handleReady}
                  />
                ))}
              </div>
            ) : (
              <EmptyState faIcon="fa-solid fa-circle-check" title="Tuyệt vời!" sub="Tất cả đơn đã được chuẩn bị xong." />
            )}

            {/* Đơn sẵn sàng giao */}
            {orders.some((o) => o.status === "ready") && (
              <section className="om-ready-section">
                <h2 className="om-section-title">Đơn hàng sẵn sàng giao</h2>
                {orders
                  .filter((o) => o.status === "ready")
                  .map((order) => (
                    <ReadyOrderCard key={order.id} order={order} />
                  ))}
              </section>
            )}
          </>
        )}

        {/* Tab: Bàn giao cho Shipper */}
        {activeTab === "shipper" && (
          <section className="om-handover-section">
            <div className="om-handover-body">
              {/* Left: priority orders */}
              <div className="om-priority-col">
                <div className="om-priority-head">
                  <h3 className="om-priority-title">Đơn hàng ưu tiên</h3>
                  <button className="om-view-all" onClick={() => showToast("Xem tất cả đơn hàng...")}>
                    Xem tất cả <i className="fa-solid fa-arrow-right" />
                  </button>
                </div>
                <div className="om-priority-list">
                  {SHIPPER_ORDERS.map((order) => (
                    <ShipperCard key={order.id} order={order} onToast={showToast} />
                  ))}
                </div>
              </div>

              {/* Right: stats + recent */}
              <div className="om-stats-col">
                <div className="om-stat-cards">
                  <div className="om-stat-card om-stat-card--teal">
                    <i className="fa-solid fa-truck" />
                    <span className="om-stat-num">24</span>
                    <span className="om-stat-label">Đã giao h.nay</span>
                  </div>
                  <div className="om-stat-card om-stat-card--orange">
                    <i className="fa-regular fa-clock" />
                    <span className="om-stat-num">12</span>
                    <span className="om-stat-label">Chờ bàn giao</span>
                  </div>
                </div>

                <div className="om-recent-box">
                  <h3 className="om-recent-title">Vừa bàn giao</h3>
                  <ul className="om-recent-list">
                    {HISTORY_ORDERS.map((h) => (
                      <li key={h.id} className="om-recent-item">
                        <i className="fa-solid fa-circle-check om-recent-icon" />
                        <div className="om-recent-info">
                          <span className="om-recent-id">#{h.id}</span>
                          <span className="om-recent-shipper">Shipper: {h.shipper}</span>
                        </div>
                        <span className="om-recent-time">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="om-history-btn" onClick={() => setActiveTab("history")}>
                    Xem toàn bộ lịch sử
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab: Lịch sử */}
        {activeTab === "history" && (
          <section className="om-handover-section">
            <div className="om-history-table-wrap">
              <table className="om-history-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Shipper</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORY_ORDERS.map((h) => (
                    <tr key={h.id}>
                      <td className="om-ht-id">#{h.id}</td>
                      <td className="om-ht-time">{h.time}</td>
                      <td className="om-ht-shipper">{h.shipper}</td>
                      <td><span className="om-badge ready"><i className="fa-solid fa-check" /> Đã giao</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        </main>
      </div>

      {toast && (
        <div className="om-toast show" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ─── New order card ─────────────────────────────────────────────── */
function NewOrderCard({ order, onReady }) {
  const [done, setDone] = useState(false);

  function handleClick() {
    setDone(true);
    onReady(order.id);
  }

  return (
    <article className="om-order-card">
      <div className="om-card-head">
        <div className="om-order-id">
          <span className="om-order-hash">#{order.id}</span>
          <span className="om-badge waiting">Chờ chuẩn bị</span>
        </div>
        <p className="om-order-meta">
          {order.time} • {order.itemCount} món
        </p>
      </div>

      <div className="om-card-divider" />

      <ul className="om-item-list">
        {order.items.map((item, idx) => (
          <li key={idx} className="om-item-row">
            <span className="om-item-img-wrap">
              <img src={item.image} alt={item.name} className="om-item-img" />
            </span>
            <div className="om-item-info">
              <span className="om-item-name">{item.name}</span>
              <span className="om-item-qty">x{item.qty}</span>
            </div>
            <span className="om-item-price">{formatCurrency(item.price)}</span>
          </li>
        ))}
      </ul>

      <div className="om-card-footer">
        <div className="om-total-row">
          <span className="om-total-label">Tổng cộng</span>
          <span className="om-total-value">{formatCurrency(order.total)}</span>
        </div>
        <button
          className={`om-ready-btn ${done ? "done" : ""}`}
          onClick={handleClick}
          disabled={done}
        >
          <i className="fa-solid fa-check" />
          Đã chuẩn bị xong
        </button>
      </div>
    </article>
  );
}

/* ─── Ready order card (in new-orders tab) ───────────────────────── */
function ReadyOrderCard({ order }) {
  return (
    <div className="om-shipper-card">
      <div className="om-shipper-left">
        <div className="om-shipper-top">
          <span className="om-badge ready">Sẵn sàng</span>
          <span className="om-order-hash">#{order.id}</span>
        </div>
        <p className="om-calling">
          <i className="fa-solid fa-rotate fa-spin" /> Đang gọi Shipper...
        </p>
        <p className="om-shipper-meta">
          Khách hàng: {order.customer ?? "—"} • {order.itemCount} món
        </p>
      </div>
      <div className="om-shipper-right">
        <img src={imgQR} alt="QR code" className="om-qr-img" />
        <button className="om-confirm-btn">Xác nhận bàn giao hàng cho Shipper</button>
      </div>
    </div>
  );
}

/* ─── Shipper priority card ──────────────────────────────────────── */
function ShipperCard({ order, onToast }) {
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    onToast(`Đã xác nhận bàn giao đơn #${order.id}!`);
  }

  return (
    <div className={`om-priority-card ${order.urgency === "urgent" ? "urgent" : ""}`}>
      <div className="om-priority-card-left">
        <div className="om-priority-badges">
          <span className={`om-urgency-badge ${order.urgency}`}>{order.urgencyLabel}</span>
          <span className="om-order-hash">#{order.id}</span>
        </div>
        <p className="om-pc-customer">
          <i className="fa-solid fa-user" /> Khách hàng: <strong>{order.customer}</strong>
        </p>
        <p className="om-pc-address">
          <i className="fa-solid fa-location-dot" /> {order.address}
        </p>
        <p className="om-pc-items">
          <i className="fa-solid fa-basket-shopping" /> {order.items}
        </p>
      </div>
      <div className="om-priority-card-right">
        <div className="om-qr-wrap">
          <img src={imgQR} alt="QR" className="om-pc-qr" />
        </div>
        <button
          className={`om-pc-confirm ${confirmed ? "confirmed" : ""}`}
          onClick={handleConfirm}
          disabled={confirmed}
        >
          {confirmed
            ? <><i className="fa-solid fa-check" /> Đã xác nhận</>
            : <><i className="fa-solid fa-circle-check" /> Xác nhận</>
          }
        </button>
      </div>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────── */
function EmptyState({ faIcon, title, sub }) {
  return (
    <div className="om-empty">
      <div className="om-empty-icon">
        <i className={faIcon} />
      </div>
      <p className="om-empty-title">{title}</p>
      <p className="om-empty-sub">{sub}</p>
    </div>
  );
}
