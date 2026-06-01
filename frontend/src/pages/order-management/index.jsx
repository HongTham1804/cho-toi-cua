import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import imgQR from "../../assets/QR.jpg";

const API_BASE_URL = "http://localhost:8000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const NAV_ITEMS = [
  { id: "orders", label: "Đơn hàng", icon: "fa-solid fa-clipboard-list", path: "/order-management" },
  { id: "categories", label: "Quản lý kho", icon: "fa-solid fa-tags", path: "/inventory" },
];

const ORDER_STATUS_LABELS = {
  pending: "Chờ chuẩn bị",
  preparing: "Chờ bàn giao",
  shipping: "Đang giao",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

function formatTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeOrders(payload) {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function mapApiOrder(order) {
  const items = (order.details || [])
    .filter((detail) => detail.product?.name)
    .map((detail) => ({
      id: String(detail.id),
      productId: String(detail.product_id),
      name: detail.product.name,
      qty: Number(detail.quantity || 1),
      price: Number(detail.unit_price || detail.product.price || 0),
      image: resolveImageUrl(detail.product.image_url),
    }));

  return {
    id: `ORD-${String(order.id).padStart(4, "0")}`,
    rawId: String(order.id),
    time: formatTime(order.created_at),
    createdAt: order.created_at,
    customer: order.customer?.name || "Khách hàng",
    phone: order.customer?.phone || "",
    address: order.shipping_address || order.customer?.address || "Đang cập nhật địa chỉ",
    storeName: order.store?.name || "Siêu thị",
    shipper: order.shipper || null,
    itemCount: items.reduce((total, item) => total + item.qty, 0),
    items,
    total: Number(order.total_amount || 0),
    status: order.status || "pending",
  };
}

async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/orders?per_page=100`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách đơn hàng.");
  }

  const payload = await response.json();
  return normalizeOrders(payload)
    .map(mapApiOrder)
    .filter((order) => order.items.length > 0);
}

async function prepareOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/prepare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể chuyển đơn sang đang lấy hàng.");
  }

  return mapApiOrder(payload.data.order);
}

async function startDelivery(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/start-delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể chuyển đơn sang đang giao.");
  }

  return mapApiOrder(payload.data.order);
}

function summarizeItems(items) {
  if (!items.length) return "0 món";

  const firstItems = items.slice(0, 2).map((item) => `${item.name} x${item.qty}`);
  const extraCount = items.length - firstItems.length;

  return extraCount > 0
    ? `${firstItems.join(", ")} (+${extraCount} sản phẩm)`
    : firstItems.join(", ");
}

export default function OrderManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [activeNav, setActiveNav] = useState("orders");
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingOrderId, setProcessingOrderId] = useState("");
  const [deliveryOrderId, setDeliveryOrderId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoadingOrders(true);
      try {
        const nextOrders = await fetchOrders();
        if (isMounted) setOrders(nextOrders);
      } catch (error) {
        if (isMounted) showToast(error.message || "Không thể tải đơn hàng.");
      } finally {
        if (isMounted) setIsLoadingOrders(false);
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  async function handleReady(order) {
    if (processingOrderId) return;
    setProcessingOrderId(order.rawId);

    try {
      const updatedOrder = await prepareOrder(order.rawId);
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.rawId === updatedOrder.rawId ? updatedOrder : currentOrder
        )
      );
      setActiveTab("shipper");
      showToast(`Đơn #${updatedOrder.id} đang được chuẩn bị hàng.`);
    } catch (error) {
      showToast(error.message || "Không thể chuyển đơn sang đang lấy hàng.");
    } finally {
      setProcessingOrderId("");
    }
  }

  async function handleStartDelivery(order) {
    if (deliveryOrderId) return;
    setDeliveryOrderId(order.rawId);

    try {
      const updatedOrder = await startDelivery(order.rawId);
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.rawId === updatedOrder.rawId ? updatedOrder : currentOrder
        )
      );
      setActiveTab("history");
      showToast(`Đã bàn giao đơn #${updatedOrder.id} cho ${updatedOrder.shipper?.name || "shipper"}.`);
    } catch (error) {
      showToast(error.message || "Không thể chuyển đơn sang đang giao.");
    } finally {
      setDeliveryOrderId("");
    }
  }

  const searchedOrders = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) return orders;

    return orders.filter((order) => (
      order.id.toLowerCase().includes(normalizedSearch) ||
      order.customer.toLowerCase().includes(normalizedSearch) ||
      order.phone.toLowerCase().includes(normalizedSearch) ||
      order.items.some((item) => item.name.toLowerCase().includes(normalizedSearch))
    ));
  }, [orders, searchQuery]);

  const newOrders = searchedOrders.filter((order) => order.status === "pending");
  const handoverOrders = searchedOrders.filter((order) => order.status === "preparing");
  const historyOrders = searchedOrders.filter((order) => ["shipping", "completed"].includes(order.status));
  const cancelledOrders = searchedOrders.filter((order) => order.status === "cancelled");

  return (
    <div className="om-page">
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
          type="button"
          onClick={() => {
            setIsOpen((value) => !value);
            showToast(isOpen ? "Đã đóng cửa hàng." : "Đã mở cửa hàng!");
          }}
        >
          Mở/Đóng cửa hàng
        </button>

        <nav className="om-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`om-nav-item ${activeNav === item.id ? "active" : ""}`}
              type="button"
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

      <div className="om-right">
        <header className="om-header">
          <div className="om-search-wrap">
            <i className="fa-solid fa-magnifying-glass om-search-icon" />
            <input
              type="search"
              className="om-search"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </header>

        <main className="om-main">
          <div className="om-main-header">
            <h1 className="om-title">Quản lý Đơn hàng</h1>
            <p className="om-subtitle">Xử lý và bàn giao đơn hàng nhanh chóng.</p>
          </div>

          <div className="om-tabs" role="tablist">
            <button
              className={`om-tab ${activeTab === "new" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "new"}
              onClick={() => setActiveTab("new")}
            >
              Đơn hàng mới ({newOrders.length})
            </button>
            <button
              className={`om-tab ${activeTab === "shipper" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "shipper"}
              onClick={() => setActiveTab("shipper")}
            >
              Bàn giao cho Shipper ({handoverOrders.length})
            </button>
            <button
              className={`om-tab ${activeTab === "history" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "history"}
              onClick={() => setActiveTab("history")}
            >
              Lịch sử
            </button>
            <button
              className={`om-tab ${activeTab === "cancelled" ? "active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "cancelled"}
              onClick={() => setActiveTab("cancelled")}
            >
              Đơn hàng bị hủy ({cancelledOrders.length})
            </button>
          </div>

          {activeTab === "new" && (
            <>
              {isLoadingOrders ? (
                <EmptyState faIcon="fa-solid fa-spinner fa-spin" title="Đang tải đơn mới" sub="Đang lấy dữ liệu từ backend." />
              ) : newOrders.length > 0 ? (
                <div className="om-orders-grid">
                  {newOrders.map((order) => (
                    <NewOrderCard
                      key={order.rawId}
                      order={order}
                      isProcessing={processingOrderId === order.rawId}
                      onReady={handleReady}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState faIcon="fa-solid fa-circle-check" title="Không có đơn mới" sub="Tất cả đơn đã được xử lý hoặc bàn giao." />
              )}
            </>
          )}

          {activeTab === "shipper" && (
            <HandoverTab
              orders={handoverOrders}
              historyOrders={historyOrders}
              isLoading={isLoadingOrders}
              processingOrderId={deliveryOrderId}
              onStartDelivery={handleStartDelivery}
              onToast={showToast}
              onHistory={() => setActiveTab("history")}
            />
          )}

          {activeTab === "history" && (
            <HistoryTab orders={historyOrders} isLoading={isLoadingOrders} />
          )}

          {activeTab === "cancelled" && (
            <CancelledTab orders={cancelledOrders} isLoading={isLoadingOrders} />
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

function NewOrderCard({ order, isProcessing, onReady }) {
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
        {order.items.map((item) => (
          <li key={item.id} className="om-item-row">
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
          className="om-ready-btn"
          type="button"
          onClick={() => onReady(order)}
          disabled={isProcessing}
        >
          <i className={isProcessing ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-check"} />
          {isProcessing ? "Đang chuẩn bị..." : "Đang chuẩn bị hàng"}
        </button>
      </div>
    </article>
  );
}

function HandoverTab({ orders, historyOrders, isLoading, processingOrderId, onStartDelivery, onToast, onHistory }) {
  const recentOrders = [...orders, ...historyOrders].slice(0, 3);

  if (isLoading) {
    return <EmptyState faIcon="fa-solid fa-spinner fa-spin" title="Đang tải đơn bàn giao" sub="Đang lấy dữ liệu từ backend." />;
  }

  return (
    <section className="om-handover-section">
      <div className="om-handover-body">
        <div className="om-priority-col">
          <div className="om-priority-head">
            <h3 className="om-priority-title">Đơn hàng chờ shipper lấy</h3>
            <button className="om-view-all" type="button" onClick={() => onToast("Đang hiển thị tất cả đơn chờ bàn giao.")}>
              Xem tất cả <i className="fa-solid fa-arrow-right" />
            </button>
          </div>

          {orders.length > 0 ? (
            <div className="om-priority-list">
              {orders.map((order) => (
                <ShipperCard
                  key={order.rawId}
                  order={order}
                  isProcessing={processingOrderId === order.rawId}
                  onStartDelivery={onStartDelivery}
                />
              ))}
            </div>
          ) : (
            <EmptyState faIcon="fa-solid fa-truck-ramp-box" title="Chưa có đơn chờ bàn giao" sub="Khi bấm Đang chuẩn bị hàng, đơn sẽ xuất hiện ở đây." />
          )}
        </div>

        <div className="om-stats-col">
          <div className="om-stat-cards">
            <div className="om-stat-card om-stat-card--teal">
              <i className="fa-solid fa-truck" />
              <span className="om-stat-num">{historyOrders.length}</span>
              <span className="om-stat-label">Đã giao h.nay</span>
            </div>
            <div className="om-stat-card om-stat-card--orange">
              <i className="fa-regular fa-clock" />
              <span className="om-stat-num">{orders.length}</span>
              <span className="om-stat-label">Chờ bàn giao</span>
            </div>
          </div>

          <div className="om-recent-box">
            <h3 className="om-recent-title">Vừa bàn giao</h3>
            {recentOrders.length > 0 ? (
              <ul className="om-recent-list">
                {recentOrders.map((order) => (
                  <li key={order.rawId} className="om-recent-item">
                    <i className="fa-solid fa-circle-check om-recent-icon" />
                    <div className="om-recent-info">
                      <span className="om-recent-id">#{order.id}</span>
                      <span className="om-recent-shipper">
                        Shipper: {order.shipper?.name || "Đang cập nhật"}
                      </span>
                    </div>
                    <span className="om-recent-time">{order.time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="om-recent-empty">Chưa có lịch sử bàn giao.</div>
            )}
            <button className="om-history-btn" type="button" onClick={onHistory}>
              Xem toàn bộ lịch sử
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShipperCard({ order, isProcessing, onStartDelivery }) {
  return (
    <div className="om-priority-card">
      <div className="om-priority-card-left">
        <div className="om-priority-badges">
          <span className="om-urgency-badge standard">{ORDER_STATUS_LABELS[order.status]}</span>
          <span className="om-order-hash">#{order.id}</span>
        </div>
        <p className="om-pc-customer">
          <i className="fa-solid fa-user" /> Khách hàng: <strong>{order.customer}</strong>
        </p>
        <p className="om-pc-address">
          <i className="fa-solid fa-location-dot" /> {order.address}
        </p>
        <p className="om-pc-items">
          <i className="fa-solid fa-basket-shopping" /> {order.itemCount} món ({summarizeItems(order.items)})
        </p>
        <p className="om-pc-items">
          <i className="fa-solid fa-motorcycle" /> Shipper: {order.shipper?.name || "Đang cập nhật"} {order.shipper?.phone ? `• ${order.shipper.phone}` : ""}
        </p>
      </div>
      <div className="om-priority-card-right">
        <div className="om-qr-wrap">
          <img src={imgQR} alt="QR" className="om-pc-qr" />
        </div>
        <button
          className="om-pc-confirm"
          type="button"
          disabled={isProcessing}
          onClick={() => onStartDelivery(order)}
        >
          <i className={isProcessing ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-truck-ramp-box"} />
          {isProcessing ? "Đang bàn giao..." : "Bàn giao cho Shipper"}
        </button>
      </div>
    </div>
  );
}

function HistoryTab({ orders, isLoading }) {
  if (isLoading) {
    return <EmptyState faIcon="fa-solid fa-spinner fa-spin" title="Đang tải lịch sử" sub="Đang lấy dữ liệu từ backend." />;
  }

  return (
    <section className="om-handover-section">
      <div className="om-history-table-wrap">
        <table className="om-history-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Thời gian</th>
              <th>Khách hàng</th>
              <th>Shipper</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.rawId}>
                  <td className="om-ht-id">#{order.id}</td>
                  <td className="om-ht-time">{order.time}</td>
                  <td>{order.customer}</td>
                  <td className="om-ht-shipper">{order.shipper?.name || "Đang cập nhật"}</td>
                  <td>
                    <span className="om-badge ready">
                      <i className="fa-solid fa-check" /> {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="om-recent-empty">Chưa có đơn trong lịch sử.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CancelledTab({ orders, isLoading }) {
  if (isLoading) {
    return <EmptyState faIcon="fa-solid fa-spinner fa-spin" title="Đang tải đơn bị hủy" sub="Đang lấy dữ liệu từ backend." />;
  }

  return (
    <section className="om-handover-section">
      {orders.length > 0 ? (
        <div className="om-orders-grid">
          {orders.map((order) => (
            <article className="om-order-card om-order-card--cancelled" key={order.rawId}>
              <div className="om-card-head">
                <div className="om-order-id">
                  <span className="om-order-hash">#{order.id}</span>
                  <span className="om-badge cancelled">Đã hủy</span>
                </div>
                <p className="om-order-meta">
                  {order.time} • {order.itemCount} món • {order.customer}
                </p>
              </div>

              <div className="om-card-divider" />

              <ul className="om-item-list">
                {order.items.map((item) => (
                  <li key={item.id} className="om-item-row">
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
                <span className="om-cancelled-note">Khách hàng đã hủy đơn</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState faIcon="fa-solid fa-ban" title="Chưa có đơn bị hủy" sub="Khi khách hủy đơn, đơn sẽ xuất hiện ở mục này." />
      )}
    </section>
  );
}

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
