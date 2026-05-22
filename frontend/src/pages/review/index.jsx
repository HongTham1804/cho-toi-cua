import './review.css';
import { useEffect, useRef, useState } from "react";
import { fetchReviewOrder, getOrderIdFromUrl, postReviews } from "./reviewApi.js";

const STAR_HINTS = ["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc!"];
const EMPTY_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f1f5f9%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E";

export default function App() {
  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState({});
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorIds, setErrorIds] = useState([]);
  const [toast, setToast] = useState(null);
  const cardRefs = useRef({});
  const reviewsRef = useRef(reviews);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const orderId = getOrderIdFromUrl() ?? "CTC-2024-8892";
        const nextOrder = await fetchReviewOrder(orderId);
        if (!active) return;

        setOrder(nextOrder);
        setReviews(
          Object.fromEntries(
            nextOrder.products.map((product) => [
              product.id,
              { rating: 0, comment: "", images: [] },
            ]),
          ),
        );
      } catch (err) {
        showToast(err.message ?? "Không thể tải trang đánh giá.", "error");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  useEffect(() => {
    return () => {
      Object.values(reviewsRef.current).forEach((review) => {
        review.images?.forEach((image) => URL.revokeObjectURL(image.url));
      });
    };
  }, []);

  function showToast(message, type = "info") {
    setToast({ message, type, id: Date.now() });
  }

  function updateReview(productId, patch) {
    setReviews((current) => ({
      ...current,
      [productId]: { ...current[productId], ...patch },
    }));

    if (patch.rating > 0) {
      setErrorIds((current) => current.filter((id) => id !== productId));
    }
  }

  function addImages(productId, fileList) {
    const images = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));

    if (images.length === 0) return;

    setReviews((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        images: [...current[productId].images, ...images],
      },
    }));
  }

  function removeImage(productId, imageId) {
    setReviews((current) => {
      const image = current[productId].images.find((item) => item.id === imageId);
      if (image) URL.revokeObjectURL(image.url);

      return {
        ...current,
        [productId]: {
          ...current[productId],
          images: current[productId].images.filter((item) => item.id !== imageId),
        },
      };
    });
  }

  async function handleSubmit() {
    if (!order || submitting || submitted) return;

    const invalidIds = order.products
      .filter((product) => (reviews[product.id]?.rating ?? 0) === 0)
      .map((product) => product.id);

    setErrorIds(invalidIds);

    if (invalidIds.length > 0) {
      showToast("Vui lòng chọn số sao cho tất cả sản phẩm.", "error");
      cardRefs.current[invalidIds[0]]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const payload = order.products.map((product) => ({
      productId: product.id,
      rating: reviews[product.id].rating,
      comment: reviews[product.id].comment.trim(),
    }));

    const imageMap = Object.fromEntries(
      order.products
        .map((product) => [
          product.id,
          reviews[product.id].images.map((image) => image.file),
        ])
        .filter(([, files]) => files.length > 0),
    );

    setSubmitting(true);

    try {
      const result = await postReviews(order.orderId, anonymous, payload, imageMap);
      showToast(result.message ?? "Đánh giá thành công!", "success");
      setSubmitted(true);
    } catch (err) {
      console.error("[Review] Lỗi gửi đánh giá:", err);
      showToast(err.message ?? "Gửi đánh giá thất bại. Vui lòng thử lại.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="review-page">
      <Header />
      <Breadcrumb />

      <main className="review-main container" role="main">
        {loading ? (
          <LoadingReview />
        ) : (
          <>
            {order && <OrderSummary order={order} />}

            <section aria-label="Danh sách sản phẩm cần đánh giá">
              <ol className="review-list" aria-live="polite">
                {order?.products.map((product) => (
                  <ReviewCard
                    key={product.id}
                    product={product}
                    review={reviews[product.id]}
                    hasError={errorIds.includes(product.id)}
                    onChange={(patch) => updateReview(product.id, patch)}
                    onAddImages={(files) => addImages(product.id, files)}
                    onRemoveImage={(imageId) => removeImage(product.id, imageId)}
                    refCallback={(node) => {
                      cardRefs.current[product.id] = node;
                    }}
                  />
                ))}
              </ol>
            </section>

            <SubmitBar
              anonymous={anonymous}
              onAnonymousChange={setAnonymous}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitted={submitted}
            />
          </>
        )}
      </main>

      <Footer />
      <Toast toast={toast} />
    </div>
  );
}

function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner container">
        <Logo size={28} ariaLabel="Chợ Tới Cửa - trang chủ" />

        <nav className="site-nav" aria-label="Điều hướng chính">
          <a href="#" className="nav-link">Sản phẩm</a>
          <a href="#" className="nav-link">Khuyến mãi</a>
          <a href="#" className="nav-link">Cửa hàng</a>
        </nav>

        <div className="header-tools">
          <div className="search-wrap" role="search">
            <SearchIcon className="search-icon" />
            <input
              className="search-input"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Tìm kiếm sản phẩm"
            />
          </div>

          <button className="icon-btn" aria-label="Thông báo" type="button">
            <BellIcon />
          </button>

          <button className="icon-btn" aria-label="Giỏ hàng" type="button">
            <CartIcon />
            <span className="badge" aria-label="2 sản phẩm trong giỏ">2</span>
          </button>

          <button className="icon-btn" aria-label="Tài khoản" type="button">
            <UserIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function Breadcrumb() {
  return (
    <div className="breadcrumb-bar">
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb">
            <li><a href="#">Đơn hàng của tôi</a></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Đánh giá sản phẩm</li>
          </ol>
        </nav>
        <h1 className="page-title">Đánh giá trải nghiệm</h1>
      </div>
    </div>
  );
}

function OrderSummary({ order }) {
  return (
    <section className="order-summary" aria-label="Thông tin đơn hàng">
      <div className="order-id-row">
        <div>
          <p className="order-id-label">Mã đơn hàng</p>
          <p className="order-id-value">#{order.orderId}</p>
        </div>
        <div className="order-status-badge">
          <CheckIcon />
          <span>{order.status}</span>
        </div>
      </div>

      <div className="order-meta">
        <MetaItem label="Ngày nhận" value={order.receivedAt} />
        <MetaItem label="Người đặt" value={order.customerName} />
        <MetaItem label="Địa chỉ" value={order.address} />
      </div>
    </section>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="meta-item">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}

function ReviewCard({
  product,
  review,
  hasError,
  onChange,
  onAddImages,
  onRemoveImage,
  refCallback,
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const rating = review?.rating ?? 0;
  const activeRating = hoverRating || rating;

  return (
    <li
      ref={refCallback}
      className={`review-card${hasError ? " has-error" : ""}`}
      data-product-id={product.id}
    >
      <img
        className="product-image"
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = EMPTY_IMAGE;
        }}
      />

      <div className="review-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-origin">Xuất xứ: {product.origin}</p>

        <p className="star-label">Chất lượng sản phẩm</p>
        <div
          className="stars"
          role="radiogroup"
          aria-label="Chọn số sao đánh giá"
          data-rating={rating}
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={`star-btn${value <= rating ? " filled" : ""}${value <= hoverRating ? " hovered" : ""}`}
              aria-label={`${value} sao`}
              aria-pressed={value <= rating}
              onMouseEnter={() => setHoverRating(value)}
              onClick={() => onChange({ rating: value })}
            >
              {value <= activeRating ? "★" : "☆"}
            </button>
          ))}
          <span className="star-hint" aria-live="polite">
            {STAR_HINTS[rating] ?? ""}
          </span>
        </div>
        <p className="field-error" role="alert">
          Vui lòng chọn số sao đánh giá.
        </p>

        <textarea
          className="review-input"
          rows="3"
          maxLength="1000"
          placeholder="Bạn thấy sản phẩm này thế nào? Chia sẻ cảm nhận về độ tươi, mùi vị..."
          aria-label={`Nhận xét về ${product.name}`}
          value={review?.comment ?? ""}
          onChange={(event) => onChange({ comment: event.target.value })}
        />

        <div className="upload-area">
          <label className="upload-box" title="Thêm ảnh từ thiết bị">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              aria-label="Tải ảnh lên"
              onChange={(event) => {
                onAddImages(event.target.files);
                event.target.value = "";
              }}
            />
            <ImageIcon />
            <span>Thêm ảnh</span>
          </label>

          <div className="preview-thumbnails" aria-label="Ảnh đã chọn">
            {review?.images.map((image) => (
              <div className="preview-thumb" key={image.id}>
                <img src={image.url} alt={image.file.name} />
                <button
                  className="remove-btn"
                  type="button"
                  aria-label={`Xóa ảnh ${image.file.name}`}
                  onClick={() => onRemoveImage(image.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function SubmitBar({ anonymous, onAnonymousChange, onSubmit, submitting, submitted }) {
  return (
    <div className="submit-bar">
      <label className="anonymous-label" htmlFor="anonymous">
        <input
          type="checkbox"
          id="anonymous"
          checked={anonymous}
          onChange={(event) => onAnonymousChange(event.target.checked)}
        />
        <span className="checkbox-custom" aria-hidden="true"></span>
        <span className="anonymous-text">
          Đánh giá ẩn danh
          <small>Tên của bạn sẽ được ẩn đi trong phần nhận xét.</small>
        </span>
      </label>

      <button
        className={`btn-submit${submitting ? " loading" : ""}`}
        type="button"
        onClick={onSubmit}
        disabled={submitting || submitted}
        style={submitted ? { background: "#15803d" } : undefined}
      >
        <span>
          {submitted
            ? "Đã gửi đánh giá ✓"
            : submitting
              ? "Đang gửi..."
              : "Gửi đánh giá tất cả"}
        </span>
        <SendIcon />
      </button>
    </div>
  );
}

function LoadingReview() {
  return (
    <>
      <section className="order-summary" aria-label="Đang tải thông tin đơn hàng">
        <div className="order-id-row">
          <div>
            <p className="order-id-label skeleton">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p className="order-id-value skeleton">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
          <div className="order-status-badge skeleton">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div className="order-meta">
          <div className="skeleton" style={{ height: 36, width: 130 }} />
          <div className="skeleton" style={{ height: 36, width: 190 }} />
          <div className="skeleton" style={{ height: 36, width: 220 }} />
        </div>
      </section>

      <ol className="review-list" aria-live="polite">
        {[1, 2].map((item) => (
          <li className="review-card" style={{ gap: "1rem" }} key={item}>
            <div
              className="skeleton"
              style={{ width: 100, height: 100, borderRadius: 12, flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="skeleton" style={{ height: 18, width: "60%" }} />
              <div className="skeleton" style={{ height: 14, width: "40%" }} />
              <div className="skeleton" style={{ height: 80 }} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Logo size={24} ariaLabel="Chợ Tới Cửa" />
          <p className="footer-tagline">
            © 2026 Chợ Tới Cửa. Tươi ngon từ nông trại
            <br />
            đến tận cửa nhà.
          </p>
        </div>

        <FooterColumn title="Khám phá" links={["Về chúng tôi", "Tuyển dụng"]} />
        <FooterColumn title="Hỗ trợ" links={["Liên hệ hỗ trợ", "Trung tâm giúp đỡ"]} />
        <FooterColumn title="Pháp lý" links={["Chính sách bảo mật", "Điều khoản dịch vụ"]} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="footer-col">
      <h4 className="footer-col-title">{title}</h4>
      <ul className="footer-links">
        {links.map((link) => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}

function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div
      className={`toast${toast ? ` toast-${toast.type}` : ""}${visible ? " show" : ""}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toast?.message}
    </div>
  );
}

function Logo({ size, ariaLabel }) {
  return (
    <a href="/" className="logo" aria-label={ariaLabel}>
      <div className="logo-mark">
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="#1a7a4a" />
          <path
            d="M8 14 C8 10 11 7 14 7 C17 7 20 10 20 14 C20 18 17 21 14 21 C11 21 8 18 8 14Z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
          />
          <path
            d="M11 14 L13 16 L17 12"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="logo-text">Chợ Tới Cửa</span>
    </a>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.68l1.62-8.32H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

