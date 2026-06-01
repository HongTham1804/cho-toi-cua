<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach ($this->descriptions() as $name => $description) {
            DB::table('products')
                ->where('name', $name)
                ->update(['description' => $description]);
        }
    }

    public function down(): void
    {
    }

    private function descriptions(): array
    {
        return [
            'Rau muống sạch bó 400g' => 'Rau muống nước được trồng và đóng gói theo những tiêu chuẩn nghiêm ngặt, bảo đảm các tiêu chuẩn xanh - sạch, chất lượng và an toàn với người dùng. Rau muống nước giòn, ngọt, chứa nhiều dinh dưỡng đặc biệt là sắt nên thường được sử dụng cho các món xào, luộc hoặc nhúng lẩu.',
            'Súp lơ xanh Đà Lạt 500g' => 'Bông cải xanh là một loại rau rất giàu dinh dưỡng có đầy đủ vitamin, khoáng chất, chất xơ và chất chống oxy hóa. Trong thành phần dinh dưỡng của bông cải xanh có 90% là nước, 7% carbohydrates, 3% protein và hầu như là không có chất béo.',
            'Cà chua Mộc Châu hộp 500g' => 'Cà chua là loại thực phẩm bổ dưỡng, thường được sử dụng để chế biến với nhiều món ăn ngon. Ngoài ra, với giá trị dinh dưỡng của mình, cà chua cũng được dùng để ăn sống hay áp dụng như một liệu pháp làm đẹp từ thiên nhiên.',
            'Táo Gala nhập khẩu túi 1kg' => 'Táo Gala là giống táo vỏ mỏng, nổi bật với màu đỏ tươi xen lẫn các đường sọc vàng. Có nguồn gốc từ New Zealand, loại quả này được yêu thích nhờ phần thịt màu vàng kem, giòn, nhiều nước và vị ngọt thanh.',
            'Mận hậu Sơn La hộp 500g' => 'Mận hậu Sơn La quả to giòn, có lớp da căng bóng. Bên ngoài quả mận có phủ một lớp phấn trắng đặc trưng. Khi bóp nhẹ có cảm giác hơi cứng chứ không bị dập nát. Vỏ quả mận có màu xanh khi còn non và chuyển sang đỏ tía như quả Cherry lúc chín. Hương vị chua thanh pha chút ngọt mát, chát nhẹ và có nhiều nước.',
            'Dưa leo baby túi 500g' => 'Dưa leo baby được trồng ứng dụng công nghệ cao, đảm bảo sản phẩm an toàn chất lượng, có vị đậm, giòn, ngọt. Dưa leo baby có kích thước nhỏ hơn các loại dưa leo khác, chỉ khoảng bằng ngón tay, màu xanh đậm, trái đều nhau, ăn có vị mát, ngọt đặc trưng. Dưa leo baby chứa nhiều vitamin và khoáng chất có tác dụng hỗ trợ giảm cân, ổn định huyết áp, cho hơi thở thơm mát và làm đẹp da.',
            'Cà rốt Đà Lạt 500g' => 'Cà rốt là một loại cây có củ, chứa nhiều vitamin A tốt cho mắt, giúp mắt sáng khỏe. Cà rốt có chứa một lượng phytochemical có đặc tính chống oxy hóa cùng beta-carotene và các carotenoid giúp thúc đẩy hệ miễn dịch. Nước ép cà rốt có thể hỗ trợ sức khỏe, tuy nhiên nên sử dụng ở mức vừa phải do có thể gây vàng da.',
            'Thịt bò Úc thái lát 300g' => 'Thịt bò Úc thái lát 300g là sản phẩm thịt bò nhập khẩu cao cấp được cắt lát mỏng bằng máy chuyên dụng, phổ biến nhất là phần ba chỉ, gầu bò hoặc vai bò chuyên dùng cho các món lẩu, nướng và xào. Sản phẩm được đóng khay 300g tiện lợi, hút chân không và cấp đông tiêu chuẩn để giữ nguyên độ tươi.',
            'Thịt thăn bò tươi 300g' => 'Thịt thăn bò tươi 300g là phần thịt cao cấp được cắt thái sẵn thành khẩu phần lý tưởng cho bữa ăn từ 1-2 người. Với cấu trúc thớ thịt nhỏ mềm mại đan xen vân mỡ nhẹ, sản phẩm mang lại vị ngọt đậm đà tự nhiên và độ mọng nước hoàn hảo khi chế biến. Đây là lựa chọn tuyệt vời cho các món áp chảo, làm steak sang trọng hay xào nhanh cho bữa cơm gia đình giàu dinh dưỡng.',
        ];
    }
};
