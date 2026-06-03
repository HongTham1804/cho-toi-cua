const API_BASE_URL = "http://localhost:8000/api";
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

const getAuthToken = () => window.localStorage.getItem("auth_token");

const authHeaders = () => {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function getOrderIdFromUrl() {
  return new URLSearchParams(window.location.search).get("orderId");
}

export async function fetchOrderTracking(orderId) {
  if (!orderId) {
    throw new Error("Không tìm thấy mã đơn hàng để theo dõi.");
  }

  const normalizedOrderId = String(orderId).replace(/^ORD-/i, "").replace(/^0+/, "") || orderId;
  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(normalizedOrderId)}/tracking`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể tải dữ liệu theo dõi đơn hàng.");
  }

  return normalizeTrackingPayload(payload.data);
}

export async function fetchOsrmRoute(origin, destination) {
  if (!isPoint(origin) || !isPoint(destination)) {
    return null;
  }

  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE_URL}/${coordinates}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.code !== "Ok" || !payload.routes?.length) {
    return null;
  }

  const route = payload.routes[0];

  return {
    points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}

export async function markOrderArrived(orderId) {
  if (!orderId) {
    throw new Error("Không tìm thấy mã đơn hàng.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/arrived`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders(),
    },
    body: "{}",
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể cập nhật đơn hàng đã đến nơi.");
  }

  return payload.data;
}

function normalizeTrackingPayload(data) {
  const origin = normalizePoint(data?.route?.origin);
  const destination = normalizePoint(data?.route?.destination);
  const current = normalizePoint(data?.route?.current) || origin;
  const shipmentProgress = Number(data?.shipment?.progress ?? 0);

  return {
    order: data?.order ?? null,
    store: data?.store ?? null,
    customer: data?.customer ?? null,
    shipper: data?.shipper ?? null,
    shipment: data?.shipment ?? null,
    items: Array.isArray(data?.items) ? data.items : [],
    canTrack: Boolean(data?.can_track && origin && destination),
    origin,
    destination,
    current,
    progress: Number.isFinite(shipmentProgress) ? shipmentProgress : 0,
    steps: Array.isArray(data?.timeline) ? data.timeline : [],
  };
}

function normalizePoint(point) {
  const lat = Number(point?.lat);
  const lng = Number(point?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    lat,
    lng,
    label: point?.label || "",
    address: point?.address || "",
  };
}

function isPoint(point) {
  return Number.isFinite(Number(point?.lat)) && Number.isFinite(Number(point?.lng));
}
