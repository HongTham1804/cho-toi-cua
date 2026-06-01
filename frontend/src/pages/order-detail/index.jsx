import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./order-detail.css";
import { cancelOrder, fetchOrderById, reorder } from "../order-history/api/order-history-api";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  preparing: "Đang lấy hàng",
  shipping: "Đang giao",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")}đ`;
}

function formatDateTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildDetail(order) {
  const isCompleted = order.status === "completed";
  const isPreparing = order.status === "preparing";
  const isShipping = order.status === "shipping";
  const isCancelled = order.status === "cancelled";

  return {
    estimate: isCompleted
      ? "Đơn hàng đã hoàn thành"
      : isCancelled
        ? "Đơn hàng đã được hủy"
        : "Hôm nay, 30 - 45 phút",
    transportTitle: isCompleted
      ? "Giao hàng thành công"
      : isCancelled
        ? "Đơn hàng đã hủy"
        : isShipping
          ? "Shipper đang giao hàng"
          : isPreparing
            ? "Shipper đang lấy hàng tại siêu thị"
            : "Siêu thị đang chuẩn bị hàng",
    transportNote: isCompleted
      ? "Cảm ơn bạn đã mua sắm tại Chợ Tới Cửa."
      : isCancelled
        ? "Đơn hàng đã được chuyển sang mục Đã hủy."
        : isShipping
          ? `Shipper: ${order.shipper?.name || "Đang cập nhật"}${order.shipper?.phone ? ` - ${order.shipper.phone}` : ""}`
          : isPreparing
            ? "Siêu thị đang chuẩn bị hàng và sẽ bàn giao cho shipper."
            : "Bạn vẫn có thể hủy đơn trước khi siêu thị bàn giao cho shipper.",
    receiver: order.customerName,
    phone: order.customerPhone,
    address: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    orderCode: `CTC-${String(order.id).padStart(6, "0")}`,
    orderedAt: formatDateTime(order.createdAt),
    completedAt: isCompleted ? formatDateTime(order.createdAt) : "",
  };
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [reordering, setReordering] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      try {
        const searchOrderId = new URLSearchParams(location.search).get("orderId");
        const decodedId = decodeURIComponent(orderId ?? searchOrderId ?? "");
        const nextOrder = await fetchOrderById(decodedId);

        if (active) setOrder(nextOrder);
      } catch {
        if (active) setOrder(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderId, location.search]);

  const detail = useMemo(() => (order ? buildDetail(order) : null), [order]);
  const isCompleted = order?.status === "completed";
  const isCancellable = ["pending", "preparing"].includes(order?.status);
  const isShipping = order?.status === "shipping";
  const statusLabel = STATUS_LABELS[order?.status] ?? "Thông tin đơn";

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  async function handleReorder() {
    if (!order || reordering) return;
    setReordering(true);

    try {
      const result = await reorder(order.id);
      showToast(result.message ?? "Đã thêm lại sản phẩm vào giỏ hàng.");
    } catch {
      showToast("Không thể mua lại. Vui lòng thử lại.");
    } finally {
      setReordering(false);
    }
  }

  async function handleCancelOrder() {
    if (!order || cancelling || !isCancellable) return;

    const confirmed = window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?");
    if (!confirmed) return;

    setCancelling(true);
    try {
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
      showToast("Đã hủy đơn hàng. Đơn đã chuyển sang mục Đã hủy.");
    } catch (error) {
      showToast(error.message || "Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleCopy() {
    if (!detail?.orderCode) return;

    try {
      await navigator.clipboard.writeText(detail.orderCode);
      showToast("Đã sao chép mã đơn hàng.");
    } catch {
      showToast("Mã đơn hàng đã sẵn sàng để sao chép.");
    }
  }

  if (loading) {
    return (
      <div className="order-detail-page">
        <main className="order-detail-shell">
          <div className="order-detail-loading">Đang tải thông tin đơn hàng...</div>
        </main>
      </div>
    );
  }

  if (!order || !detail) {
    return (
      <div className="order-detail-page">
        <main className="order-detail-shell">
          <div className="order-detail-empty">
            <h1>Không tìm thấy đơn hàng</h1>
            <p>Đơn hàng này không tồn tại hoặc đã được cập nhật.</p>
            <Link to="/order-history" className="od-btn od-btn-primary">Quay lại Đơn mua</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`order-detail-page order-detail-page--${order.status}`}>
      <main className="order-detail-shell">
        <header className="order-detail-topbar">
          <button className="order-back-btn" type="button" onClick={() => navigate("/order-history")}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            <span>Đơn mua</span>
          </button>

          <div className="order-detail-title">
            <p>Thông tin đơn hàng</p>
            <h1>#{order.id}</h1>
          </div>

          <span className={`order-detail-status order-detail-status--${order.status}`}>
            {statusLabel}
          </span>
        </header>

        <section className="order-detail-hero">
          <p className="hero-kicker">Trạng thái đơn hàng</p>
          <h2>{detail.transportTitle}</h2>
          <p>{detail.transportNote}</p>
        </section>

        <div className="order-detail-grid">
          <div className="order-detail-stack">
            <InfoCard title="Thông tin vận chuyển" icon="fa-truck-fast">
              <div className={`shipping-step ${isCompleted ? "done" : "active"}`}>
                <span className="shipping-step-icon">
                  <i className="fa-solid fa-truck" aria-hidden="true"></i>
                </span>
                <div>
                  <strong>{detail.transportTitle}</strong>
                  <p>{detail.estimate}</p>
                  <small>{detail.transportNote}</small>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Địa chỉ nhận hàng" icon="fa-location-dot">
              <div className="address-block">
                <strong>{detail.receiver} <span>{detail.phone}</span></strong>
                <p>{detail.address}</p>
              </div>
            </InfoCard>

            <ProductCard order={order} />
            <MetaCard detail={detail} completed={isCompleted} onCopy={handleCopy} />
          </div>
        </div>

        <div className="order-detail-actions">
          {isCompleted ? (
            <>
              <button className="od-btn od-btn-outline" type="button" disabled={reordering} onClick={handleReorder}>
                {reordering ? "Đang thêm..." : "Mua lại"}
              </button>
              <Link className="od-btn od-btn-primary" to={`/review?orderId=${encodeURIComponent(order.id)}`}>
                Đánh giá
              </Link>
            </>
          ) : isCancellable ? (
            <button
              className="od-btn od-btn-danger"
              type="button"
              disabled={cancelling}
              onClick={handleCancelOrder}
            >
              {cancelling ? "Đang hủy..." : "Xác nhận hủy"}
            </button>
          ) : isShipping ? (
            <>
              <Link className="od-btn od-btn-primary" to={`/tracking?orderId=${encodeURIComponent(order.id)}`}>
                Theo dõi đơn
              </Link>
              <button className="od-btn od-btn-disabled" type="button" disabled>
                Không thể hủy
              </button>
            </>
          ) : (
            <button className="od-btn od-btn-disabled" type="button" disabled>
              Đơn hàng đã hủy
            </button>
          )}
        </div>
      </main>

      {toast && (
        <div className="order-detail-toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <section className="order-detail-card">
      <div className="card-title">
        <span><i className={`fa-solid ${icon}`} aria-hidden="true"></i></span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ProductCard({ order }) {
  return (
    <section className="order-detail-card product-card">
      <div className="product-store-row">
        <span className="store-pill">Mall</span>
        <h2>{order.storeName}</h2>
        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </div>

      <div className="product-list">
        {order.items.map((product) => (
          <article className="product-item" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-copy">
              <h3>{product.name}</h3>
              <p>Sản phẩm trong đơn</p>
              <span>x{product.quantity}</span>
            </div>
            <strong>{formatCurrency(product.lineTotal)}</strong>
          </article>
        ))}
      </div>

      <div className="product-total">
        <span>Thành tiền</span>
        <strong>{formatCurrency(order.total)}</strong>
      </div>
    </section>
  );
}

function MetaCard({ detail, completed, onCopy }) {
  return (
    <section className="order-detail-card meta-card">
      <div className="meta-code-row">
        <h2>Mã đơn hàng</h2>
        <div>
          <strong>{detail.orderCode}</strong>
          <button type="button" onClick={onCopy}>Sao chép</button>
        </div>
      </div>

      <MetaRow label="Phương thức thanh toán" value={detail.paymentMethod} />
      <MetaRow label="Thời gian đặt hàng" value={detail.orderedAt} />
      {completed && detail.completedAt && <MetaRow label="Thời gian hoàn thành đơn" value={detail.completedAt} />}
    </section>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="meta-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
