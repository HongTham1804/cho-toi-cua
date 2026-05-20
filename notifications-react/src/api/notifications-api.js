const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "delivery",
    title: "Đơn hàng #CTC-8923 đang được giao",
    message:
      "Tài xế Nguyễn Văn A đang trên đường giao đơn hàng rau củ quả tới nhà bạn. Vui lòng chú ý điện thoại.",
    time: "Vừa xong",
    isRead: false,
    link: "/orders/CTC-8923/tracking",
  },
  {
    id: 2,
    type: "promotion",
    title: "Flash Sale: Tết Bé Ưu giảm 30%",
    message:
      "Cơ hội vàng! Thịt bò Úc tươi ngon chuẩn bị lên kệ Flash Sale lúc 12:00. Đừng bỏ lỡ!",
    time: "2 giờ trước",
    isRead: false,
    link: "/promotions",
  },
  {
    id: 3,
    type: "voucher",
    title: "Voucher 50K cho đơn từ 300K",
    message:
      "Tặng bạn mã FREESHIP50 để mua sắm thỏa thích các mặt hàng trái cây nhập khẩu. HSD: 30/11.",
    time: "Hôm qua",
    isRead: true,
    link: "/vouchers",
  },
  {
    id: 4,
    type: "success",
    title: "Đơn hàng #CTC-8810 đã giao thành công",
    message:
      "Cảm ơn bạn đã mua sắm tại Chợ Tới Cửa. Hãy đánh giá sản phẩm để nhận thêm điểm thưởng nhé!",
    time: "2 ngày trước",
    isRead: true,
    link: "/orders/CTC-8810/review",
  },
  {
    id: 5,
    type: "info",
    title: "Cập nhật chính sách giao hàng",
    message:
      "Chúng tôi vừa cập nhật khu vực giao hàng hỏa tốc trong 2H. Xem chi tiết để biết thêm thông tin.",
    time: "1 tuần trước",
    isRead: true,
    link: "/news/shipping-policy",
  },
];

export async function fetchNotifications() {
  await new Promise((resolve) => setTimeout(resolve, 550));
  return MOCK_NOTIFICATIONS.map((item) => ({ ...item }));
}

export async function markOneRead(id) {
  await new Promise((resolve) => setTimeout(resolve, 200));
}

export async function markAllRead() {
  await new Promise((resolve) => setTimeout(resolve, 350));
}
