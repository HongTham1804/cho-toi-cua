import dauTayImage from "../assets/dau-tay.jpg";
import supLoImage from "../assets/sup-lo.jpg";

const MOCK_REVIEW_ORDER = {
  orderId: "CTC-2024-8892",
  status: "Giao hàng thành công",
  receivedAt: "24 Tháng 10, 2024",
  customerName: "Nông trại Xanh Đà Lạt",
  address: "221B Lê Lợi, Quận 1, TP.HCM",
  products: [
    {
      id: "1",
      name: "Súp lơ xanh Đà Lạt (500g)",
      origin: "Vườn VietGAP Đà Lạt",
      image: supLoImage,
    },
    {
      id: "2",
      name: "Dâu tây giống Mỹ (250g)",
      origin: "Vườn dâu thủy canh Đà Lạt",
      image: dauTayImage,
    },
  ],
};

export function getOrderIdFromUrl() {
  return new URLSearchParams(window.location.search).get("orderId");
}

export async function fetchReviewOrder(orderId) {
  await delay(700);
  return { ...MOCK_REVIEW_ORDER, orderId: orderId || MOCK_REVIEW_ORDER.orderId };

  // Khi có backend thật:
  // const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/review`);
  // if (!res.ok) throw new Error(`Không thể tải đơn hàng: ${res.statusText}`);
  // return res.json();
}

export async function postReviews(orderId, anonymous, reviews, imageMap) {
  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("anonymous", String(anonymous));
  formData.append("reviews", JSON.stringify(reviews));

  Object.entries(imageMap).forEach(([productId, files]) => {
    files.forEach((file) => {
      formData.append(`images_${productId}`, file);
    });
  });

  await delay(900);
  console.info("[ReviewAPI] Payload sẽ gửi lên backend:", {
    orderId,
    anonymous,
    reviews,
    imageMap,
  });
  return { success: true, message: "Đánh giá đã được ghi nhận. Cảm ơn bạn!" };

  // Khi có backend thật:
  // const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/reviews`, {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Gửi đánh giá thất bại");
  // return res.json();
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
