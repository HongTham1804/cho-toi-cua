-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 10, 2021 at 07:23 AM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dealcongnghe`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `RegularPrice` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `SalePrice` float NOT NULL,
  `CategoryName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ImageLink` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ProductLink` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Id`, `ProductName`, `RegularPrice`, `SalePrice`, `CategoryName`, `ImageLink`, `ProductLink`) VALUES
(1, 'Điện Thoại Vsmart Star - Hàng chính hãng', '1990000', 1990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/db/0b/2d/57acd3a9e48929a3ee220f9784014687.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-vsmart-star-hang-chinh-hang-p31322859.html&utm_source=uit'),
(2, 'Điện Thoại Xiaomi Redmi 8A (2GB/32GB) - Hàng Chính Hãng', '3490000', 3490000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/db/3f/bd/f3118db1403426192e088304f89156eb.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-xiaomi-redmi-8a-2gb-32gb-hang-chinh-hang-p35770986.html&utm_source=uit'),
(3, 'Điện Thoại Vivo Y15 (4GB / 64GB) - Hàng Chính Hãng', '4990000', 4990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/b0/94/87/6e4ceaf54b4adc8021d25dec84ec2027.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-vivo-y15-4gb-64gb-hang-chinh-hang-p16256385.html&utm_source=uit'),
(4, 'Điện thoại Wiko View Max (3GB/32GB) - Hàng chính hãng ', '2999000', 2999000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/83/d9/5f/e3845212046e2ebb641cfd17e3adba18.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-wiko-view-max-3gb-32gb-hang-chinh-hang-p6714339.html&utm_source=uit'),
(5, 'Điện Thoại Samsung Galaxy A01 (16GB/2GB) - Hàng Chính Hãng', '2790000', 2790000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/4d/94/81/431e8b4d197f263a609445dea6e86932.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-samsung-galaxy-a01-16gb-2gb-hang-chinh-hang-p48307567.html&utm_source=uit'),
(6, 'Điện Thoại  Realme C3i (2GB/32G) - Hàng Chính Hãng', '2590000', 2590000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/8e/b8/96/fb70ed1a9fc362fb362d14afa79947c2.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-realme-c3i-2gb-32g-hang-chinh-hang-p52342723.html&utm_source=uit'),
(7, 'Điện Thoại Vsmart Joy 3 - Hàng chính hãng', '3290000', 3290000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/f8/be/3d/1bf91f7f46d1fff3f1b8f2e92c7e559d.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-vsmart-joy-3-hang-chinh-hang-p48524359.html&utm_source=uit'),
(8, 'Điện Thoại OPPO A5s - Hàng Chính Hãng', '3990000', 3990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/fc/9e/99/0b70ce137107abf42cc44cd66bfa0e83.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-oppo-a5s-hang-chinh-hang-p15674844.html&utm_source=uit'),
(9, 'Điện Thoại Realme C3 - Hàng Chính Hãng', '2990000', 2990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/32/79/a9/d7d3e3f4e009f1ee63400a52cac553ff.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-realme-c3-hang-chinh-hang-p49917539.html&utm_source=uit'),
(10, 'Điện thoại Xiaomi Redmi 8 (3GB/32GB) - Hàng chính hãng', '2690000', 2690000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/d4/6f/4b/653de9f4fe221e96a1eaa53602c7d326.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-xiaomi-redmi-8-3gb-32gb-hang-chinh-hang-p53826923.html&utm_source=uit'),
(11, 'Điện Thoại Xiaomi Redmi 7 (2GB/16GB) - Hàng Chính Hãng', '2990000', 2990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/39/c7/7f/f158a3c28221be8cbeee8739edc433ee.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-xiaomi-redmi-7-2gb-16gb-hang-chinh-hang-p12486509.html&utm_source=uit'),
(12, 'Điện Thoại Realme 3 - Hàng Chính Hãng', '4290000', 4290000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/8a/af/e1/5d48c270d1de1f5d86c315ff3fee57c6.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-realme-3-hang-chinh-hang-p13292623.html&utm_source=uit'),
(13, 'Điện thoại Xiaomi Redmi 8 + Balo Xiaomi Casual DayPack (Màu ngẫu nhiên) - Hàng Chính Hãng', '3790000', 3790000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/2d/ba/46/572ae46634210cc1c0569b5e42aca450.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-xiaomi-redmi-8-balo-xiaomi-casual-daypack-mau-ngau-nhien-hang-chinh-hang-p52671785.html&utm_source=uit'),
(14, 'Điện Thoại OPPO A3s (16GB/2GB) - Hàng Chính Hãng', '3690000', 3690000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/cb/e2/06/c818dd07d700a442119008ffa60e026a.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-oppo-a3s-16gb-2gb-hang-chinh-hang-p4061523.html&utm_source=uit'),
(15, 'Điện Thoại Samsung Galaxy Note 4 - Hàng Nhập Khẩu', '17990000', 17990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/2/5/2579948_tinhte_samsung_galaxy_note_4-14_1.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-samsung-galaxy-note-4-hang-nhap-khau-p111950.html&utm_source=uit'),
(16, 'Điện Thoại Vivo Y12 (32GB/3GB) - Hàng Chính Hãng', '3390000', 3390000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/ab/71/b7/04bc89d204eb1c576e9f1df345c7ae28.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-vivo-y12-32gb-3gb-hang-chinh-hang-p31542544.html&utm_source=uit'),
(17, 'Điện Thoại Realme 5 (3GB/32GB) - Hàng Chính Hãng', '3990000', 3990000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/40/ea/20/d2f98ff5150c4f8968cc638b1cfae69b.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-realme-5-3gb-32gb-hang-chinh-hang-p43174694.html&utm_source=uit'),
(18, 'Điện Thoại Bluboo Dual (16GB/2GB) - Hàng Chính Hãng', '4590000', 4590000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/4/_/4.u2751.d20170602.t162705.527355.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-bluboo-dual-16gb-2gb-hang-chinh-hang-p658538.html&utm_source=uit'),
(19, 'Điện Thoại Wiko Y60 (1GB/16GB) - Hàng chính hãng', '1390000', 1390000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/a1/82/d1/ab7fcd12286579804a3191fe40f03388.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-wiko-y60-hang-chinh-hang-p37601844.html&utm_source=uit'),
(20, 'Samsung Galaxy Note 4 32GB Trắng - Hàng nhập khẩu', '3490000', 3490000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/b7/8f/49/b13d445962564169c18427a72b06338d.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fsamsung-galaxy-note-4-32gb-trang-hang-nhap-khau-p19556261.html&utm_source=uit'),
(21, 'Điện thoại Wiko Jerry 4 - Hàng Chính Hãng', '1790000', 1790000, 'Điện Thoại - Máy Tính Bảng/Điện thoại Smartphone', 'https://salt.tikicdn.com/cache/280x280/ts/product/cb/5b/4a/3f00ddb06b2a0f1747730fbc69c31f44.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-wiko-jerry-4-hang-chinh-hang-p19912999.html&utm_source=uit'),
(22, 'Máy Tính Bảng Kindle Fire HD8 (8th) 16GB (2019) - Hàng Chính Hãng', '2990000', 2990000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/ts/product/42/8b/3c/7e5b8c460fe4446ab529b8d7516a7821.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-kindle-fire-hd8-8th-16gb-2019-hang-chinh-hang-p7184855.html&utm_source=uit'),
(23, 'Máy Tính Bảng Kindle Fire HD7 Kids Edition - Proof Case (16GB) - Hàng Chính Hãng', '2990000', 2990000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/ts/product/5c/52/cc/cd4fa11102863262b2500c0079207f29.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-kindle-fire-hd7-kids-edition-proof-case-16gb-hang-chinh-hang-p10067986.html&utm_source=uit'),
(24, 'Máy Tính Bảng Masstel Tab 10 Plus - Hàng Chính Hãng', '2790000', 2790000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/ts/product/83/ef/3d/cf84079999158443520d4d8962a37839.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-masstel-tab-10-plus-hang-chinh-hang-p11627000.html&utm_source=uit'),
(25, 'Máy tính bảng Mobell Tab 10 - Hàng chính hãng', '2750000', 2750000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/ts/product/74/0a/63/320bf82502d0988ba21591f5441ee261.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-mobell-tab-10-hang-chinh-hang-p19791121.html&utm_source=uit'),
(26, 'Máy Đọc Sách Kindle 2018 (8th) - Trắng - Hàng chính hãng', '2790000', 2790000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/1/_/1.u5618.d20170823.t183147.991597.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-doc-sach-kindle-2018-8th-trang-hang-chinh-hang-p841448.html&utm_source=uit'),
(27, 'Máy tính bảng Masstel Tab 7 Plus Kidzone - Hàng chính hãng', '1700000', 1700000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/ts/product/2d/d6/24/eb24091b5ec173c1bb99e5540243f238.png', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-masstel-tab-7-plus-kidzone-hang-chinh-hang-p48899638.html&utm_source=uit'),
(28, 'Máy Tính Bảng Mobell Tab 7S (8GB) - Hàng Chính Hãng', '1990000', 1990000, 'Điện Thoại - Máy Tính Bảng/Máy tính bảng', 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/1/_/1.u4064.d20170426.t115242.448874.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fmay-tinh-bang-mobell-tab-7s-8gb-hang-chinh-hang-p625684.html&utm_source=uit'),
(29, 'Điện Thoại Bàn Không Dây Panasonic KX-TGC410 - Hàng Chính Hãng', '1740000', 1740000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/93/0e/e1/ba7c657c02f03b12349595c2da9e61a8.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgc410-hang-chinh-hang-p21317030.html&utm_source=uit'),
(30, 'Điện thoại bàn không dây Panasonic KX-TGD310 - Hàng Chính Hãng', '1870000', 1870000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/c7/a1/73/79e54ec11e29656703784d7ad6eeae22.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgd310-hang-chinh-hang-p11251770.html&utm_source=uit'),
(31, 'Điện thoại bàn không dây Panasonic KX-TGD312 - Hàng Chính Hãng', '2189000', 2189000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/89/54/f7/30ab541c229501e179bb3788eba97b3b.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgd312-hang-chinh-hang-p11251711.html&utm_source=uit'),
(32, 'Điện Thoại Bàn Panasonic KXTGC313CX - Hàng Chính Hãng', '1950000', 1950000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/9a/21/90/9d6c45c7d6a52a4dafe96bfc749484d4.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-panasonic-kxtgc313cx-hang-chinh-hang-p4064449.html&utm_source=uit'),
(33, 'Điện Thoại IP Grandstream GXP1620 - Hàng Chính Hãng', '1290000', 1290000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/ca/3f/46/39ed27d8db412b24419b361cb8474c9c.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ip-grandstream-gxp1620-hang-chinh-hang-p8129371.html&utm_source=uit'),
(34, 'Điện thoại bàn cố định không dây lắp các loại sim cố định, di động Viettel, Mobi, Vina...', '1500000', 1500000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/b7/d5/28/8c26bc416119b07309fe164d8a923140.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-co-dinh-khong-day-lap-cac-loai-sim-co-dinh-di-dong-viettel-mobi-vina-p38309582.html&utm_source=uit'),
(35, 'Điện thoại bàn không dây Panasonic KX-TGC412 - Hàng Chính Hãng', '1850000', 1850000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/20/e5/eb/ba9cba81b41bcc27f1359707ceb7fe18.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgc412-hang-chinh-hang-p21466227.html&utm_source=uit'),
(36, 'Điện Thoại Bàn Panasonic KXTGD312CX - Hàng Chính Hãng', '1849000', 1849000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/c8/0d/31/7af7bde6ad6f87c28ad12ddc1aa02434.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-panasonic-kxtgd312cx-hang-chinh-hang-p4065031.html&utm_source=uit'),
(37, 'Điện thoại bàn không dây Panasonic KX-TGC313 - Hàng Chính Hãng', '2000000', 2000000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/d4/7e/c9/72e19580d556fa02d030cc6e77d1c6fd.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgc313-hang-chinh-hang-p23142193.html&utm_source=uit'),
(38, 'Điện thoại bàn không dây Panasonic KX-TGD310 - Hàng Chính Hãng', '1290000', 1290000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/b4/cd/22/6d14756586378fb181906058dafc00fd.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-khong-day-panasonic-kx-tgd310-hang-chinh-hang-p23181426.html&utm_source=uit'),
(39, 'Điện thoại bàn cổ điển DT76', '2500000', 2500000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/69/9a/3c/b588598b4b144f3b40de55afc0f72178.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ban-co-dien-dt76-p52406983.html&utm_source=uit'),
(40, 'Điện thoại IP SIP Panasonic KX-HDV130 - Hàng chính hãng', '1100000', 1100000, 'Điện Thoại - Máy Tính Bảng/Điện thoại bàn', 'https://salt.tikicdn.com/cache/280x280/ts/product/1d/b0/3c/4552a091b2d9895432705a27387ea69f.jpg', 'https://pub.accesstrade.vn/deep_link/4482328498044633048?url=https%3A%2F%2Ftiki.vn%2Fdien-thoai-ip-sip-panasonic-kx-hdv130-hang-chinh-hang-p53642202.html&utm_source=uit');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
