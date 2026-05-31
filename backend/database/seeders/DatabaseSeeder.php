<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Users trước (partner_id của stores phụ thuộc vào users)
        $this->call([
            UserSeeder::class,
        ]);

        // 2. Tạo Store & Shipper
        $this->call([
            StoreSeeder::class,
            ShipperSeeder::class,
        ]);

        // 3. Tạo Categories từ CategorySeeder
        $this->call([
            CategorySeeder::class,
        ]);

        // 4. Lấy categories vừa tạo theo tên
        $catSua = Category::where('name', 'Sữa các loại')->first();
        $catRau = Category::where('name', 'Rau - Củ - Trái Cây')->first();
        $catHoaPham = Category::where('name', 'Hóa Phẩm - Tẩy rửa')->first();
        $catChamSoc = Category::where('name', 'Chăm Sóc Cá Nhân')->first();
        $catThitHaiSan = Category::where('name', 'Thịt - Hải Sản Tươi')->first();
        $catBanhKeo = Category::where('name', 'Bánh Kẹo')->first();

        // 5. Tạo 25 sản phẩm gắn với đúng category
        $products = [
            // Sữa các loại
            [
                'name' => 'Sữa tươi Vinamilk không đường 1L',
                'category_id' => $catSua?->id ?? 1,
                'original_price' => 30000,
                'price' => 36000,
                'discount_price' => 33000,
                'image_url' => 'https://loremflickr.com/400/400/milk,carton?lock=101',
                'description' => 'Hộp 1L, phù hợp dùng hằng ngày.',
            ],
            [
                'name' => 'Sữa tươi TH True Milk có đường 1L',
                'category_id' => $catSua?->id ?? 1,
                'original_price' => 33000,
                'price' => 39000,
                'discount_price' => 36000,
                'image_url' => 'https://loremflickr.com/400/400/milk,bottle?lock=102',
                'description' => 'Sữa tươi có đường hộp 1L.',
            ],
            [
                'name' => 'Sữa đặc Ông Thọ',
                'category_id' => $catSua?->id ?? 1,
                'original_price' => 23000,
                'price' => 28000,
                'discount_price' => 26000,
                'image_url' => 'https://loremflickr.com/400/400/condensed,milk?lock=103',
                'description' => 'Lon 380g, dùng pha cà phê hoặc làm bánh.',
            ],
            [
                'name' => 'Sữa chua Vinamilk có đường',
                'category_id' => $catSua?->id ?? 1,
                'original_price' => 27000,
                'price' => 32000,
                'discount_price' => 30000,
                'image_url' => 'https://loremflickr.com/400/400/yogurt?lock=104',
                'description' => 'Lốc 4 hộp sữa chua có đường.',
            ],

            // Rau - Củ - Trái Cây
            [
                'name' => 'Rau cải ngọt',
                'category_id' => $catRau?->id ?? 2,
                'original_price' => 12000,
                'price' => 18000,
                'discount_price' => 15000,
                'image_url' => 'https://loremflickr.com/400/400/green,vegetables?lock=105',
                'description' => 'Bó 500g, rau tươi dùng nấu canh hoặc xào.',
            ],
            [
                'name' => 'Cà chua Đà Lạt',
                'category_id' => $catRau?->id ?? 2,
                'original_price' => 18000,
                'price' => 25000,
                'discount_price' => 22000,
                'image_url' => 'https://loremflickr.com/400/400/tomato?lock=106',
                'description' => 'Túi 500g, cà chua tươi mọng.',
            ],
            [
                'name' => 'Khoai tây',
                'category_id' => $catRau?->id ?? 2,
                'original_price' => 22000,
                'price' => 30000,
                'discount_price' => 27000,
                'image_url' => 'https://loremflickr.com/400/400/potato?lock=107',
                'description' => 'Túi 1kg, phù hợp chiên hoặc nấu súp.',
            ],
            [
                'name' => 'Táo nhập khẩu',
                'category_id' => $catRau?->id ?? 2,
                'original_price' => 52000,
                'price' => 65000,
                'discount_price' => 59000,
                'image_url' => 'https://loremflickr.com/400/400/apple,fruit?lock=108',
                'description' => 'Túi 1kg, táo giòn ngọt.',
            ],
            [
                'name' => 'Chuối già Nam Mỹ',
                'category_id' => $catRau?->id ?? 2,
                'original_price' => 20000,
                'price' => 28000,
                'discount_price' => 25000,
                'image_url' => 'https://loremflickr.com/400/400/banana?lock=109',
                'description' => 'Nải khoảng 1kg, chuối chín tự nhiên.',
            ],

            // Hóa Phẩm - Tẩy rửa
            [
                'name' => 'Nước rửa chén Sunlight',
                'category_id' => $catHoaPham?->id ?? 3,
                'original_price' => 33000,
                'price' => 42000,
                'discount_price' => 39000,
                'image_url' => 'https://loremflickr.com/400/400/dish,soap?lock=110',
                'description' => 'Chai 750g, làm sạch dầu mỡ.',
            ],
            [
                'name' => 'Bột giặt OMO',
                'category_id' => $catHoaPham?->id ?? 3,
                'original_price' => 80000,
                'price' => 98000,
                'discount_price' => 89000,
                'image_url' => 'https://loremflickr.com/400/400/laundry,detergent?lock=111',
                'description' => 'Túi 3kg, giặt sạch quần áo.',
            ],
            [
                'name' => 'Nước lau sàn Gift',
                'category_id' => $catHoaPham?->id ?? 3,
                'original_price' => 43000,
                'price' => 52000,
                'discount_price' => 48000,
                'image_url' => 'https://loremflickr.com/400/400/cleaning,liquid?lock=112',
                'description' => 'Chai 1L, hương thơm dễ chịu.',
            ],
            [
                'name' => 'Nước tẩy Javel',
                'category_id' => $catHoaPham?->id ?? 3,
                'original_price' => 18000,
                'price' => 25000,
                'discount_price' => 23000,
                'image_url' => 'https://loremflickr.com/400/400/bleach,bottle?lock=113',
                'description' => 'Chai 1L, dùng vệ sinh và tẩy rửa.',
            ],

            // Chăm Sóc Cá Nhân
            [
                'name' => 'Dầu gội Clear Men',
                'category_id' => $catChamSoc?->id ?? 4,
                'original_price' => 78000,
                'price' => 95000,
                'discount_price' => 88000,
                'image_url' => 'https://loremflickr.com/400/400/shampoo,bottle?lock=114',
                'description' => 'Chai 650g, dầu gội dành cho nam.',
            ],
            [
                'name' => 'Sữa tắm Lifebuoy',
                'category_id' => $catChamSoc?->id ?? 4,
                'original_price' => 62000,
                'price' => 78000,
                'discount_price' => 72000,
                'image_url' => 'https://loremflickr.com/400/400/body,wash?lock=115',
                'description' => 'Chai 850g, làm sạch và bảo vệ da.',
            ],
            [
                'name' => 'Kem đánh răng P/S',
                'category_id' => $catChamSoc?->id ?? 4,
                'original_price' => 28000,
                'price' => 36000,
                'discount_price' => 33000,
                'image_url' => 'https://loremflickr.com/400/400/toothpaste?lock=116',
                'description' => 'Tuýp 230g, bảo vệ răng miệng.',
            ],
            [
                'name' => 'Bàn chải Colgate',
                'category_id' => $catChamSoc?->id ?? 4,
                'original_price' => 20000,
                'price' => 28000,
                'discount_price' => 25000,
                'image_url' => 'https://loremflickr.com/400/400/toothbrush?lock=117',
                'description' => 'Vỉ 2 cây bàn chải đánh răng.',
            ],

            // Thịt - Hải Sản Tươi
            [
                'name' => 'Thịt ba rọi heo',
                'category_id' => $catThitHaiSan?->id ?? 5,
                'original_price' => 110000,
                'price' => 135000,
                'discount_price' => 125000,
                'image_url' => 'https://loremflickr.com/400/400/pork,meat?lock=118',
                'description' => 'Khay 500g, thịt tươi dùng kho hoặc chiên.',
            ],
            [
                'name' => 'Ức gà phi lê',
                'category_id' => $catThitHaiSan?->id ?? 5,
                'original_price' => 62000,
                'price' => 78000,
                'discount_price' => 72000,
                'image_url' => 'https://loremflickr.com/400/400/chicken,meat?lock=119',
                'description' => 'Khay 500g, thịt gà phi lê tiện lợi.',
            ],
            [
                'name' => 'Tôm thẻ tươi',
                'category_id' => $catThitHaiSan?->id ?? 5,
                'original_price' => 120000,
                'price' => 145000,
                'discount_price' => 135000,
                'image_url' => 'https://loremflickr.com/400/400/shrimp,seafood?lock=120',
                'description' => 'Khay 500g, tôm tươi dùng hấp hoặc nấu lẩu.',
            ],
            [
                'name' => 'Cá basa phi lê',
                'category_id' => $catThitHaiSan?->id ?? 5,
                'original_price' => 70000,
                'price' => 89000,
                'discount_price' => 82000,
                'image_url' => 'https://loremflickr.com/400/400/fish,fillet?lock=121',
                'description' => 'Khay 500g, cá phi lê không xương.',
            ],

            // Bánh Kẹo
            [
                'name' => 'Bánh Oreo',
                'category_id' => $catBanhKeo?->id ?? 6,
                'original_price' => 16000,
                'price' => 22000,
                'discount_price' => 20000,
                'image_url' => 'https://loremflickr.com/400/400/cookies?lock=122',
                'description' => 'Gói 119g, bánh quy kem.',
            ],
            [
                'name' => 'Kẹo Alpenliebe',
                'category_id' => $catBanhKeo?->id ?? 6,
                'original_price' => 12000,
                'price' => 18000,
                'discount_price' => 16000,
                'image_url' => 'https://loremflickr.com/400/400/candy?lock=123',
                'description' => 'Gói 120g, kẹo ngọt tiện dùng.',
            ],
            [
                'name' => 'Bánh Chocopie',
                'category_id' => $catBanhKeo?->id ?? 6,
                'original_price' => 42000,
                'price' => 52000,
                'discount_price' => 48000,
                'image_url' => 'https://loremflickr.com/400/400/chocolate,cake?lock=124',
                'description' => 'Hộp 12 cái, bánh phủ socola.',
            ],
            [
                'name' => 'Snack Oishi vị tôm',
                'category_id' => $catBanhKeo?->id ?? 6,
                'original_price' => 7000,
                'price' => 12000,
                'discount_price' => 10000,
                'image_url' => 'https://loremflickr.com/400/400/snack,chips?lock=125',
                'description' => 'Gói 60g, snack ăn vặt.',
            ],
        ];

        foreach ($products as $data) {
            Product::firstOrCreate(
                ['name' => $data['name']],
                array_merge($data, [
                    'store_id'    => 1,
                    'stock'       => 100,
                    'is_active'   => true,
                ])
            );
        }

        // 6. Run OrderSeeder sau khi đã có sản phẩm
        $this->call([
            OrderSeeder::class,
        ]);
    }
}
