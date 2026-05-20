import dauTayImage from "./assets/dau-tay.jpg";
import supLoImage from "./assets/sup-lo.jpg";

const MOCK_REVIEW_ORDER = {
  orderId: "CTC-2024-8892",
  status: "Giao hÃ ng thÃ nh cÃ´ng",
  receivedAt: "24 ThÃ¡ng 10, 2024",
  customerName: "NÃ´ng tráº¡i Xanh ÄÃ  Láº¡t",
  address: "221B LÃª Lá»£i, Quáº­n 1, TP.HCM",
  products: [
    {
      id: "1",
      name: "SÃºp lÆ¡ xanh ÄÃ  Láº¡t (500g)",
      origin: "VÆ°á»n VietGAP ÄÃ  Láº¡t",
      image: supLoImage,
    },
    {
      id: "2",
      name: "DÃ¢u tÃ¢y giá»‘ng Má»¹ (250g)",
      origin: "VÆ°á»n dÃ¢u thá»§y canh ÄÃ  Láº¡t",
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

  // Khi cÃ³ backend tháº­t:
  // const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/review`);
  // if (!res.ok) throw new Error(`KhÃ´ng thá»ƒ táº£i Ä‘Æ¡n hÃ ng: ${res.statusText}`);
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
  console.info("[ReviewAPI] Payload sáº½ gá»­i lÃªn backend:", {
    orderId,
    anonymous,
    reviews,
    imageMap,
  });
  return { success: true, message: "ÄÃ¡nh giÃ¡ Ä‘Ã£ Ä‘Æ°á»£c ghi nháº­n. Cáº£m Æ¡n báº¡n!" };

  // Khi cÃ³ backend tháº­t:
  // const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/reviews`, {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Gá»­i Ä‘Ã¡nh giÃ¡ tháº¥t báº¡i");
  // return res.json();
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

