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
            'Tôm thẻ tươi 500g' => 'Tôm thẻ vốn đã quá quen thuộc và được nhiều khách hàng ưa chuộng bởi thịt tôm ngọt, giàu dinh dưỡng, dễ chế biến, thường được làm nguyên liệu cho các bữa ăn hàng ngày. Chúng ta có thể dễ dàng nhận thấy sự hiện diện của loại hải sản này trong các món canh, món kho thường ngày.',
            'Cá basa phi lê 500g' => 'Cá basa phi lê là một sản phẩm được ưa chuộng nhờ thịt mềm, béo và ít xương. Đây là loại cá nước ngọt phổ biến tại Việt Nam, có hương vị thơm ngon và dễ dàng chế biến thành nhiều món ăn hấp dẫn. Cá basa phi lê không chỉ tiện lợi mà còn giàu dinh dưỡng, phù hợp với mọi lứa tuổi.',
            'Ức gà phi lê 500g' => 'Ức gà phi lê có da 500g là lựa chọn lý tưởng cho những bữa ăn lành mạnh, đầy đủ dưỡng chất. Đây là phần thịt trắng được tách từ lườn gà, có kết cấu mềm, ít gân và hầu như không có mỡ. Sản phẩm giữ nguyên lớp da mỏng, giúp tăng hương vị và giữ độ ẩm cho thịt khi chế biến. Được đóng gói tiện lợi theo trọng lượng 500g, ức gà phi lê có da phù hợp với khẩu phần ăn gia đình nhỏ hoặc các bữa ăn chế biến nhanh chóng.',
            'Ba chỉ heo sạch 500g' => 'Ba chỉ heo là miếng thịt có sự kết hợp hoàn hảo giữa nạc và mỡ. Sau khi chế biến, ba chỉ heo nhập khẩu có vị mềm ngọt của thịt nạc và béo ngậy của thịt mỡ nhưng không gây cảm giác quá ngấy như những loại thịt khác.',
            'Sữa tươi Vinamilk không đường 1L' => 'Sữa tươi Vinamilk là thương hiệu được tin dùng hàng đầu với chất lượng tuyệt vời được chế biến từ nguồn sữa tươi 100% chứa nhiều dưỡng chất như vitamin A, D3, canxi,... tốt cho xương và hệ miễn dịch. Sữa tươi Vinamilk hộp 1 lít thơm ngon, bổ dưỡng.',
            'Nước cam ép hộp 1L' => 'Sản phẩm nước ép trái cây chất lượng thơm ngon từ thương hiệu Vfresh với 100% thành phần từ cam tươi có chứa nhiều vitamin C, phù hợp để bổ sung dưỡng chất và tăng cường sức đề kháng. Sản phẩm cam kết chính hãng và an toàn.',
            'Nước suối Lavie chai 1.5L' => 'Từ nguồn nước khoáng thiên nhiên chất lượng, nước khoáng La Vie trải qua quy trình sản xuất và đóng chai tiên tiến hiện đại. Nước khoáng La Vie chai 1.5L giúp cung cấp đủ nước và khoáng chất cho cơ thể, hỗ trợ thanh lọc cơ thể, giúp tinh thần tươi trẻ và sức khỏe căng tràn.',
            'Milo lốc 4 hộp 180ml' => 'Sản phẩm sữa socola thơm ngon, giàu canxi và protein giúp cơ thể phát triển. Đặc biệt, thương hiệu sữa ca cao Milo nổi tiếng rất được các bé yêu thích và tin dùng. Lốc 4 hộp sữa lúa mạch Milo 180ml thơm ngon, đầy dinh dưỡng, vị ngon kích thích vị giác.',
            'Dầu gội Clear bạc hà 650g' => 'Dầu gội Clear được nhiều người yêu thích, là dầu gội sạch gàu số 1 Việt Nam. Dầu gội Clear mát lạnh bạc hà 650ml kết hợp từ các dưỡng chất, vitamin và khoáng chất cùng bạc hà mát lạnh, giúp phục hồi dưỡng chất cần thiết cho da đầu, nuôi dưỡng tóc và ngăn gàu quay trở lại.',
            'Sữa tắm Lifebuoy 800g' => 'Sữa tắm với hương thơm dịu nhẹ, thích hợp cho cả gia đình sử dụng. Sữa tắm bảo vệ khỏi vi khuẩn Lifebuoy bảo vệ vượt trội chai 800g giúp làm sạch và bảo vệ khỏi vi khuẩn trên da, mang lại cho gia đình bạn một làn da khỏe mạnh.',
            'Kem đánh răng P/S 180g' => 'Kem đánh răng P/S là loại kem đánh răng được yêu thích bởi đa dạng công dụng và hiệu quả mang lại. Kem đánh răng P/S ngừa sâu răng vượt trội 180g chăm sóc nướu, giúp trắng răng, giảm ê buốt, giảm mảng bám, ngừa sâu răng và giữ hơi thở thơm mát.',
            'Khăn giấy Bless You 3 lớp' => 'Khăn giấy Bless You được sản xuất tại Việt Nam, không mùi, thành phần 100% bột giấy nguyên thủy an toàn cho da khi sử dụng. Khăn giấy thấm hút tốt, mềm và siêu mịn, phù hợp dùng vệ sinh cá nhân hằng ngày.',
            'Nước rửa tay Lifebuoy 450g' => 'Nước rửa tay Lifebuoy an toàn, chất lượng được nhiều gia đình lựa chọn tin dùng. Nước rửa tay Lifebuoy bảo vệ chai 450ml giúp khử khuẩn, bảo vệ da tay khỏi 99,9% vi khuẩn gây hại, hương thơm nhẹ tạo cảm giác tươi mát sảng khoái sau mỗi lần sử dụng.',
            'Bột giặt OMO túi 3kg' => 'Bột giặt OMO là thương hiệu bột giặt luôn được tin dùng hàng đầu vì an toàn cho da và giúp xoáy bay các vết bẩn cứng đầu sau một lần giặt, cho quần áo trắng sạch tinh tươm cùng hương thơm tươi mới. Bột giặt OMO công nghệ xanh túi 3kg lớn tiết kiệm, tiện dùng.',
            'Nước lau sàn Sunlight 1kg' => 'Nước lau sàn Sunlight là thương hiệu nổi bật về sản phẩm vệ sinh nhà cửa, được nhiều người ưa chuộng nhờ lau sạch nhanh cùng hương thơm hoa hạ và bạc hà tươi mát, sảng khoái. Nước lau sàn Sunlight chai 1kg mang hương thơm dễ chịu cho không gian sống.',
            'Nước rửa chén Sunlight 750g' => 'Nước rửa chén Sunlight giúp khử mùi tanh trên chén dĩa chỉ với một lần rửa, đồng thời hỗ trợ diệt khuẩn hiệu quả. Nước rửa chén Sunlight chanh chai 750ml đánh bay dầu mỡ mạnh mẽ, là lựa chọn quen thuộc của nhiều gia đình.',
            'Nước tẩy Javel chai 1L' => 'Nước tẩy Javel giúp tẩy sạch những vết bẩn cứng đầu trên quần áo mà bột giặt khó làm sạch được. Nước tẩy hiệu quả tức thì, không tốn nhiều thời gian, giúp quần áo trắng sạch như mới.',
            'Bánh Oreo socola hộp 266g' => 'Với lớp kem socola thơm ngon, đậm vị mà không ngán, bánh socola pie Oreo hộp 266g là lựa chọn dinh dưỡng cho những ai yêu thích socola. Bánh Oreo có thể dùng làm quà hoặc ăn vặt cùng gia đình.',
            'Snack khoai tây vị tự nhiên 160g' => "Snack khoai tây vị tự nhiên Classic Lay's gói 160g là một sản phẩm snack nổi bật hàng đầu của thương hiệu Lay's, mang một hương vị cổ điển bởi đơn giản chỉ là sự kết hợp giữa khoai tây và gia vị đơn thuần, thơm ngon độc đáo. Snack Lay's được rất nhiều bạn trẻ đón nhận và sử dụng cho nhiều hoạt động.",
            'Kẹo Alpenliebe túi 120g' => 'Với hương vị ngọt ngào của sữa và hương caramen kết hợp hoàn hảo, kẹo sữa caramen Alpenliebe gói 120g có hương vị thơm ngon, hợp khẩu vị mọi lứa tuổi. Kẹo cứng Alpenliebe thơm ngon, ngọt và phù hợp để ăn vặt.',
            'Bánh Chocopie hộp 12 cái' => 'Bánh Chocopie với lớp socola béo, thơm mà không bị đắng phủ bên ngoài lớp bánh xốp mịn rất ngon. Kẹp giữa bánh là lớp kem marshmallow dẻo thơm. Bánh Chocopie Orion là thương hiệu từ Hàn Quốc, phù hợp dùng cho gia đình.',
            'Mì Hảo Hảo tôm chua cay 5 gói' => 'Mì ăn liền dai ngon hòa quyện trong nước súp tôm chua cay, đậm đà chính hãng mì Hảo Hảo, hương thơm quyến rũ. Mì Hảo Hảo vị tôm chua cay là lựa chọn hấp dẫn cho những ngày bận rộn cần bổ sung năng lượng nhanh chóng, đơn giản mà vẫn đủ chất.',
            'Gạo ST25 túi 5kg' => 'Gạo thơm ST25 túi 5kg là sản phẩm gạo sạch đóng túi chất lượng và uy tín đã được khẳng định trên thị trường, được nhiều gia đình lựa chọn sử dụng trong các bữa cơm hằng ngày. Cơm khi chín mang hương thơm nhẹ của lá dứa, hạt cơm mềm, dẻo dai vừa phải và có vị ngọt khi nhai.',
            'Dầu ăn Tường An chai 1L' => 'Dầu thực vật Tường An có công thức đặc biệt, kết hợp từ dầu đậu nành, dầu hạt cải và dầu olein. Dầu ăn Tường An chai 1 lít ngoài công dụng nấu nướng còn giúp bổ sung Omega 3, 6, 9 và vitamin A, E có lợi cho cơ thể.',
            'Đường Biên Hòa gói 1kg' => 'Đường Biên Hòa là thương hiệu sản xuất đường chất lượng, được sử dụng rất phổ biến hiện nay. Đường mía thượng hạng Biên Hòa gói 1kg làm từ mía không biến đổi gen, không sử dụng hóa chất tẩy trắng, đảm bảo an toàn cho sức khỏe người tiêu dùng.',
            'Xà lách lolo xanh 300g' => 'Xà lách lô lô là loại rau có hình dáng đặc biệt với lá mềm mại, cuộn chặt, có màu xanh tươi mát. Với cấu trúc lá lượn sóng, xà lách lô lô xanh không chỉ bắt mắt mà còn rất giòn và ngon khi ăn sống.',
            'Cá hồi cắt khúc 250g' => 'Cá hồi Nauy được tuyển chọn và cắt lọc kỹ lưỡng, loại bỏ xương và giữ lại phần nạc. Vị ngọt thanh khiết quyện cùng độ béo bùi dịu nhẹ, thớ thịt chắc mịn mang lại cảm giác tan chảy. Từng miếng cá có màu cam đỏ hoặc hồng đậm đặc trưng, là minh chứng cho chất lượng cá hồi tươi.',
            'Sữa đậu nành Fami lốc 6 hộp' => 'Lốc 6 hộp sữa đậu nành nguyên chất Fami 200ml là nguồn dinh dưỡng tốt cho trẻ, giúp tăng cường sức khỏe tim mạch và hệ miễn dịch. Sữa đậu nành Fami là thương hiệu sữa đậu nành hàng đầu tại Việt Nam, mang đến nguồn dinh dưỡng từ 100% đạm thực vật.',
            'Bánh gạo vị mặn gói 150g' => 'Bánh gạo giòn, thơm, ăn rôm rốp, phù hợp cho gia đình và có thể dùng cho bé từ 1 tuổi trở lên với liều lượng thích hợp. Bánh gạo One One vị tôm 150g có hương vị thơm ngon, lạ miệng, phù hợp để ăn vặt, thưởng trà hoặc làm quà biếu.',
            'Nho xanh không hạt hộp 500g' => 'Nho xanh không hạt là một loại trái cây được yêu thích nhờ hương vị ngọt ngào, mọng nước và sự tiện lợi khi không có hạt. Với màu sắc xanh tươi mát và hình dáng bầu dục hấp dẫn, nho xanh không hạt là món ăn ngon và mang lại nhiều lợi ích sức khỏe đáng kể.',
            'Dâu tây Đà Lạt hộp 250g' => 'Dâu tây là loại trái cây có vị chua, mùi thơm nhẹ, mọng nước. Dâu tây giống Mỹ được trồng tại Đà Lạt, đóng gói hộp giấy kỹ càng, đảm bảo trái dâu tươi ngon và không bị dập khi giao hàng. Dâu tây có thể ăn trực tiếp hoặc chế biến thành nhiều món ăn và nước uống ngon.',
            'Cá thu cắt lát 400g' => 'Cá thu cắt khoanh là một trong các loại cá biển được dùng làm nguyên liệu nấu ăn trong bữa ăn gia đình Việt. Cá có thịt thơm ngon, dồi dào nguồn đạm và chất béo có lợi cho sức khỏe. Cá thu được cắt thành các khoanh đều, rất tiện lợi để nấu nhiều món ngon hấp dẫn.',
            'Phô mai lát lốc 200g' => 'Phô mai lát Emborg Perfect Slices gói 200g cung cấp canxi và các dưỡng chất lên men tốt cho hệ miễn dịch và tiêu hóa của cơ thể, tạo nên hương vị thơm ngon cho các món ăn, khơi dậy vị giác và truyền cảm hứng nấu ăn.',
            'Mực ống làm sạch 400g' => 'Thưởng thức độ giòn ngọt của mực ống tươi ngon được đóng khay tiện lợi. Mực đã được làm sạch cơ bản, giúp tiết kiệm thời gian sơ chế. Với kích thước vừa phải, mực rất thích hợp để làm các món như mực chiên giòn, mực xào chua ngọt hay nhồi thịt sốt cà.',
            'Bí đỏ hồ lô 1kg' => 'Bí đỏ hồ lô hay còn gọi là bí đỏ hạt đậu, được biết đến là giống bí có ruột bên trong rất đặc cùng đặc điểm ít hạt, ăn khá dẻo và ngọt. Bí hồ lô còn chứa dồi dào các chất dinh dưỡng và mang lại nhiều lợi ích cho sức khỏe.',
            'Cam sành mọng nước túi 1kg' => 'Cam sành to quả, chắc, cầm nặng tay, có màu xanh bóng, vị ngọt thanh và thơm. Cam sành tươi, không bị dập, không bị thối, là trái cây nội có nguồn gốc xuất xứ rõ ràng.',
            'Coca-Cola lon lốc 6 lon' => 'Nước ngọt Coca-Cola là nước ngọt có gas mang hương vị đặc trưng, sảng khoái, giúp giải khát tức thì và tăng thêm hứng khởi trong mọi khoảnh khắc. Lốc 6 lon Coca-Cola 320ml thích hợp dùng kèm trong các bữa ăn và bữa tiệc.',
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
