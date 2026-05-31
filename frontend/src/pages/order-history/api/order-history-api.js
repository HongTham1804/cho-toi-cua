const MOCK_USER = {
  name: "Nguyễn Văn A",
  tag: "Thành viên thân thiết",
};

const MOCK_ORDERS = [
  {
    id: "CTC-98234",
    storeName: "GO! Dĩ An",
    date: "24/10/2023 - 08:30",
    products: "Rau muống hữu cơ, Cà chua bi, Thịt bò Úc (+3 sản phẩm)",
    total: 345000,
    status: "pending",
  },
  {
    id: "CTC-09870",
    storeName: "WinMart Lê Văn Việt",
    date: "20/10/2023 - 14:15",
    products: "Sữa tươi TH True Milk, Bánh mì gối (+1 sản phẩm)",
    total: 120000,
    status: "preparing",
  },
  {
    id: "CTC-97350",
    storeName: "Bách Hóa Xanh Lê Văn Chí",
    date: "18/10/2023 - 09:00",
    products: "Nước mắm Nam Ngư, Mì Hảo Hảo (+5 sản phẩm)",
    total: 216000,
    status: "shipping",
  },
  {
    id: "CTC-88120",
    storeName: "GO! Dĩ An",
    date: "15/10/2023 - 11:00",
    products: "Trứng gà ta, Rau cải xanh, Bắp cải tím (+2 sản phẩm)",
    total: 87000,
    status: "completed",
  },
  {
    id: "CTC-77001",
    storeName: "WinMart Lê Văn Việt",
    date: "10/10/2023 - 16:45",
    products: "Dầu ăn Tường An, Nước tương Maggi (+4 sản phẩm)",
    total: 189000,
    status: "cancelled",
  },
];

export async function fetchCurrentUser() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...MOCK_USER };
}

export async function fetchOrders(status = "all") {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const orders = MOCK_ORDERS.map((order) => ({ ...order }));

  if (status === "all") return orders;

  return orders.filter((order) => order.status === status);
}

export async function reorder(orderId) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    message: `Đã thêm lại sản phẩm từ đơn #${orderId} vào giỏ hàng!`,
  };
}
