const API_BASE_URL = "http://localhost:8000/api";

function formatOrderDate(value) {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function buildProductSummary(details = []) {
  if (!details.length) return "Chưa có sản phẩm";

  const firstItems = details.slice(0, 2).map((item) => {
    return `Sản phẩm #${item.product_id} x${item.quantity}`;
  });

  const remainingCount = details.length - firstItems.length;
  const suffix = remainingCount > 0 ? ` (+${remainingCount} sản phẩm)` : "";

  return `${firstItems.join(", ")}${suffix}`;
}

function normalizeOrder(order) {
  const details = Array.isArray(order.details) ? order.details : [];

  return {
    id: order.id,
    storeId: order.store_id,
    storeName: `Siêu thị #${order.store_id}`,
    date: formatOrderDate(order.created_at),
    rawDate: order.created_at,
    products: buildProductSummary(details),
    details,
    total: Number(order.total_amount ?? 0),
    subtotal: Number(order.subtotal ?? 0),
    shippingFee: Number(order.shipping_fee ?? 0),
    shippingAddress: order.shipping_address ?? "",
    paymentMethod: order.payment_method ?? "",
    status: order.status ?? "pending",
  };
}

export async function fetchCurrentUser() {
  return {
    name: "Khách hàng",
    tag: "Thành viên",
  };
}

export async function fetchOrders(status = "all") {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/orders${query ? `?${query}` : ""}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Không thể tải danh sách đơn hàng.");
  }

  const result = await response.json();
  const orders = Array.isArray(result.data?.data) ? result.data.data : [];

  return orders.map(normalizeOrder);
}

export async function fetchOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết đơn hàng.");
  }

  const result = await response.json();

  return normalizeOrder(result.data);
}

export async function reorder(orderId) {
  return {
    success: true,
    message: `Đã sẵn sàng mua lại đơn #${orderId}.`,
  };
}
