<?php
include "connect.php";

$id = $_GET['id']; // Lấy ID từ thanh địa chỉ
$sql = "SELECT * FROM product WHERE Id = $id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productName = $_POST['ProductName'];
    $regularPrice = $_POST['RegularPrice'];
    $salePrice = $_POST['SalePrice'];
    $categoryName = $_POST['CategoryName'];
    $imageLink = $_POST['ImageLink'];
    $productLink = $_POST['ProductLink'];

    // Cập nhật dữ liệu
    $sql = "UPDATE product SET 
            ProductName = '$productName', 
            RegularPrice = '$regularPrice', 
            SalePrice = '$salePrice', 
            CategoryName = '$categoryName', 
            ImageLink = '$imageLink', 
            ProductLink = '$productLink' 
            WHERE Id = $id";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Cập nhật thành công!'); window.location='managepost.php';</script>";
    } else {
        echo "Lỗi: " . $conn->error;
    }
}
?>

<h2>Chỉnh sửa sản phẩm</h2>
<form method="POST">
    Tên SP: <input type="text" name="ProductName" value="<?= $row['ProductName'] ?>"><br><br>
    Giá gốc: <input type="number" name="RegularPrice" value="<?= $row['RegularPrice'] ?>"><br><br>
    Giá giảm: <input type="number" name="SalePrice" value="<?= $row['SalePrice'] ?>"><br><br>
    <button type="submit">Cập nhật</button>
</form>