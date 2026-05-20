import './tracking.css';
import { useEffect, useMemo, useState } from "react";
import { fetchOrderTracking, getOrderIdFromUrl } from "./trackingApi.js";

function calcEtaMinutes(etaTime) {
  if (!etaTime) return "?";

  try {
    const now = new Date();
    const [hours, minutes] = etaTime.split(":").map(Number);
    const eta = new Date(now);
    eta.setHours(hours, minutes, 0, 0);
    const diff = Math.round((eta - now) / 60000);
    return diff > 0 ? diff : "< 5";
  } catch {
    return "?";
  }
}

export default function App() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTracking() {
      try {
        const orderId = getOrderIdFromUrl() ?? "CTC-982374";
        const data = await fetchOrderTracking(orderId);
        if (!active) return;
        setOrder(data);
      } catch (err) {
        if (!active) return;
        setError(err.message || "KhÃ´ng thá»ƒ táº£i tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng. Vui lÃ²ng thá»­ láº¡i.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTracking();
    return () => {
      active = false;
    };
  }, []);

  const etaMinutes = useMemo(() => calcEtaMinutes(order?.eta), [order?.eta]);

  function handleBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  }

  return (
    <div className="tracking-page">
      <Header order={order} loading={loading} error={error} onBack={handleBack} />

      <main className="tracking-body" role="main">
        <section className="col-left" aria-label="Báº£n Ä‘á»“ vÃ  lá»™ trÃ¬nh">
          <EtaBanner eta={order?.eta} loading={loading} />
          <MapPanel etaMinutes={etaMinutes} />
          <RouteStrip destination={order?.customer?.address} loading={loading} />
        </section>

        <aside className="col-right" aria-label="ThÃ´ng tin shipper vÃ  tráº¡ng thÃ¡i">
          <ShipperCard shipper={order?.shipper} loading={loading} />
          <TimelinePanel steps={order?.steps ?? []} loading={loading} error={error} />
        </aside>
      </main>
    </div>
  );
}

function Header({ order, loading, error, onBack }) {
  return (
    <header className="tracking-header" role="banner">
      <div className="header-inner">
        <button className="btn-back" type="button" aria-label="Quay láº¡i" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Theo dÃµi Ä‘Æ¡n hÃ ng</span>
        </button>

        <div className="header-status-group">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>{error ? "Lá»—i táº£i dá»¯ liá»‡u" : order?.status ?? "Äang táº£i"}</span>
          </div>
          <div className="order-id-chip">
            <span>ÄÆ¡n hÃ ng #</span>
            <span>{loading ? "..." : order?.orderId ?? "-"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function EtaBanner({ eta, loading }) {
  return (
    <div className="eta-banner">
      <p className="eta-label">Dá»± kiáº¿n giao</p>
      <p className={`eta-time${loading ? " skeleton" : ""}`}>{loading ? "" : eta ?? "-"}</p>
    </div>
  );
}

function MapPanel({ etaMinutes }) {
  return (
    <div className="map-wrapper" role="img" aria-label="Báº£n Ä‘á»“ lá»™ trÃ¬nh giao hÃ ng">
      <svg className="mock-map" viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="500" height="380" fill="#e8ecef" />
        <line x1="0" y1="70" x2="500" y2="70" stroke="#fff" strokeWidth="8" />
        <line x1="0" y1="140" x2="500" y2="140" stroke="#fff" strokeWidth="8" />
        <line x1="0" y1="210" x2="500" y2="210" stroke="#fff" strokeWidth="8" />
        <line x1="0" y1="280" x2="500" y2="280" stroke="#fff" strokeWidth="8" />
        <line x1="0" y1="330" x2="500" y2="330" stroke="#fff" strokeWidth="5" />
        <line x1="80" y1="0" x2="80" y2="380" stroke="#fff" strokeWidth="8" />
        <line x1="180" y1="0" x2="180" y2="380" stroke="#fff" strokeWidth="8" />
        <line x1="300" y1="0" x2="300" y2="380" stroke="#fff" strokeWidth="8" />
        <line x1="400" y1="0" x2="400" y2="380" stroke="#fff" strokeWidth="5" />

        <rect x="90" y="80" width="80" height="50" rx="4" fill="#c8e6c9" opacity=".8" />
        <rect x="190" y="150" width="100" height="55" rx="4" fill="#c8e6c9" opacity=".7" />
        <rect x="90" y="220" width="60" height="55" rx="4" fill="#c8e6c9" opacity=".6" />
        <rect x="310" y="80" width="80" height="120" rx="4" fill="#c8e6c9" opacity=".5" />

        <polyline points="130,120 130,210 300,210 300,300 380,300" fill="none" stroke="#1a7a4a" strokeWidth="3" strokeDasharray="8 5" strokeLinecap="round" opacity=".9" />

        <g transform="translate(100,110)" className="map-pin">
          <rect x="-36" y="-22" width="72" height="24" rx="12" fill="#1a7a4a" />
          <text x="0" y="-5" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="600">SiÃªu thá»‹ Tá»›i Cá»­a</text>
          <polygon points="0,4 -6,-4 6,-4" fill="#1a7a4a" transform="translate(0,14)" />
        </g>

        <g transform="translate(300,210)" className="map-pin shipper-pin">
          <circle cx="0" cy="0" r="20" fill="#1a7a4a" opacity=".15" />
          <circle cx="0" cy="0" r="14" fill="#1a7a4a" />
          <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="13">ðŸ›µ</text>
        </g>

        <g transform="translate(380,300)" className="map-pin">
          <rect x="-44" y="-22" width="88" height="24" rx="12" fill="#fff" stroke="#1a7a4a" strokeWidth="1.5" />
          <text x="0" y="-5" textAnchor="middle" fill="#1a7a4a" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="600">NhÃ  cá»§a báº¡n</text>
          <polygon points="0,4 -6,-4 6,-4" fill="#1a7a4a" transform="translate(0,14)" />
        </g>
      </svg>

      <div className="map-distance-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>~{etaMinutes} phÃºt</span>
      </div>
    </div>
  );
}

function RouteStrip({ destination, loading }) {
  return (
    <div className="route-strip">
      <div className="route-point origin">
        <span className="route-dot dot-green"></span>
        <div>
          <p className="route-label">Láº¥y hÃ ng táº¡i</p>
          <p className="route-addr">SiÃªu thá»‹ Tá»›i Cá»­a</p>
        </div>
      </div>
      <div className="route-connector"></div>
      <div className="route-point destination">
        <span className="route-dot dot-home"></span>
        <div>
          <p className="route-label">Giao Ä‘áº¿n</p>
          <p className={`route-addr${loading ? " skeleton" : ""}`}>{loading ? "" : destination ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}

function ShipperCard({ shipper, loading }) {
  return (
    <div className="shipper-card">
      <img className="shipper-avatar" src={shipper?.avatar ?? "/assets/shipper.jpg"} alt={shipper?.name ? `áº¢nh cá»§a shipper ${shipper.name}` : "áº¢nh shipper"} />
      <div className="shipper-info">
        <p className="shipper-label">Shipper cá»§a báº¡n</p>
        <p className={`shipper-name${loading ? " skeleton" : ""}`}>{loading ? "" : shipper?.name ?? "-"}</p>
        <p className="shipper-plate">{loading ? "Äang táº£i" : `Biá»ƒn sá»‘: ${shipper?.plate ?? "-"}`}</p>
      </div>
      <a className="btn-call" href={`tel:${shipper?.phone ?? "0900000000"}`} aria-label="Gá»i cho shipper">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      </a>
    </div>
  );
}

function TimelinePanel({ steps, loading, error }) {
  return (
    <div className="timeline-section">
      <h3 className="section-title">Tráº¡ng thÃ¡i giao hÃ ng</h3>
      <ol className="timeline" aria-live="polite">
        {error ? (
          <li style={{ padding: "1rem", color: "#dc2626", fontSize: ".85rem", fontWeight: 500 }}>{error}</li>
        ) : loading ? (
          <LoadingTimeline />
        ) : (
          steps.map((step) => <TimelineItem key={step.key} step={step} />)
        )}
      </ol>
    </div>
  );
}

function TimelineItem({ step }) {
  return (
    <li className={`timeline-item${step.done ? " done" : ""}${step.active ? " active" : ""}`}>
      <div className="timeline-dot" aria-hidden="true"></div>
      <div className="timeline-content">
        <h4>{step.title}</h4>
        <p>{step.time ? `${step.time} Â· ` : ""}{step.description}</p>
      </div>
    </li>
  );
}

function LoadingTimeline() {
  return [1, 2, 3, 4].map((item) => (
    <li className="timeline-item" key={item}>
      <div className="timeline-dot" aria-hidden="true"></div>
      <div className="timeline-content skeleton" style={{ height: 40, borderRadius: 8, width: "90%" }}></div>
    </li>
  ));
}

