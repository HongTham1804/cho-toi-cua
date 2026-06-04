import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader/CustomerHeader";
import Footer from "../../components/Footer/Footer";
import "./order-history.css";
import { fetchOrders, reorder, syncPayosOrder } from "./api/order-history-api";

const STATUS_MAP = {
  pending_payment: { label: "Chờ thanh toán", className: "pending-payment" },
  pending: { label: "Chờ xử lý", className: "pending" },
  preparing: { label: "Đang lấy hàng", className: "preparing" },
  shipping: { label: "Đang giao", className: "shipping" },
  completed: { label: "Đã hoàn thành", className: "completed" },
  cancelled: { label: "Đã hủy", className: "cancelled" },
};

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "pending_payment", label: "Chờ thanh toán" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "preparing", label: "Đang lấy hàng" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const isPendingPayosOrder = (order) => (
  order.paymentMethodKey === "payos"
  && order.paymentStatus === "pending"
  && order.status === "pending_payment"
);

const sortNewestFirst = (orders) => [...orders].sort((first, second) => (
  new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime()
));

const uniqueOrders = (orders) => {
  const ordersById = new Map();
  orders.forEach((order) => ordersById.set(order.id, order));
  return Array.from(ordersById.values());
};

const filterByActiveStatus = (orders, activeStatus) => {
  if (activeStatus === "all") return orders;
  return orders.filter((order) => order.status === activeStatus);
};

async function syncPendingPayosOrders(orders) {
  const pendingPayosOrders = orders.filter(isPendingPayosOrder);

  if (!pendingPayosOrders.length) {
    return orders;
  }

  const syncedOrders = await Promise.all(
    pendingPayosOrders.map(async (order) => {
      try {
        return await syncPayosOrder(order.id);
      } catch {
        return order;
      }
    })
  );

  const orderById = new Map(orders.map((order) => [order.id, order]));
  syncedOrders.forEach((order) => orderById.set(order.id, order));

  return Array.from(orderById.values());
}

function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")}đ`;
}

function StoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default function OrderHistory() {
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status");
  const initialStatus = TABS.some((tab) => tab.value === statusFromUrl) ? statusFromUrl : "all";
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [reorderingId, setReorderingId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPage() {
      setIsLoading(true);
      try {
        const orderData = await fetchOrders(activeStatus);
        const syncSource = activeStatus === "pending"
          ? uniqueOrders([...orderData, ...(await fetchOrders("pending_payment"))])
          : orderData;
        const syncedOrders = await syncPendingPayosOrders(syncSource);
        const visibleOrders = sortNewestFirst(filterByActiveStatus(syncedOrders, activeStatus));

        if (isMounted) setOrders(visibleOrders);
      } catch {
        if (isMounted) showToast("Không thể tải danh sách đơn hàng.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [activeStatus]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
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
        <main className="order-history-main" role="main">
          <div className="order-page-heading">
            <h1 className="page-title">Đơn mua</h1>
            <a href="#order-list" className="purchase-history-link">
              Xem lịch sử mua hàng &gt;
            </a>
          </div>

          <div className="order-tabs" role="tablist" aria-label="Lọc đơn hàng theo trạng thái">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`order-tab ${activeStatus === tab.value ? "active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeStatus === tab.value}
                onClick={() => setActiveStatus(tab.value)}
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

function OrderCard({ order, reorderingId, onReorder }) {
  const navigate = useNavigate();
  const status = STATUS_MAP[order.status] ?? {
    label: order.status,
    className: "pending",
  };
  const openDetail = () => navigate(`/order-detail/${encodeURIComponent(order.id)}`);

  return (
    <article
      className="order-card order-card-clickable"
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
    >
      <div className="order-card-header">
        <div className="store-info">
          <span className="store-icon"><StoreIcon /></span>
          {order.storeName}
        </div>
        <span className={`status-badge ${status.className}`}>{status.label}</span>
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
              type="button"
              className="btn btn-outline"
              onClick={(event) => {
                event.stopPropagation();
                openDetail();
              }}
            >
              Chi tiết
            </button>

            {order.status === "completed" && (
              <button
                className="btn btn-primary"
                type="button"
                disabled={reorderingId === order.id}
                onClick={(event) => {
                  event.stopPropagation();
                  onReorder(order.id);
                }}
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
      <div className="empty-icon">
        <i className="fa-solid fa-box-open" aria-hidden="true"></i>
      </div>
      <p className="empty-title">Không có đơn hàng nào</p>
      <p className="empty-sub">Chưa có đơn hàng trong mục này.</p>
    </div>
  );
}
