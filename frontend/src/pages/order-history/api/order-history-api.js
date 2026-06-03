import { addCartItem } from "../../../services/cartStorage";
import { getAuthToken } from "../../../services/authApi";
import { mapApiProduct } from "../../../services/productApi";

const API_BASE_URL = "http://localhost:8000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const authHeaders = () => {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizePageItems = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_ORIGIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
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

const mapOrderItem = (detail) => {
  const product = detail.product || {};
  const unitPrice = Number(detail.unit_price || product.price || 0);
  const quantity = Number(detail.quantity || 1);

  return {
    id: String(detail.id || product.id),
    productId: String(product.id || detail.product_id),
    name: product.name || "Sản phẩm",
    category: product.category?.name || "",
    image: resolveImageUrl(product.image_url),
    quantity,
    unitPrice,
    originalPrice: Number(detail.original_price || product.original_price || product.price || 0),
    lineTotal: unitPrice * quantity,
  };
};

const formatProducts = (items = []) => {
  const names = items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`);

  if (names.length <= 2) return names.join(", ");

  return `${names.slice(0, 2).join(", ")} (+${names.length - 2} sản phẩm)`;
};

const PAYMENT_METHOD_LABELS = {
  cod: "Thanh toán khi nhận hàng",
  payos: "Chuyển khoản PayOS",
  bank_transfer: "Chuyển khoản PayOS",
  wallet: "Ví Chợ Tới Cửa",
};

export const mapOrder = (order) => {
  const items = (order.details || [])
    .filter((detail) => detail.product?.name)
    .map(mapOrderItem);

  return {
    id: String(order.id),
    customerId: Number(order.customer_id || order.customer?.id || 0),
    storeId: Number(order.store_id),
    storeName: order.store?.name || "Siêu thị",
    customerName: order.customer?.name || "Khách hàng",
    customerPhone: order.customer?.phone || "",
    shippingAddress: order.shipping_address || order.customer?.address || "",
    paymentMethod: PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method || "Thanh toán khi nhận hàng",
    paymentStatus: order.payment_status || "unpaid",
    paidAt: order.paid_at,
    paymentReference: order.payment_reference,
    note: order.note || "",
    shipper: order.shipper || null,
    shipment: order.shipment || null,
    date: formatOrderDate(order.created_at),
    createdAt: order.created_at,
    products: formatProducts(items),
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    total: Number(order.total_amount || 0),
    subtotal: Number(order.subtotal || 0),
    shippingFee: Number(order.shipping_fee || 0),
    status: order.status || "pending",
  };
};

export async function fetchOrders(status = "all") {
  const params = new URLSearchParams({ per_page: "100" });

  if (status && status !== "all") {
    params.set("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/orders?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Không thể tải danh sách đơn hàng.");
  }

  const payload = await response.json();
  return normalizePageItems(payload)
    .map(mapOrder)
    .filter((order) => order.items.length > 0);
}

export async function fetchOrderById(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Không thể lấy chi tiết đơn hàng.");
  }

  const payload = await response.json();
  return mapOrder(payload.data);
}

export async function cancelOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: "{}",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể hủy đơn hàng.");
  }

  return mapOrder(payload.data);
}

export async function completeOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: "{}",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Không thể xác nhận đã nhận hàng.");
  }

  return mapOrder(payload.data);
}

export async function reorder(orderId) {
  const order = await fetchOrderById(orderId);

  order.items.forEach((item) => {
    const apiProduct = {
      id: item.productId,
      store_id: order.storeId,
      name: item.name,
      price: item.unitPrice,
      original_price: item.originalPrice,
      image_url: item.image,
      category: { name: item.category },
      category_id: 0,
      stock: 1,
      store: { name: order.storeName },
    };

    const product = mapApiProduct(apiProduct);

    for (let index = 0; index < item.quantity; index += 1) {
      addCartItem(product);
    }
  });

  return {
    success: true,
    message: `Đã thêm lại sản phẩm từ đơn #${orderId} vào giỏ hàng!`,
  };
}
