import { useEffect, useMemo, useState } from "react";
import CustomerHeader from "../../components/CustomerHeader/CustomerHeader";
import Footer from "../../components/Footer/Footer";
import "./notifications.css";
import {
  fetchNotifications,
  markAllRead,
  markOneRead,
} from "./api/notifications-api";

const FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
  { value: "delivery", label: "Đơn hàng" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "voucher", label: "Voucher" },
];

function App() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }
    return notifications.filter((item) => item.type === activeFilter);
  }, [activeFilter, notifications]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  }

  async function handleMarkOneRead(id) {
    const oldNotifications = notifications;

    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );

    try {
      await markOneRead(id);
    } catch {
      setNotifications(oldNotifications);
      showToast("Không thể cập nhật thông báo.");
    }
  }

  async function handleMarkAllRead() {
    const oldNotifications = notifications;

    if (unreadCount === 0) {
      showToast("Tất cả thông báo đã được đọc.");
      return;
    }

    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    );

    try {
      await markAllRead();
      showToast("Đã đánh dấu tất cả là đã đọc.");
    } catch {
      setNotifications(oldNotifications);
      showToast("Không thể cập nhật. Vui lòng thử lại.");
    }
  }

  return (
    <div className="page notification-page">
      <CustomerHeader />

      <main className="main" role="main">
        <div className="notification-header">
          <h1>Thông báo</h1>
          <button
            className="mark-read-btn"
            type="button"
            onClick={handleMarkAllRead}
          >
            Đánh dấu tất cả là đã đọc
          </button>
        </div>

        <div className="filter-tabs" role="tablist" aria-label="Lọc thông báo">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`tab-btn ${
                activeFilter === filter.value ? "active" : ""
              }`}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingList />
        ) : filteredNotifications.length > 0 ? (
          <section
            className="notification-list"
            aria-live="polite"
            aria-label="Danh sách thông báo"
          >
            {filteredNotifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onMarkRead={handleMarkOneRead}
              />
            ))}
          </section>
        ) : (
          <EmptyState />
        )}
      </main>

      <Footer />

      {toast && (
        <div className="toast toast-success show" role="alert">
          {toast}
        </div>
      )}
    </div>
  );
}

function NotificationItem({ item, onMarkRead }) {
  return (
    <article
      className={`notification-item ${item.isRead ? "read" : "unread"}`}
      aria-label={`${item.title}${item.isRead ? "" : " chưa đọc"}`}
    >
      <div className={`notification-icon ${item.type}`} aria-hidden="true">
        <NotificationTypeIcon type={item.type} />
      </div>

      <a className="notification-content" href={item.link}>
        <div className="notification-top">
          <h3>{item.title}</h3>
          <time className="notification-time">{item.time}</time>
        </div>
        <p>{item.message}</p>
      </a>

      {!item.isRead && (
        <>
          <div className="item-actions">
            <button
              className="btn-mark-read"
              type="button"
              onClick={() => onMarkRead(item.id)}
            >
              Đánh dấu đã đọc
            </button>
          </div>
          <span className="unread-dot" aria-hidden="true" />
        </>
      )}
    </article>
  );
}

function LoadingList() {
  return (
    <section className="notification-list">
      {[1, 2, 3].map((item) => (
        <article key={item} className="notification-item read">
          <div className="skeleton" style={{ width: 36, height: 36 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 14, width: "55%" }} />
            <div className="skeleton" style={{ height: 12, width: "80%", marginTop: 8 }} />
          </div>
        </article>
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔔</div>
      <p className="empty-title">Không có thông báo nào</p>
      <p className="empty-sub">Bạn đã xem hết thông báo rồi.</p>
    </div>
  );
}

function NotificationTypeIcon({ type }) {
  if (type === "delivery") return <TruckIcon />;
  if (type === "promotion") return <BoltIcon />;
  if (type === "voucher") return <TagIcon />;
  if (type === "success") return <CheckCircleIcon />;
  return <InfoIcon />;
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 17h4V5H2v12h3" />
      <path d="M14 8h4l4 4v5h-3" />
      <circle cx="7.5" cy="17.5" r="2" />
      <circle cx="17.5" cy="17.5" r="2" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.6 13.1 13.1 20.6a2 2 0 0 1-2.8 0L3 13.3V3h10.3l7.3 7.3a2 2 0 0 1 0 2.8Z" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default App;
