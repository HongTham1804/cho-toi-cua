const MOCK_ORDER_TRACKING = {
  orderId: "CTC-982374",
  eta: "14:30",
  status: "Đang giao hàng",
  customer: {
    address: "Căn hộ Sunhome, 12 Nguyễn Cửu Đàm",
  },
  shipper: {
    name: "Nguyễn Văn A",
    plate: "29A - 123.45",
    avatar: "/assets/shipper.jpg",
    phone: "0900000000",
  },
  currentLocation: {
    lat: 10.762622,
    lng: 106.660172,
  },
  destination: {
    lat: 10.765,
    lng: 106.68,
  },
  steps: [
    {
      key: "confirmed",
      title: "Đã xác nhận",
      time: "13:00",
      description: "Siêu thị Tân Cúc đã nhận đơn",
      done: true,
    },
    {
      key: "pickup",
      title: "Đang lấy hàng",
      time: "13:15",
      description: "Shipper đã lấy hàng thành công",
      done: true,
    },
    {
      key: "shipping",
      title: "Đang giao hàng",
      time: null,
      description: "Shipper đang trên đường tới địa chỉ của bạn",
      done: true,
      active: true,
    },
    {
      key: "completed",
      title: "Hoàn thành",
      time: null,
      description: "Chờ nhận hàng",
      done: false,
    },
  ],
};

export function getOrderIdFromUrl() {
  return new URLSearchParams(window.location.search).get("orderId");
}

export async function fetchOrderTracking(orderId) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    ...MOCK_ORDER_TRACKING,
    orderId: orderId || MOCK_ORDER_TRACKING.orderId,
    customer: { ...MOCK_ORDER_TRACKING.customer },
    shipper: { ...MOCK_ORDER_TRACKING.shipper },
    steps: MOCK_ORDER_TRACKING.steps.map((step) => ({ ...step })),
  };
}
