export const productsData = [
  {
    id: 1,
    name: "Cá Hồi Na Uy Tươi Cắt Lát (500g)",
    price: 395000,
    sold: "1.2k",
    rating: 4.8,
    reviewsCount: 128,
    origin: "Salmar, Na Uy",
    storage: "0 - 4°C trong 3 ngày",
    description: "Cá hồi nhập khẩu trực tiếp bằng đường hàng không từ Na Uy. Thịt cá có màu cam đào đặc trưng, những vân mỡ trắng xen kẽ đều đặn. Cực kỳ phù hợp để làm sashimi, áp chảo hoặc nướng.",
    mainImage: "link_anh_ca_hoi.jpg", 
    thumbnails: ["thumb1_cahoi.jpg", "thumb2_cahoi.jpg", "thumb3_cahoi.jpg"],
    reviews: [
      {
        id: 1,
        user: "Minh Anh",
        time: "2 ngày trước",
        stars: 5,
        content: "Cá rất tươi, vân mỡ đẹp, mình mua về làm sashimi ăn cực kỳ béo ngậy và ngọt thịt. Giao hàng nhanh đóng gói cẩn thận có đá lạnh kèm theo. Sẽ ủng hộ shop dài dài.",
        image: "link_anh_review_cahoi_1.jpg"
      },
      {
        id: 2,
        user: "Hồng Nhung",
        time: "5 ngày trước",
        stars: 4,
        content: "Cá tươi, áp chảo rất ngon, nhưng miếng cắt hơi mỏng so với mình mong đợi. Dù sao vẫn 5 sao cho chất lượng.",
        image: ""
      }
    ]
  },
  {
    id: 2,
    name: "Thịt Bò Úc Nhập Khẩu (300g)",
    price: 250000,
    sold: "850",
    rating: 4.9,
    reviewsCount: 95,
    origin: "Úc",
    storage: "-18°C",
    description: "Thịt bò mềm, mọng nước, thích hợp làm bít tết...",
    mainImage: "link_anh_thit_bo.jpg",
    thumbnails: [],
    reviews: [
      {
        id: 3,
        user: "Quốc Tuấn",
        time: "1 tuần trước",
        stars: 5,
        content: "Thịt bò rất mềm, làm bít tết ăn tuyệt vời. Vị ngọt tự nhiên, không bị dai. Đóng gói hút chân không sạch sẽ.",
        image: "link_anh_review_thitbo_1.jpg"
      }
    ] 
  },
  {
    id: 3,
    name: "Rau Muống VietGAP",
    price: 250000, // Giá giả định cho một bó khoảng 500g
    sold: "3.5k",
    rating: 4.7,
    reviewsCount: 210,
    origin: "Lâm Đồng, Việt Nam",
    storage: "2 - 5°C, dùng trong 2 ngày",
    description: "Rau muống VietGAP tươi sạch, cọng giòn, lá xanh non. Không sử dụng thuốc trừ sâu hóa học, an toàn cho sức khỏe. Thích hợp xào tỏi, luộc, nấu canh.",
    mainImage: "image_4.png", // Sử dụng file ảnh rau muống
    thumbnails: ["thumb1_raumuong.jpg", "thumb2_raumuong.jpg"],
    reviews: [
      {
        id: 4,
        user: "Thu Phương",
        time: "1 ngày trước",
        stars: 5,
        content: "Rau muống rất tươi, không bị giập, cọng giòn rụm. Shop đóng gói kỹ. Nhà mình rất thích món rau muống xào tỏi từ rau này.",
        image: "link_anh_review_raumuong_1.jpg"
      },
      {
        id: 5,
        user: "Ngọc Lan",
        time: "3 ngày trước",
        stars: 4,
        content: "Rau tươi nhưng hơi nhiều lá so với cọng, thích cọng to hơn chút. Dù sao vẫn rất ngon.",
        image: ""
      }
    ]
  },
  {
    id: 4,
    name: "Cà Chua Bi Cherry Ngọt (500g)",
    price: 45000,
    sold: "2.1k",
    rating: 4.9,
    reviewsCount: 155,
    origin: "Đà Lạt, Việt Nam",
    storage: "10-15°C, hoặc tủ mát",
    description: "Cà chua bi Cherry đỏ mọng, vỏ mỏng, vị ngọt thanh tự nhiên, ít hạt. Giàu vitamin và lycopene. Ăn sống trực tiếp hoặc làm salad cực ngon.",
    mainImage: "image_6.png", // Sử dụng file ảnh cà chua
    thumbnails: [],
    reviews: [
      {
        id: 6,
        user: "Văn Đức",
        time: "2 ngày trước",
        stars: 5,
        content: "Cà chua bi ngọt lịm, vỏ mỏng, con nhà mình thích ăn sống lắm. Quả đều, đẹp, không bị nát quả nào.",
        image: "link_anh_review_cachua_1.jpg"
      },
      {
        id: 7,
        user: "Kim Chi",
        time: "4 ngày trước",
        stars: 5,
        content: "Làm salad ngon tuyệt. Cà tươi, giữ được độ giòn ngọt. Giá cả hợp lý.",
        image: ""
      }
    ]
  },
  {
    id: 5,
    name: "Trứng Gà Ta Sạch (hộp 10 quả)",
    price: 38000,
    sold: "5k",
    rating: 4.8,
    reviewsCount: 412,
    origin: "Trang trại VietGAP Hà Nam",
    storage: "Nhiệt độ phòng 7 ngày, tủ mát 15 ngày",
    description: "Trứng gà ta vỏ màu nâu, lòng đỏ đậm, nhiều dinh dưỡng. Trứng được chọn lọc kỹ, sạch, không dính phân. Phù hợp cho trẻ em, người già, phụ nữ mang thai.",
    mainImage: "image_5.png", // Sử dụng file ảnh trứng
    thumbnails: ["thumb1_trungga.jpg"],
    reviews: [
      {
        id: 8,
        user: "Thanh Hằng",
        time: "1 ngày trước",
        stars: 5,
        content: "Trứng tươi, lòng đỏ to và đậm màu. Giao hàng đóng gói kỹ, không bị vỡ quả nào. Giá cả hợp lý.",
        image: "link_anh_review_trungga_1.jpg"
      },
      {
        id: 9,
        user: "Tùng Lâm",
        time: "3 ngày trước",
        stars: 5,
        content: "Làm món trứng ốp la cực ngon, thơm phức. Trứng sạch sẽ. Sẽ tiếp tục ủng hộ shop.",
        image: ""
      }
    ]
  },
  {
    id: 6,
    name: "Mận Hậu Sơn La (loại 1)",
    price: 60000,
    sold: "1.8k",
    rating: 4.6,
    reviewsCount: 110,
    origin: "Sơn La, Việt Nam",
    storage: "2 - 8°C, dùng trong 3 ngày",
    description: "Mận Hậu chín đỏ thẫm, giòn, vị chua ngọt đậm đà. Ăn trực tiếp với muối ớt, dầm đường hoặc làm mứt.",
    mainImage: "image_2.png", // Sử dụng file ảnh mận
    thumbnails: [],
    reviews: [
      {
        id: 10,
        user: "Mai Anh",
        time: "2 ngày trước",
        stars: 5,
        content: "Mận giòn, vị chua ngọt vừa phải. Chấm muối ớt thì tuyệt vời. Quả đều, không bị dập. Giao hàng nhanh.",
        image: "link_anh_review_man_1.jpg"
      },
      {
        id: 11,
        user: "Thế Vinh",
        time: "4 ngày trước",
        stars: 4,
        content: "Hàng đến nơi còn tươi, ăn giòn tan. Tuy nhiên mận hơi chua hơn mình nghĩ.",
        image: ""
      }
    ]
  },
  {
    id: 7,
    name: "Súp Lơ Xanh VietGAP",
    price: 30000, // Giá giả định cho một cây khoảng 500g
    sold: "2.2k",
    rating: 4.7,
    reviewsCount: 198,
    origin: "Lâm Đồng, Việt Nam",
    storage: "2 - 5°C, dùng trong 3 ngày",
    description: "Súp lơ xanh búp chặt, màu xanh đậm, không bị thâm. Rau sạch VietGAP, an toàn. Phù hợp xào, nấu canh, luộc.",
    mainImage: "image_3.png", // Sử dụng file ảnh súp lơ
    thumbnails: ["thumb1_suplo.jpg"],
    reviews: [
      {
        id: 12,
        user: "Hương Giang",
        time: "1 ngày trước",
        stars: 5,
        content: "Súp lơ rất tươi, búp chặt, không bị héo hay sâu. Nấu canh ngọt, giữ được màu xanh đẹp.",
        image: "link_anh_review_suplo_1.jpg"
      },
      {
        id: 13,
        user: "Minh Hoàng",
        time: "3 ngày trước",
        stars: 5,
        content: "Shop giao hàng nhanh. Súp lơ ngon, tươi xanh. Lần sau sẽ mua tiếp.",
        image: ""
      }
    ]
  },
  {
    id: 8,
    name: "Tôm Thẻ Chân Trắng Tươi (500g)",
    price: 165000,
    sold: "950",
    rating: 4.8,
    reviewsCount: 135,
    origin: "Cà Mau, Việt Nam",
    storage: "0 - 2°C, dùng trong ngày hoặc cấp đông",
    description: "Tôm thẻ chân trắng tươi sống, size lớn (30-40 con/kg). Vỏ mỏng, thịt chắc, ngọt, nhiều gạch. Phù hợp làm tôm rang, lẩu, hấp sả.",
    mainImage: "image_0.png", // Sử dụng file ảnh tôm
    thumbnails: ["thumb1_tom.jpg", "thumb2_tom.jpg"],
    reviews: [
      {
        id: 14,
        user: "Trọng Nghĩa",
        time: "1 ngày trước",
        stars: 5,
        content: "Tôm rất tươi, mình mua về làm tôm hấp, thịt rất ngọt và chắc. Giao hàng nhanh đóng gói cẩn thận.",
        image: "link_anh_review_tom_1.jpg"
      },
      {
        id: 15,
        user: "Vân Anh",
        time: "3 ngày trước",
        stars: 5,
        content: "Tôm đều con, còn sống khi giao đến. Shop đóng gói đá lạnh đầy đủ. 5 sao.",
        image: ""
      }
    ]
  }
];