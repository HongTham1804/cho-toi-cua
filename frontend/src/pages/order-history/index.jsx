import { useEffect, useState } from "react";
import CustomerHeader from "../../components/CustomerHeader/CustomerHeader";
import Footer from "../../components/Footer/Footer";
import "./order-history.css";
import {
  fetchCurrentUser,
  fetchOrders,
  reorder,
} from "./api/order-history-api";

const STATUS_MAP = {
  pending_payment: { label: "Chờ thanh toán", className: "pending" },
  shipping:        { label: "Đang giao",       className: "shipping" },
  completed:       { label: "Hoàn thành",      className: "completed" },
  cancelled:       { label: "Đã hủy",          className: "cancelled" },
};

const TABS = [
  { value: "all",             label: "Tất cả" },
  { value: "pending_payment", label: "Chờ thanh toán" },
  { value: "shipping",        label: "Đang giao" },
  { value: "completed",       label: "Đã hoàn thành" },
  { value: "cancelled",       label: "Đã hủy" },
];

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function StoreIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
function App() {
  const [user, setUser]               = useState(null);
  const [orders, setOrders]           = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [isLoading, setIsLoading]     = useState(true);
  const [toast, setToast]             = useState("");
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
    <div className="page order-history-page">
      <CustomerHeader />

      <div className="body-wrapper">
        <Sidebar user={user} />

        <main className="order-history-main" role="main">
          <h1 className="page-title">Lịch sử đơn hàng</h1>

          <div
            className="order-tabs"
            role="tablist"
            aria-label="Lọc đơn hàng theo trạng thái"
          >
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`order-tab ${activeStatus === tab.value ? "active" : ""}`}
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

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
function Sidebar({ user }) {
  return (
    <aside className="order-history-sidebar" aria-label="Menu tài khoản">
      <div className="sidebar-user">
        <div className="user-avatar" aria-hidden="true">
          <ProfileIcon />
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
          <span className="sidebar-icon"><ProfileIcon /></span>
          Thông tin tài khoản
        </a>
        <a href="#" className="sidebar-link active" aria-current="page">
          <span className="sidebar-icon"><OrderIcon /></span>
          Lịch sử đơn hàng
        </a>
        <a href="#" className="sidebar-link">
          <span className="sidebar-icon"><HeartIcon /></span>
          Sản phẩm yêu thích
        </a>
        <a href="#" className="sidebar-link">
          <span className="sidebar-icon"><PinIcon /></span>
          Sổ địa chỉ
        </a>
      </nav>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDER CARD
═══════════════════════════════════════════════════════════════ */
function OrderCard({ order, reorderingId, onDetail, onReorder }) {
  const status = STATUS_MAP[order.status] ?? {
    label: order.status,
    className: "pending",
  };

  return (
    <article className="order-card">
      <div className="order-card-header">
        <div className="store-info">
          <span className="store-icon"><StoreIcon /></span>
          {order.storeName}
        </div>
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

/* ═══════════════════════════════════════════════════════════════
   LOADING / EMPTY
═══════════════════════════════════════════════════════════════ */
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

export default App;

