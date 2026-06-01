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
    }
};
