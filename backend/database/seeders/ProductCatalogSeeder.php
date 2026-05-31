<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        Product::withTrashed()
            ->whereIn('store_id', [1, 2, 3])
            ->forceDelete();

        $categoryIds = [
            'milk' => Category::where('name', 'Sữa các loại')->value('id') ?? 1,
            'produce' => Category::where('name', 'Rau - Củ - Trái Cây')->value('id') ?? 2,
            'cleaning' => Category::where('name', 'Hóa Phẩm - Tẩy rửa')->value('id') ?? 3,
            'personal' => Category::where('name', 'Chăm Sóc Cá Nhân')->value('id') ?? 4,
            'meat' => Category::where('name', 'Thịt - Hải Sản Tươi')->value('id') ?? 5,
            'snack' => Category::where('name', 'Bánh Kẹo')->value('id') ?? 6,
        ];

        $commonProducts = [
            ['Rau cải xanh VietGAP 500g', 'produce', 22000, 18000, 'green,vegetables'],
            ['Rau muống sạch bó 400g', 'produce', 12000, null, 'water,spinach'],
            ['Súp lơ xanh Đà Lạt 500g', 'produce', 39000, 32000, 'broccoli'],
            ['Cà chua Mộc Châu hộp 500g', 'produce', 28000, null, 'tomato'],
            ['Táo Gala nhập khẩu túi 1kg', 'produce', 82000, 69000, 'apple,fruit'],
            ['Mận hậu Sơn La hộp 500g', 'produce', 45000, null, 'plum,fruit'],
            ['Dưa leo baby túi 500g', 'produce', 22000, null, 'cucumber'],
            ['Cà rốt Đà Lạt 500g', 'produce', 32000, 26000, 'carrot'],
            ['Thịt bò Úc thái lát 300g', 'meat', 145000, 118000, 'beef,meat'],
            ['Thịt thăn bò tươi 300g', 'meat', 135000, null, 'beef,steak'],
            ['Tôm thẻ tươi 500g', 'meat', 155000, 128000, 'shrimp,seafood'],
            ['Cá basa phi lê 500g', 'meat', 74000, null, 'fish,fillet'],
            ['Ức gà phi lê 500g', 'meat', 85000, 72000, 'chicken,meat'],
            ['Ba chỉ heo sạch 500g', 'meat', 105000, null, 'pork,meat'],
            ['Sữa tươi Vinamilk không đường 1L', 'milk', 35000, null, 'milk,carton'],
            ['Sữa chua có đường lốc 4 hộp', 'milk', 34000, 29000, 'yogurt'],
            ['Nước cam ép hộp 1L', 'milk', 42000, null, 'orange,juice'],
            ['Nước suối Lavie chai 1.5L', 'milk', 11000, null, 'water,bottle'],
            ['Milo lốc 4 hộp 180ml', 'milk', 36000, null, 'milo,chocolate'],
            ['Dầu gội Clear bạc hà 650g', 'personal', 165000, 139000, 'shampoo,bottle'],
            ['Sữa tắm Lifebuoy 800g', 'personal', 129000, null, 'body,wash'],
            ['Kem đánh răng P/S 180g', 'personal', 45000, 38000, 'toothpaste'],
            ['Khăn giấy Bless You 3 lớp', 'personal', 32000, null, 'tissue,paper'],
            ['Nước rửa tay Lifebuoy 450g', 'personal', 54000, null, 'hand,soap'],
            ['Bột giặt OMO túi 3kg', 'cleaning', 169000, null, 'laundry,detergent'],
            ['Nước lau sàn Sunlight 1kg', 'cleaning', 42000, null, 'floor,cleaner'],
            ['Nước rửa chén Sunlight 750g', 'cleaning', 39000, 33000, 'dish,soap'],
            ['Nước tẩy Javel chai 1L', 'cleaning', 25000, 18000, 'bleach,bottle'],
            ['Bánh Oreo socola hộp 266g', 'snack', 43000, null, 'oreo,cookies'],
            ['Snack khoai tây vị tự nhiên 160g', 'snack', 46000, 39000, 'potato,chips'],
            ['Kẹo Alpenliebe túi 120g', 'snack', 25000, null, 'candy'],
            ['Bánh Chocopie hộp 12 cái', 'snack', 52000, 48000, 'chocolate,cake'],
            ['Mì Hảo Hảo tôm chua cay 5 gói', 'snack', 24000, null, 'instant,noodles'],
            ['Gạo ST25 túi 5kg', 'snack', 220000, 195000, 'rice,bag'],
            ['Dầu ăn Tường An chai 1L', 'snack', 52000, null, 'cooking,oil'],
            ['Đường Biên Hòa gói 1kg', 'snack', 31000, null, 'sugar,bag'],
        ];

        $storeProducts = [
            1 => [
                ['Xà lách lolo xanh 300g', 'produce', 28000, null, 'lettuce'],
                ['Cá hồi cắt khúc 250g', 'meat', 158000, null, 'salmon'],
                ['Sữa đậu nành Fami lốc 6 hộp', 'milk', 48000, null, 'soy,milk'],
                ['Bánh gạo vị mặn gói 150g', 'snack', 33000, null, 'rice,cracker'],
            ],
            2 => [
                ['Nho xanh không hạt hộp 500g', 'produce', 125000, 98000, 'green,grapes'],
                ['Dâu tây Đà Lạt hộp 250g', 'produce', 76000, null, 'strawberry'],
                ['Cá thu cắt lát 400g', 'meat', 140000, 118000, 'mackerel,fish'],
                ['Phô mai lát lốc 200g', 'milk', 64000, null, 'cheese'],
            ],
            3 => [
                ['Cam sành mọng nước túi 1kg', 'produce', 42000, null, 'orange,fruit'],
                ['Bí đỏ hồ lô 1kg', 'produce', 34000, 27000, 'pumpkin'],
                ['Mực ống làm sạch 400g', 'meat', 132000, null, 'squid,seafood'],
                ['Coca-Cola lon lốc 6 lon', 'milk', 72000, 62000, 'cola,cans'],
            ],
        ];

        foreach ([1, 2, 3] as $storeId) {
            $rows = array_slice(array_merge($commonProducts, $storeProducts[$storeId]), 0, 40);

            foreach ($rows as $index => [$name, $categoryKey, $originalPrice, $discountPrice]) {
                $price = $discountPrice ?: $originalPrice;

                Product::updateOrCreate(
                    [
                        'store_id' => $storeId,
                        'name' => $name,
                    ],
                    [
                        'category_id' => $categoryIds[$categoryKey],
                        'original_price' => $originalPrice,
                        'price' => $price,
                        'discount_price' => $discountPrice,
                        'stock' => 80 + (($index + $storeId) % 40),
                        'image_url' => $this->productImageUrl($name, $categoryKey),
                        'description' => 'Sản phẩm đang bán tại hệ thống Chợ Tới Cửa.',
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    private function productImageUrl(string $name, string $categoryKey): string
    {
        $imageFile = $this->findProductImageFile($name);

        if ($imageFile) {
            return '/images/products/' . rawurlencode($imageFile);
        }

        return '/api/product-images/' . Str::slug($name) . '.svg?' . http_build_query([
            'label' => $name,
            'type' => $categoryKey,
        ]);
    }

    private function findProductImageFile(string $name): ?string
    {
        static $filesByProductName = null;

        if ($filesByProductName === null) {
            $filesByProductName = [];
            $imagePaths = glob(public_path('images/products/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'), GLOB_BRACE) ?: [];

            foreach ($imagePaths as $imagePath) {
                $fileName = basename($imagePath);
                $nameWithoutExtension = pathinfo($fileName, PATHINFO_FILENAME);
                $filesByProductName[$this->normalizeProductName($nameWithoutExtension)] = $fileName;
            }
        }

        return $filesByProductName[$this->normalizeProductName($name)] ?? null;
    }

    private function normalizeProductName(string $name): string
    {
        return preg_replace('/[^a-z0-9]+/', '', strtolower(Str::ascii($name)));
    }
}
