import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./order-detail.css";
import { fetchOrders, reorder } from "../order-history/api/order-history-api";
import imgRauMuong from "../../assets/rau muống.jpg";
import imgTomato from "../../assets/Cà chua Mộc Châu.png";
import imgBeef from "../../assets/Thịt bò.jpg";
import imgEggs from "../../assets/eggs.jpg";
import imgSuplo from "../../assets/suplo.jpg";

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  preparing: "Đang lấy hàng",
  shipping: "Đang giao",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const ORDER_DETAILS = {
  "CTC-98234": {
    estimate: "27 Th05 - 29 Th05",
    carrier: "CTC Express: CTCVN069723352595",
    transportTitle: "Đơn hàng đã đến kho",
    transportTime: "26-05-2026 12:40",
    transportNote: "Đã đồng kiểm tại kho trung chuyển.",
    receiver: "Nguyễn Văn A",
    phone: "(+84) 359 928 352",
    address: "Thảo Điền, Quận Bình Thạnh, TP.HCM",
    paymentMethod: "Ví Chợ Tới Cửa",
    orderCode: "260525A2CTC98234",
    orderedAt: "24-10-2023 08:30",
    paidAt: "24-10-2023 08:32",
    pickedAt: "24-10-2023 09:15",
    completedAt: "",
    products: [
      {
        id: "rau-muong",
        name: "Rau muống hữu cơ",
        variant: "Bó 500g",
        image: imgRauMuong,
        quantity: 2,
        price: 70000,
      },
      {
        id: "ca-chua",
        name: "Cà chua bi Mộc Châu",
        variant: "Hộp 300g",
        image: imgTomato,
        quantity: 1,
        price: 65000,
      },
      {
        id: "thit-bo",
        name: "Thịt bò Úc cắt lát",
        variant: "Khay 250g",
        image: imgBeef,
        quantity: 1,
        price: 210000,
      },
    ],
  },
  "CTC-09870": {
    carrier: "CTC Express: CTCVN060541874284",
    transportTitle: "Giao hàng thành công",
    transportTime: "23-10-2023 17:42",
    transportNote: "Đơn đã được giao đến người nhận.",
    receiver: "Nguyễn Văn A",
    phone: "(+84) 359 928 352",
    address: "Thảo Điền, Quận Bình Thạnh, TP.HCM",
    paymentMethod: "Ví Chợ Tới Cửa",
    orderCode: "260423JKA52FN5",
    orderedAt: "20-10-2023 14:15",
    paidAt: "20-10-2023 14:17",
    pickedAt: "20-10-2023 15:40",
    completedAt: "20-10-2023 17:42",
    products: [
      {
        id: "sua-trung",
        name: "Sữa tươi TH True Milk",
        variant: "Lốc 4 hộp",
        image: imgEggs,
        quantity: 1,
        price: 52000,
      },
      {
        id: "banh-mi-goi",
        name: "Bánh mì gối nguyên cám",
        variant: "Gói 450g",
        image: imgSuplo,
        quantity: 1,
        price: 68000,
      },
    ],
  },
  "CTC-88120": {
    carrier: "CTC Express: CTCVN06054188120",
    transportTitle: "Giao hàng thành công",
    transportTime: "15-10-2023 13:30",
    transportNote: "Người mua đã xác nhận nhận hàng.",
    receiver: "Nguyễn Văn A",
    phone: "(+84) 908 000 000",
    address: "221B Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM",
    paymentMethod: "Ví Chợ Tới Cửa",
    orderCode: "151023CTC88120",
    orderedAt: "15-10-2023 11:00",
    paidAt: "15-10-2023 11:02",
    pickedAt: "15-10-2023 11:45",
    completedAt: "15-10-2023 13:30",
    products: [
      {
        id: "trung-ga",
        name: "Trứng gà ta",
        variant: "Hộp 10 quả",
        image: imgEggs,
        quantity: 1,
        price: 42000,
      },
      {
        id: "rau-cai",
        name: "Rau cải xanh",
        variant: "Bó 500g",
        image: imgRauMuong,
        quantity: 1,
        price: 45000,
      },
    ],
  },
};

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function buildDetail(order) {
  const override = ORDER_DETAILS[order.id] ?? {};
  return {
    estimate: "Hôm nay, 18:30 - 19:00",
    carrier: "CTC Express: CTCVN000000000",
    transportTitle: order.status === "completed" ? "Giao hàng thành công" : "Đơn hàng đang được xử lý",
    transportTime: order.date,
    transportNote: "Thông tin vận chuyển được cập nhật theo thời gian thực.",
    receiver: "Nguyễn Văn A",
    phone: "(+84) 908 000 000",
    address: "Khu Công Nghệ Cao, Thành phố Thủ Đức, TP.HCM",
    paymentMethod: "Ví Chợ Tới Cửa",
    orderCode: order.id.replaceAll("-", ""),
    orderedAt: order.date.replace(" - ", " "),
    paidAt: order.date.replace(" - ", " "),
    pickedAt: "",
    completedAt: order.status === "completed" ? order.date.replace(" - ", " ") : "",
    products: [
      {
        id: "default-product",
        name: order.products,
        variant: "Sản phẩm trong đơn",
        image: imgSuplo,
        quantity: 1,
        price: order.total,
      },
    ],
    ...override,
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

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      const orders = await fetchOrders("all");
      const searchOrderId = new URLSearchParams(location.search).get("orderId");
      const decodedId = decodeURIComponent(orderId ?? searchOrderId ?? "CTC-98234");
      const nextOrder = orders.find((item) => item.id === decodedId) ?? null;

      if (!active) return;
      setOrder(nextOrder);
      setLoading(false);
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [orderId, location.search]);

  const detail = useMemo(() => (order ? buildDetail(order) : null), [order]);
  const isCompleted = order?.status === "completed";
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
            <Link to="/order-history" className="od-btn od-btn-primary">Quay lại đơn mua</Link>
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
          {isShipping ? (
            <>
              <p className="hero-kicker">Thời gian nhận hàng dự kiến</p>
              <h2>{detail.estimate}</h2>
              <p>Giao đúng hẹn để bạn yên tâm nhận hàng tươi trong ngày.</p>
            </>
          ) : (
            <>
              <p className="hero-kicker">Đơn hàng đã hoàn thành</p>
              <h2>Cảm ơn bạn đã mua sắm tại Chợ Tới Cửa</h2>
              <p>Đơn hàng đã giao thành công. Bạn có thể mua lại hoặc gửi đánh giá cho sản phẩm.</p>
            </>
          )}
        </section>

        <div className="order-detail-grid">
          <div className="order-detail-stack">
            <InfoCard title="Thông tin vận chuyển" icon="fa-truck-fast">
              <button className="card-link-row" type="button">
                <span>{detail.carrier}</span>
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </button>
              <div className={`shipping-step ${isCompleted ? "done" : "active"}`}>
                <span className="shipping-step-icon">
                  <i className="fa-solid fa-truck" aria-hidden="true"></i>
                </span>
                <div>
                  <strong>{detail.transportTitle}</strong>
                  <p>{detail.transportTime}</p>
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

            <ProductCard order={order} detail={detail} />
          </div>

          <aside className="order-detail-stack">
            <SupportCard completed={isCompleted} />
            <MetaCard detail={detail} completed={isCompleted} onCopy={handleCopy} />
          </aside>
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
          ) : (
            <>
              <button className="od-btn od-btn-outline" type="button" onClick={() => showToast("Yêu cầu hủy đơn đã được ghi nhận.")}>
                Xác nhận hủy
              </button>
              <Link className="od-btn od-btn-primary" to={`/tracking?orderId=${encodeURIComponent(order.id)}`}>
                Theo dõi đơn
              </Link>
            </>
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

function ProductCard({ order, detail }) {
  return (
    <section className="order-detail-card product-card">
      <div className="product-store-row">
        <span className="store-pill">Mall</span>
        <h2>{order.storeName}</h2>
        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </div>

      <div className="product-list">
        {detail.products.map((product) => (
          <article className="product-item" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-copy">
              <h3>{product.name}</h3>
              <p>{product.variant}</p>
              <span>x{product.quantity}</span>
            </div>
            <strong>{formatCurrency(product.price)}</strong>
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

function SupportCard({ completed }) {
  const rows = completed
    ? ["Gửi yêu cầu Trả hàng/Hoàn tiền", "Liên hệ siêu thị", "Trung tâm hỗ trợ"]
    : ["Xác nhận hủy", "Liên hệ siêu thị", "Trung tâm hỗ trợ"];

  return (
    <section className="order-detail-card support-card">
      <h2>Bạn cần hỗ trợ?</h2>
      {rows.map((row, index) => (
        <button className="support-row" type="button" key={row}>
          <span>
            <i
              className={`fa-solid ${index === 0 ? "fa-clock-rotate-left" : index === 1 ? "fa-comments" : "fa-circle-question"}`}
              aria-hidden="true"
            ></i>
            {row}
          </span>
          <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      ))}
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
      <MetaRow label="Thời gian thanh toán" value={detail.paidAt} />
      {detail.pickedAt && <MetaRow label="Thời gian đơn vị vận chuyển lấy hàng" value={detail.pickedAt} />}
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
