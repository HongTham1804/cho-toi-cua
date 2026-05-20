import './review.css';
import { useEffect, useRef, useState } from "react";
import { fetchReviewOrder, getOrderIdFromUrl, postReviews } from "./reviewApi.js";

const STAR_HINTS = ["", "Ráº¥t tá»‡", "Tá»‡", "BÃ¬nh thÆ°á»ng", "Tá»‘t", "Xuáº¥t sáº¯c!"];
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
        showToast(err.message ?? "KhÃ´ng thá»ƒ táº£i trang Ä‘Ã¡nh giÃ¡.", "error");
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
      showToast("Vui lÃ²ng chá»n sá»‘ sao cho táº¥t cáº£ sáº£n pháº©m.", "error");
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
      showToast(result.message ?? "ÄÃ¡nh giÃ¡ thÃ nh cÃ´ng!", "success");
      setSubmitted(true);
    } catch (err) {
      console.error("[Review] Lá»—i gá»­i Ä‘Ã¡nh giÃ¡:", err);
      showToast(err.message ?? "Gá»­i Ä‘Ã¡nh giÃ¡ tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <Breadcrumb />

      <main className="review-main container" role="main">
        {loading ? (
          <LoadingReview />
        ) : (
          <>
            {order && <OrderSummary order={order} />}

            <section aria-label="Danh sÃ¡ch sáº£n pháº©m cáº§n Ä‘Ã¡nh giÃ¡">
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
    </>
  );
}

function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner container">
        <Logo size={28} ariaLabel="Chá»£ Tá»›i Cá»­a - trang chá»§" />

        <nav className="site-nav" aria-label="Äiá»u hÆ°á»›ng chÃ­nh">
          <a href="#" className="nav-link">Sáº£n pháº©m</a>
          <a href="#" className="nav-link">Khuyáº¿n mÃ£i</a>
          <a href="#" className="nav-link">Cá»­a hÃ ng</a>
        </nav>

        <div className="header-tools">
          <div className="search-wrap" role="search">
            <SearchIcon className="search-icon" />
            <input
              className="search-input"
              type="search"
              placeholder="TÃ¬m kiáº¿m sáº£n pháº©m..."
              aria-label="TÃ¬m kiáº¿m sáº£n pháº©m"
            />
          </div>

          <button className="icon-btn" aria-label="ThÃ´ng bÃ¡o" type="button">
            <BellIcon />
          </button>

          <button className="icon-btn" aria-label="Giá» hÃ ng" type="button">
            <CartIcon />
            <span className="badge" aria-label="2 sáº£n pháº©m trong giá»">2</span>
          </button>

          <button className="icon-btn" aria-label="TÃ i khoáº£n" type="button">
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
            <li><a href="#">ÄÆ¡n hÃ ng cá»§a tÃ´i</a></li>
            <li aria-hidden="true">â€º</li>
            <li aria-current="page">ÄÃ¡nh giÃ¡ sáº£n pháº©m</li>
          </ol>
        </nav>
        <h1 className="page-title">ÄÃ¡nh giÃ¡ tráº£i nghiá»‡m</h1>
      </div>
    </div>
  );
}

function OrderSummary({ order }) {
  return (
    <section className="order-summary" aria-label="ThÃ´ng tin Ä‘Æ¡n hÃ ng">
      <div className="order-id-row">
        <div>
          <p className="order-id-label">MÃ£ Ä‘Æ¡n hÃ ng</p>
          <p className="order-id-value">#{order.orderId}</p>
        </div>
        <div className="order-status-badge">
          <CheckIcon />
          <span>{order.status}</span>
        </div>
      </div>

      <div className="order-meta">
        <MetaItem label="NgÃ y nháº­n" value={order.receivedAt} />
        <MetaItem label="NgÆ°á»i Ä‘áº·t" value={order.customerName} />
        <MetaItem label="Äá»‹a chá»‰" value={order.address} />
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
        <p className="product-origin">Xuáº¥t xá»©: {product.origin}</p>

        <p className="star-label">Cháº¥t lÆ°á»£ng sáº£n pháº©m</p>
        <div
          className="stars"
          role="radiogroup"
          aria-label="Chá»n sá»‘ sao Ä‘Ã¡nh giÃ¡"
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
              {value <= activeRating ? "â˜…" : "â˜†"}
            </button>
          ))}
          <span className="star-hint" aria-live="polite">
            {STAR_HINTS[rating] ?? ""}
          </span>
        </div>
        <p className="field-error" role="alert">
          Vui lÃ²ng chá»n sá»‘ sao Ä‘Ã¡nh giÃ¡.
        </p>

        <textarea
          className="review-input"
          rows="3"
          maxLength="1000"
          placeholder="Báº¡n tháº¥y sáº£n pháº©m nÃ y tháº¿ nÃ o? Chia sáº» cáº£m nháº­n vá» Ä‘á»™ tÆ°Æ¡i, mÃ¹i vá»‹..."
          aria-label={`Nháº­n xÃ©t vá» ${product.name}`}
          value={review?.comment ?? ""}
          onChange={(event) => onChange({ comment: event.target.value })}
        />

        <div className="upload-area">
          <label className="upload-box" title="ThÃªm áº£nh tá»« thiáº¿t bá»‹">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              aria-label="Táº£i áº£nh lÃªn"
              onChange={(event) => {
                onAddImages(event.target.files);
                event.target.value = "";
              }}
            />
            <ImageIcon />
            <span>ThÃªm áº£nh</span>
          </label>

          <div className="preview-thumbnails" aria-label="áº¢nh Ä‘Ã£ chá»n">
            {review?.images.map((image) => (
              <div className="preview-thumb" key={image.id}>
                <img src={image.url} alt={image.file.name} />
                <button
                  className="remove-btn"
                  type="button"
                  aria-label={`XÃ³a áº£nh ${image.file.name}`}
                  onClick={() => onRemoveImage(image.id)}
                >
                  Ã—
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
          ÄÃ¡nh giÃ¡ áº©n danh
          <small>TÃªn cá»§a báº¡n sáº½ Ä‘Æ°á»£c áº©n Ä‘i trong pháº§n nháº­n xÃ©t.</small>
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
            ? "ÄÃ£ gá»­i Ä‘Ã¡nh giÃ¡ âœ“"
            : submitting
              ? "Äang gá»­i..."
              : "Gá»­i Ä‘Ã¡nh giÃ¡ táº¥t cáº£"}
        </span>
        <SendIcon />
      </button>
    </div>
  );
}

function LoadingReview() {
  return (
    <>
      <section className="order-summary" aria-label="Äang táº£i thÃ´ng tin Ä‘Æ¡n hÃ ng">
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
          <Logo size={24} ariaLabel="Chá»£ Tá»›i Cá»­a" />
          <p className="footer-tagline">
            Â© 2024 Chá»£ Tá»›i Cá»­a. TÆ°Æ¡i ngon tá»« nÃ´ng tráº¡i
            <br />
            Ä‘áº¿n táº­n cá»­a nhÃ .
          </p>
        </div>

        <FooterColumn title="KhÃ¡m phÃ¡" links={["Vá» chÃºng tÃ´i", "Tuyá»ƒn dá»¥ng"]} />
        <FooterColumn title="Há»— trá»£" links={["LiÃªn há»‡ há»— trá»£", "Trung tÃ¢m giÃºp Ä‘á»¡"]} />
        <FooterColumn title="PhÃ¡p lÃ½" links={["ChÃ­nh sÃ¡ch báº£o máº­t", "Äiá»u khoáº£n dá»‹ch vá»¥"]} />
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
      <span className="logo-text">Chá»£ Tá»›i Cá»­a</span>
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

