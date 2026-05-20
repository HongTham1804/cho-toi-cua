import { useEffect, useState } from "react";
import "./order-history.css";
import {
  fetchCurrentUser,
  fetchOrders,
  reorder,
} from "./api/order-history-api";

const STATUS_MAP = {
  pending_payment: { label: "Chờ thanh toán", className: "pending" },
  shipping: { label: "Đang giao", className: "shipping" },
  completed: { label: "Hoàn thành", className: "completed" },
  cancelled: { label: "Đã hủy", className: "cancelled" },
};

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "pending_payment", label: "Chờ thanh toán" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [reorderingId, setReorderingId] = useState("");

  useEffect(() => {
    async function loadPage() {
      const [userData, orderData] = await Promise.all([
        fetchCurrentUser(),
        fetchOrders("all"),
      ]);

      setUser(userData);
      setOrders(orderData);
      setIsLoading(false);
    }

    loadPage();
  }, []);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  }

  async function handleChangeTab(status) {
    setActiveStatus(status);
    setIsLoading(true);

    try {
      const data = await fetchOrders(status);
      setOrders(data);
    } catch {
      showToast("Không thể tải danh sách đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenDetail(orderId) {
    showToast(`Đang mở chi tiết đơn #${orderId}...`);
  }

  async function handleReorder(orderId) {
    setReorderingId(orderId);

    try {
      const result = await reorder(orderId);
      showToast(result.message ?? "Đã thêm vào giỏ hàng!");
    } catch {
      showToast("Không thể mua lại. Vui lòng thử lại.");
    } finally {
      setReorderingId("");
    }
  }

  return (
    <div className="page">
      <Header />

      <div className="body-wrapper">
        <Sidebar user={user} />

        <main className="main-content" role="main">
          <h1 className="page-title">Lịch sử đơn hàng</h1>

          <div
            className="order-tabs"
            role="tablist"
            aria-label="Lọc đơn hàng theo trạng thái"
          >
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`order-tab ${
                  activeStatus === tab.value ? "active" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeStatus === tab.value}
                onClick={() => handleChangeTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingOrders />
          ) : orders.length > 0 ? (
            <section id="order-list" aria-live="polite">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  reorderingId={reorderingId}
                  onDetail={handleOpenDetail}
                  onReorder={handleReorder}
                />
              ))}
            </section>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      <Footer />

      {toast && (
        <div className="toast toast-success show" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <a href="/" className="logo" aria-label="Chợ Tới Cửa - trang chủ">
          <span>Chợ Tới Cửa</span>
        </a>

        <div className="search-box" role="search">
          <input
            id="search-input"
            type="search"
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>

        <div className="header-icons">
          <button className="icon-btn" type="button" aria-label="Thông báo">
            🔔
          </button>
          <button className="icon-btn" type="button" aria-label="Giỏ hàng">
            🛒
          </button>
          <button
            className="icon-btn icon-btn--active"
            type="button"
            aria-label="Tài khoản"
          >
            👤
          </button>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ user }) {
  return (
    <aside className="sidebar" aria-label="Menu tài khoản">
      <div className="sidebar-user">
        <div className="user-avatar" aria-hidden="true">
          👤
        </div>
        <div className="user-info">
          <p className={`user-name ${!user ? "skeleton" : ""}`}>
            {user?.name ?? "\u00a0\u00a0\u00a0\u00a0\u00a0"}
          </p>
          <p className={`user-tag ${!user ? "skeleton" : ""}`}>
            {user?.tag ?? "\u00a0\u00a0\u00a0"}
          </p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Tài khoản">
        <a href="#" className="sidebar-link">
          👤 Thông tin tài khoản
        </a>
        <a href="#" className="sidebar-link active" aria-current="page">
          📋 Lịch sử đơn hàng
        </a>
        <a href="#" className="sidebar-link">
          ♡ Sản phẩm yêu thích
        </a>
        <a href="#" className="sidebar-link">
          📍 Sổ địa chỉ
        </a>
      </nav>
    </aside>
  );
}

function OrderCard({ order, reorderingId, onDetail, onReorder }) {
  const status = STATUS_MAP[order.status] ?? {
    label: order.status,
    className: "pending",
  };

  return (
    <article className="order-card">
      <div className="order-card-header">
        <div className="store-info">🏠 {order.storeName}</div>

        <span className={`status-badge ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="order-card-body">
        <div className="order-meta">
          <p className="order-code">Mã đơn: #{order.id}</p>
          <p>Ngày đặt: {order.date}</p>
          <p className="order-products">{order.products}</p>
        </div>

        <div className="order-actions">
          <p className="order-total">
            Tổng tiền: <strong>{formatCurrency(order.total)}</strong>
          </p>

          <div className="btn-group">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => onDetail(order.id)}
            >
              Chi tiết
            </button>

            {order.status === "completed" && (
              <button
                className="btn btn-primary"
                type="button"
                disabled={reorderingId === order.id}
                onClick={() => onReorder(order.id)}
              >
                {reorderingId === order.id ? "Đang xử lý..." : "Mua lại"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function LoadingOrders() {
  return (
    <section id="order-list">
      {[1, 2, 3].map((item) => (
        <div key={item} className="order-card">
          <div className="order-card-header">
            <div className="skeleton" style={{ height: 16, width: "45%" }} />
            <div className="skeleton" style={{ height: 22, width: 90 }} />
          </div>
          <div className="order-card-body">
            <div className="order-meta">
              <div className="skeleton" style={{ height: 13, width: "55%" }} />
              <div className="skeleton" style={{ height: 13, width: "40%" }} />
              <div className="skeleton" style={{ height: 13, width: "70%" }} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">📦</div>
      <p className="empty-title">Không có đơn hàng nào</p>
      <p className="empty-sub">Chưa có đơn hàng trong mục này.</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" className="logo">
            <span>Chợ Tới Cửa</span>
          </a>
          <p className="footer-tagline">
            © 2024 Chợ Tới Cửa. Tươi ngon từ nông trại đến tận cửa nhà.
          </p>
        </div>

        <div className="footer-links-group">
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Liên hệ: 1900 1234</a>
          <a href="#">Về chúng tôi</a>
        </div>
      </div>
    </footer>
  );
}

export default App;
