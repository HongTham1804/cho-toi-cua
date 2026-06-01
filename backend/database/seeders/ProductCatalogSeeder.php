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
                        'unit' => $this->productUnit($name),
                        'image_url' => $this->productImageUrl($name, $categoryKey),
                        'description' => $this->productDescription($name, $categoryKey),
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    private function productUnit(string $name): string
    {
        if (preg_match('/lốc\s+\d+\s+(lon|hộp)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/(túi|hộp|chai|gói|bó)\s+[\d.]+\s?(kg|g|l|ml)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/\d+\s+(gói|lon|hộp|cái)/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/hộp\s+\d+\s+cái/iu', $name, $matches)) {
            return $matches[0];
        }

        if (preg_match('/[\d.]+\s?(kg|g|l|ml)/iu', $name, $matches)) {
            return $matches[0];
        }

        return '1 sản phẩm';
    }

    private function productDescription(string $name, string $categoryKey): string
    {
        $customDescriptions = [
            'Rau cải xanh VietGAP 500g' => "Cải bẹ xanh hay còn gọi là cải cay, cải canh,... có tên khoa học là Brassica juncea (L.). Tuy cùng họ cải và khá gần với nhau nhưng cải bẹ xanh có \"ngoại hình\" hoàn toàn khác với cải ngọt với phần lá có răng cưa ở viền, mặt lá nhám và trải dọc đến tận cuốn. Cũng như nhiều loại rau khác, cải bẹ xanh chứa hàm lượng calories rất thấp nhưng lại có nhiều chất dinh dưỡng cần thiết cho cơ thể như Vitamin A, B, C, K, Axit nicotic, Abumin, Catoten…",
            'Rau muống sạch bó 400g' => 'Rau muống nước được trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sạch, chất lượng và an toàn với người dùng. Rau muống nước giòn, ngọt, chứa nhiều dinh dưỡng đặc biệt là sắt nên thường được sử dụng cho các món xào, luộc hoặc nhúng lẩu.',
            'Súp lơ xanh Đà Lạt 500g' => 'Bông cải xanh là một loại rau rất giàu dinh dưỡng có đầy đủ vitamin, khoáng chất, chất xơ và chất chống oxy hóa. Trong thành phần dinh dưỡng của bông cải xanh có 90% là nước, 7% carbohydrates, 3% protein và hầu như là không có chất béo.',
            'Cà chua Mộc Châu hộp 500g' => 'Cà chua là loại thực phẩm bổ dưỡng, thường được sử dụng để chế biến với nhiều món ăn ngon. Ngoài ra, với giá trị dinh dưỡng của mình, cà chua cũng được dùng để ăn sống hay áp dụng như một liệu pháp làm đẹp từ thiên nhiên.',
            'Táo Gala nhập khẩu túi 1kg' => 'Táo Gala là giống táo vỏ mỏng, nổi bật với màu đỏ tươi xen lẫn các đường sọc vàng. Có nguồn gốc từ New Zealand, loại quả này được yêu thích nhờ phần thịt màu vàng kem, giòn, nhiều nước và vị ngọt thanh.',
            'Mận hậu Sơn La hộp 500g' => 'Mận hậu Sơn La quả to giòn, có lớp da căng bóng. Bên ngoài quả mận có phủ một lớp phấn trắng đặc trưng. Khi bóp nhẹ có cảm giác hơi cứng chứ không bị dập nát. Vỏ quả mận có màu xanh khi còn non và chuyển sang đỏ tía như quả Cherry lúc chín. Hương vị chua thanh pha chút ngọt mát, chát nhẹ và có nhiều nước.',
            'Dưa leo baby túi 500g' => 'Dưa leo baby được trồng ứng dụng công nghệ cao, đảm bảo sản phẩm an toàn chất lượng, có vị đậm, giòn, ngọt. Dưa leo baby có kích thước nhỏ hơn các loại dưa leo khác, chỉ khoảng bằng ngón tay, màu xanh đậm, trái đều nhau, ăn có vị mát, ngọt đặc trưng. Dưa leo baby chứa nhiều vitamin và khoáng chất có tác dụng hỗ trợ giảm cân, ổn định huyết áp, cho hơi thở thơm mát và làm đẹp da.',
            'Cà rốt Đà Lạt 500g' => 'Cà rốt là một loại cây có củ, chứa nhiều vitamin A tốt cho mắt, giúp mắt sáng khỏe. Cà rốt có chứa một lượng phytochemical có đặc tính chống oxy hóa cùng beta-carotene và các carotenoid giúp thúc đẩy hệ miễn dịch. Nước ép cà rốt có thể hỗ trợ sức khỏe, tuy nhiên nên sử dụng ở mức vừa phải do có thể gây vàng da.',
            'Thịt bò Úc thái lát 300g' => 'Thịt bò Úc thái lát 300g là sản phẩm thịt bò nhập khẩu cao cấp được cắt lát mỏng bằng máy chuyên dụng, phổ biến nhất là phần ba chỉ, gầu bò hoặc vai bò chuyên dùng cho các món lẩu, nướng và xào. Sản phẩm được đóng khay 300g tiện lợi, hút chân không và cấp đông tiêu chuẩn để giữ nguyên độ tươi.',
            'Thịt thăn bò tươi 300g' => 'Thịt thăn bò tươi 300g là phần thịt cao cấp được cắt thái sẵn thành khẩu phần lý tưởng cho bữa ăn từ 1-2 người. Với cấu trúc thớ thịt nhỏ mềm mại đan xen vân mỡ nhẹ, sản phẩm mang lại vị ngọt đậm đà tự nhiên và độ mọng nước hoàn hảo khi chế biến. Đây là lựa chọn tuyệt vời cho các món áp chảo, làm steak sang trọng hay xào nhanh cho bữa cơm gia đình giàu dinh dưỡng.',
            'Snack khoai tây vị tự nhiên 160g' => "Snack khoai tây vị tự nhiên Classic Lay's gói 160g là một sản phẩm snack nổi bật hàng đầu của thương hiệu Lay's, mang một hương vị cổ điển bởi đơn giản chỉ là sự kết hợp giữa khoai tây và gia vị đơn thuần, thơm ngon độc đáo. Snack Lay's được rất nhiều bạn trẻ đón nhận và sử dụng cho nhiều hoạt động.",
        ];

        if (isset($customDescriptions[$name])) {
            return $customDescriptions[$name];
        }

        $descriptions = [
            'milk' => "{$name} được chọn lọc cho nhu cầu sử dụng hằng ngày, đóng gói tiện lợi và phù hợp bảo quản ở nhiệt độ phòng theo khuyến nghị.",
            'produce' => "{$name} tươi mới, được chọn từ nguồn cung ổn định, phù hợp cho bữa ăn gia đình và nên dùng sớm sau khi nhận hàng.",
            'cleaning' => "{$name} hỗ trợ vệ sinh nhà cửa hiệu quả, bao bì nguyên vẹn và cần để xa tầm tay trẻ em.",
            'personal' => "{$name} phù hợp chăm sóc cá nhân hằng ngày, được đóng gói tiện lợi và bảo quản nơi khô ráo.",
            'meat' => "{$name} được bảo quản lạnh, giao nhanh để giữ độ tươi ngon và nên chế biến trong thời gian khuyến nghị.",
            'snack' => "{$name} đóng gói tiện lợi, phù hợp dùng trong gia đình hoặc mang theo khi di chuyển.",
        ];

        return $descriptions[$categoryKey] ?? "{$name} đang bán tại hệ thống Chợ Tới Cửa.";
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
