import { addCartItem } from "../../../services/cartStorage";
import { mapApiProduct } from "../../../services/productApi";

const API_BASE_URL = "http://localhost:8000/api";

const normalizePageItems = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const formatOrderDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatProducts = (details = []) => {
  const names = details
    .filter((detail) => detail.product?.name && detail.product?.image_url)
    .map((detail) => {
    const productName = detail.product.name;
    return `${productName}${Number(detail.quantity) > 1 ? ` x${detail.quantity}` : ""}`;
  });

  if (names.length <= 2) return names.join(", ");

  return `${names.slice(0, 2).join(", ")} (+${names.length - 2} sản phẩm)`;
};

const mapOrder = (order) => ({
  id: String(order.id),
  storeName: order.store?.name || "Siêu thị",
  date: formatOrderDate(order.created_at),
  products: formatProducts(order.details),
  validProductCount: (order.details || []).filter((detail) => detail.product?.name && detail.product?.image_url).length,
  total: Number(order.total_amount || 0),
  status: order.status || "pending",
});

export async function fetchOrders(status = "all") {
  const params = new URLSearchParams({ per_page: "100" });

  if (status && status !== "all") {
    params.set("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/orders?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Không thể tải danh sách đơn hàng.");
  }

  const payload = await response.json();
  return normalizePageItems(payload)
    .map(mapOrder)
    .filter((order) => order.validProductCount > 0);
}

export async function reorder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

  if (!response.ok) {
    throw new Error("Không thể lấy chi tiết đơn hàng.");
  }

  const payload = await response.json();
  const details = payload?.data?.details || [];

  details.forEach((detail) => {
    if (!detail.product) return;

    const product = mapApiProduct({
      ...detail.product,
      store: payload.data.store,
    });

    for (let index = 0; index < Number(detail.quantity || 1); index += 1) {
      addCartItem(product);
    }
  });

  return {
    success: true,
    message: `Đã thêm lại sản phẩm từ đơn #${orderId} vào giỏ hàng!`,
  };
}
