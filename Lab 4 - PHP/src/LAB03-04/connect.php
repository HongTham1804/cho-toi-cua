<?php
include "connect.php"; // Kết nối CSDL

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form
    $productName = $_POST['ProductName'];
    $regularPrice = $_POST['RegularPrice'];
    $salePrice = $_POST['SalePrice'];
    $categoryName = $_POST['CategoryName'];
    $imageLink = $_POST['ImageLink'];
    $productLink = $_POST['ProductLink'];

    // Câu lệnh SQL để thêm sản phẩm
    $sql = "INSERT INTO product (ProductName, RegularPrice, SalePrice, CategoryName, ImageLink, ProductLink) 
            VALUES ('$productName', '$regularPrice', '$salePrice', '$categoryName', '$imageLink', '$productLink')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Thêm sản phẩm thành công!'); window.location='managepost.php';</script>";
    } else {
        echo "Lỗi: " . $conn->error;
    }
}
?>

<h2>Đăng tin sản phẩm mới</h2>
<form method="POST" action="">
    Tên sản phẩm: <input type="text" name="ProductName" required><br><br>
    Giá gốc: <input type="number" name="RegularPrice"><br><br>
    Giá giảm: <input type="number" name="SalePrice"><br><br>
    Danh mục: <input type="text" name="CategoryName"><br><br>
    Link ảnh: <input type="text" name="ImageLink"><br><br>
    Link sản phẩm: <input type="text" name="ProductLink"><br><br>
    <button type="submit">Lưu sản phẩm</button>
</form>