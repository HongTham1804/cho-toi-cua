const API_BASE_URL = "http://localhost:8000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");
const CACHE_PREFIX = "ctc-api-cache:";

export function getOrderIdFromUrl() {
  return new URLSearchParams(window.location.search).get("orderId");
}

function normalizeOrderId(orderId) {
  if (!orderId) return "";

  const raw = String(orderId).trim();
  const ctcMatch = raw.match(/CTC-(\d+)/i);
  const ordMatch = raw.match(/ORD-(\d+)/i);

  if (ctcMatch) return String(Number(ctcMatch[1]));
  if (ordMatch) return String(Number(ordMatch[1]));

  return raw;
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;

  return `${API_ORIGIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

function formatReceivedAt(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function fetchReviewOrder(orderId) {
  const normalizedId = normalizeOrderId(orderId);

  if (!normalizedId) {
    throw new Error("Không tìm thấy mã đơn hàng để đánh giá.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(normalizedId)}/review`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể tải đơn hàng để đánh giá.");
  }

  const data = payload.data || {};

  return {
    orderId: data.code || `CTC-${String(data.order_id || normalizedId).padStart(6, "0")}`,
    rawOrderId: String(data.order_id || normalizedId),
    status: data.status || "Đã hoàn thành",
    receivedAt: formatReceivedAt(data.received_at),
    customerName: data.customer_name || "Khách hàng",
    address: data.address || "",
    products: (data.products || []).map((product) => ({
      id: String(product.product_id),
      detailId: String(product.detail_id),
      name: product.name,
      origin: product.category || product.store_name || "Sản phẩm trong đơn",
      image: resolveImageUrl(product.image_url),
      quantity: Number(product.quantity || 1),
    })),
  };
}

export async function postReviews(orderId, anonymous, reviews) {
  const normalizedId = normalizeOrderId(orderId);

  if (!normalizedId) {
    throw new Error("Không tìm thấy mã đơn hàng để gửi đánh giá.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(normalizedId)}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anonymous,
      reviews,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Gửi đánh giá thất bại. Vui lòng thử lại.");
  }

  clearProductCache();

  return payload;
}

function clearProductCache() {
  try {
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX) && (key.includes("product:") || key.includes("products:")))
      .forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Cache chỉ để tăng tốc, lỗi storage không ảnh hưởng gửi đánh giá.
  }
}
