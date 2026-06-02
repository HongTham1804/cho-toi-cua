import "./tracking.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { fetchOrderTracking, fetchOsrmRoute, getOrderIdFromUrl, markOrderArrived } from "./trackingApi.js";

const DEFAULT_CENTER = [10.856496093453933, 106.77405206796195];
const SHIPPER_SIMULATION_MS = 90000;
const SHIPPER_PROGRESS_CAP = 98;

const storeIcon = L.divIcon({
  className: "tracking-marker tracking-marker-store",
  html: '<i class="fa-solid fa-store"></i>',
  iconSize: [34, 34],
  iconAnchor: [17, 30],
  popupAnchor: [0, -26],
});

const homeIcon = L.divIcon({
  className: "tracking-marker tracking-marker-home",
  html: '<i class="fa-solid fa-house"></i>',
  iconSize: [34, 34],
  iconAnchor: [17, 30],
  popupAnchor: [0, -26],
});

const shipperIcon = L.divIcon({
  className: "tracking-marker tracking-marker-shipper",
  html: '<i class="fa-solid fa-motorcycle"></i>',
  iconSize: [38, 38],
  iconAnchor: [19, 32],
  popupAnchor: [0, -28],
});

function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "-";
  }

  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} phút`;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters) || meters <= 0) {
    return "";
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

function formatTimelineTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pointToLatLng(point) {
  return [point.lat, point.lng];
}

function clampProgress(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numeric));
}

function getRoutePosition(points, progress) {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    return points[0];
  }

  const targetProgress = clampProgress(progress);
  const segmentLengths = [];
  let totalLength = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const length = Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    segmentLengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) {
    return points[0];
  }

  let targetDistance = totalLength * (targetProgress / 100);

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];

    if (targetDistance <= length || index === segmentLengths.length - 1) {
      const previous = points[index];
      const current = points[index + 1];
      const ratio = length === 0 ? 0 : targetDistance / length;

      return [
        previous[0] + (current[0] - previous[0]) * ratio,
        previous[1] + (current[1] - previous[1]) * ratio,
      ];
    }

    targetDistance -= length;
  }

  return points[points.length - 1];
}

export default function Tracking() {
  const [tracking, setTracking] = useState(null);
  const [route, setRoute] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState("");
  const arrivedSyncedRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadTracking() {
      try {
        const orderId = getOrderIdFromUrl();
        const data = await fetchOrderTracking(orderId);

        if (!active) return;
        setTracking(data);
        setSimulatedProgress(Math.min(SHIPPER_PROGRESS_CAP, clampProgress(data.progress)));

        if (data.origin && data.destination) {
          setRouteLoading(true);
          const osrmRoute = await fetchOsrmRoute(data.origin, data.destination);
          if (!active) return;
          setRoute(osrmRoute || {
            points: [pointToLatLng(data.origin), pointToLatLng(data.destination)],
            distanceMeters: null,
            durationSeconds: null,
            fallback: true,
          });
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Không thể tải trạng thái đơn hàng. Vui lòng thử lại.");
      } finally {
        if (active) {
          setLoading(false);
          setRouteLoading(false);
        }
      }
    }

    loadTracking();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!tracking || tracking.order?.status !== "shipping" || !route?.points?.length) {
      return undefined;
    }

    const startProgress = Math.min(SHIPPER_PROGRESS_CAP, clampProgress(tracking.progress));
    const startedAt = performance.now();

    setSimulatedProgress((current) => Math.max(current, startProgress));

    const timerId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = startProgress + (elapsed / SHIPPER_SIMULATION_MS) * 100;
      const cappedProgress = Math.min(SHIPPER_PROGRESS_CAP, nextProgress);
      setSimulatedProgress(cappedProgress);

      if (cappedProgress >= SHIPPER_PROGRESS_CAP) {
        window.clearInterval(timerId);
      }
    }, 500);

    return () => window.clearInterval(timerId);
  }, [route?.points, tracking]);

  useEffect(() => {
    if (
      arrivedSyncedRef.current ||
      !tracking?.order?.id ||
      tracking.order?.status !== "shipping" ||
      simulatedProgress < SHIPPER_PROGRESS_CAP
    ) {
      return undefined;
    }

    arrivedSyncedRef.current = true;

    markOrderArrived(tracking.order.id)
      .then(() => {
        setTracking((current) => {
          if (!current) return current;

          return {
            ...current,
            shipment: {
              ...(current.shipment || {}),
              status: "arrived",
              progress: 100,
            },
            progress: 100,
          };
        });
        setSimulatedProgress(100);
      })
      .catch(() => {
        arrivedSyncedRef.current = false;
      });

    return undefined;
  }, [simulatedProgress, tracking]);

  const etaText = useMemo(() => formatEta(route?.durationSeconds), [route?.durationSeconds]);
  const distanceText = useMemo(() => formatDistance(route?.distanceMeters), [route?.distanceMeters]);
  const shipperPosition = useMemo(() => {
    const routePosition = getRoutePosition(route?.points, simulatedProgress);

    if (routePosition) {
      return {
        lat: routePosition[0],
        lng: routePosition[1],
      };
    }

    return tracking?.current ?? null;
  }, [route?.points, simulatedProgress, tracking?.current]);

  return (
    <div className="tracking-page">
      <main className="tracking-body" role="main">
        <section className="col-left" aria-label="Bản đồ và lộ trình">
          <EtaBanner eta={etaText} loading={loading || routeLoading} />
          <MapPanel
            tracking={tracking}
            route={route}
            loading={loading}
            routeLoading={routeLoading}
            distanceText={distanceText}
            etaText={etaText}
            shipperPosition={shipperPosition}
            simulatedProgress={simulatedProgress}
          />
          <RouteStrip tracking={tracking} loading={loading} />
        </section>

        <aside className="col-right" aria-label="Thông tin shipper và trạng thái">
          <ShipperCard shipper={tracking?.shipper} loading={loading} />
          <TimelinePanel steps={tracking?.steps ?? []} loading={loading} error={error} />
        </aside>
      </main>
    </div>
  );
}

function EtaBanner({ eta, loading }) {
  return (
    <div className="eta-banner">
      <p className="eta-label">Dự kiến giao</p>
      <p className={`eta-time${loading ? " skeleton" : ""}`}>{loading ? "" : eta}</p>
    </div>
  );
}

function MapPanel({
  tracking,
  route,
  loading,
  routeLoading,
  distanceText,
  etaText,
  shipperPosition,
  simulatedProgress,
}) {
  const hasMap = tracking?.origin && tracking?.destination;
  const routePoints = route?.points?.length ? route.points : [];
  const isArrived = tracking?.shipment?.status === "arrived" || clampProgress(simulatedProgress) >= 100;
  const progressLabel = isArrived ? 100 : Math.round(Math.min(SHIPPER_PROGRESS_CAP, clampProgress(simulatedProgress)));

  return (
    <div className="map-wrapper tracking-map-wrapper" aria-label="Bản đồ lộ trình giao hàng">
      {loading ? (
        <div className="tracking-map-loading">Đang tải bản đồ...</div>
      ) : hasMap ? (
        <MapContainer
          center={pointToLatLng(tracking.origin)}
          zoom={14}
          scrollWheelZoom
          className="tracking-leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapBounds tracking={tracking} routePoints={routePoints} />
          {routePoints.length > 0 && (
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: route?.fallback ? "#0f7f58" : "#087348",
                weight: 5,
                opacity: 0.86,
                dashArray: route?.fallback ? "10 8" : undefined,
              }}
            />
          )}
          <Marker position={pointToLatLng(tracking.origin)} icon={storeIcon}>
            <Popup>
              <strong>{tracking.origin.label || "Siêu thị"}</strong>
              <br />
              {tracking.origin.address}
            </Popup>
          </Marker>
          <Marker position={pointToLatLng(tracking.destination)} icon={homeIcon}>
            <Popup>
              <strong>Vị trí nhận hàng</strong>
              <br />
              {tracking.destination.address}
            </Popup>
          </Marker>
          {shipperPosition && (
            <Marker position={pointToLatLng(shipperPosition)} icon={shipperIcon}>
              <Popup>
                {tracking.shipper?.name || "Shipper"}
                <br />
                {isArrived ? "Đã đến nơi" : `Đang giao: ${progressLabel}%`}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div className="tracking-map-empty">
          Đơn hàng chưa có tọa độ nhận hàng nên chưa thể hiển thị bản đồ.
        </div>
      )}

      {hasMap && (
        <>
          <div className="map-label map-label-store">
            <span>{tracking.origin.label || "Siêu thị"}</span>
          </div>
          <div className="map-label map-label-home">
            <span>Nhà của bạn</span>
          </div>
        </>
      )}

      <div className="map-distance-badge">
        <i className="fa-regular fa-clock" aria-hidden="true" />
        <span>
          {routeLoading
            ? "Đang tính đường..."
            : [distanceText, etaText && etaText !== "-" ? etaText : ""].filter(Boolean).join(" - ") || "Đang chờ lộ trình"}
        </span>
      </div>

      {hasMap && (
        <div className="tracking-progress-card">
          <div className="tracking-progress-row">
            <span>Shipper đang di chuyển</span>
            <strong>{progressLabel}%</strong>
          </div>
          <div className="tracking-progress-bar" aria-hidden="true">
            <span style={{ width: `${progressLabel}%` }} />
          </div>
          {isArrived && (
            <a className="tracking-arrived-link" href={`/order-detail/${tracking.order.id}`}>
              Xác nhận đã nhận hàng
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function MapBounds({ tracking, routePoints }) {
  const map = useMap();

  useEffect(() => {
    const points = routePoints.length > 0
      ? routePoints
      : [pointToLatLng(tracking.origin), pointToLatLng(tracking.destination)];

    if (points.length < 2) {
      map.setView(points[0] || DEFAULT_CENTER, 14);
      return;
    }

    map.fitBounds(points, {
      padding: [44, 44],
      maxZoom: 16,
    });
  }, [map, routePoints, tracking.origin, tracking.destination]);

  return null;
}

function RouteStrip({ tracking, loading }) {
  return (
    <div className="route-strip">
      <div className="route-point origin">
        <span className="route-dot dot-green"></span>
        <div>
          <p className="route-label">Lấy hàng tại</p>
          <p className={`route-addr${loading ? " skeleton" : ""}`}>{loading ? "" : tracking?.origin?.label ?? "-"}</p>
        </div>
      </div>
      <div className="route-connector"></div>
      <div className="route-point destination">
        <span className="route-dot dot-home"></span>
        <div>
          <p className="route-label">Giao đến</p>
          <p className={`route-addr${loading ? " skeleton" : ""}`}>
            {loading ? "" : tracking?.destination?.address ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShipperCard({ shipper, loading }) {
  return (
    <div className="shipper-card">
      <img
        className="shipper-avatar"
        src="/assets/shipper.jpg"
        alt={shipper?.name ? `Ảnh của shipper ${shipper.name}` : "Ảnh shipper"}
      />
      <div className="shipper-info">
        <p className="shipper-label">Shipper của bạn</p>
        <p className={`shipper-name${loading ? " skeleton" : ""}`}>{loading ? "" : shipper?.name ?? "-"}</p>
        <p className="shipper-plate">
          {loading ? "Đang tải" : `Biển số: ${shipper?.license_plate ?? "-"}`}
        </p>
      </div>
      <a className="btn-call" href={`tel:${shipper?.phone ?? "0900000000"}`} aria-label="Gọi cho shipper">
        <i className="fa-solid fa-phone" aria-hidden="true" />
      </a>
    </div>
  );
}

function TimelinePanel({ steps, loading, error }) {
  return (
    <div className="timeline-section">
      <h3 className="section-title">Trạng thái giao hàng</h3>
      <ol className="timeline" aria-live="polite">
        {error ? (
          <li className="tracking-error">{error}</li>
        ) : loading ? (
          <LoadingTimeline />
        ) : steps.length > 0 ? (
          steps.map((step) => <TimelineItem key={step.key} step={step} />)
        ) : (
          <li className="tracking-error">Chưa có thông tin trạng thái.</li>
        )}
      </ol>
    </div>
  );
}

function TimelineItem({ step }) {
  const time = formatTimelineTime(step.time);

  return (
    <li className={`timeline-item${step.done ? " done" : ""}${step.active ? " active" : ""}`}>
      <div className="timeline-dot" aria-hidden="true"></div>
      <div className="timeline-content">
        <h4>{step.title}</h4>
        <p>{time ? `${time} - ` : ""}{step.description}</p>
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
