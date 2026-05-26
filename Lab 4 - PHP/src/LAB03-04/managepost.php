<?php
include "connect.php";
// Truy vấn dữ liệu từ bảng product
$sql = "SELECT * FROM product";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>DealCongNghe.Com</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: white; } /* Không tô màu xám nữa nhé */
        .header-nav { background-color: #222; padding: 10px; color: white; }
        .header-nav a { color: white; margin-right: 15px; text-decoration: none; }
        #footer { text-align: center; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header-nav">
        <strong>DealCongNghe.Com</strong>
        <span style="float: right;">
            <a href="managepost.php">Quản Lý Tin Đăng</a>
            <a href="createpost.php">Đăng Tin</a>
        </span>
    </div>

    <h2 style="text-align: center;">Quản lý tin đăng</h2>

    <table>
        <tr>
            <th>ID</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá Gốc</th>
            <th>Giá Giảm</th>
            <th>Danh Mục</th>
            <th>Link SP</th>
            <th>Thao tác</th>
        </tr>

        <?php
        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
        ?>
        <tr>
            <td><?= $row['Id'] ?></td>
            <td><?= $row['ProductName'] ?></td>
            <td><?= number_format((float)$row['RegularPrice'], 0, ',', '.') ?>đ</td>
            <td><?= number_format((float)$row['SalePrice'], 0, ',', '.') ?>đ</td>
            <td><?= $row['CategoryName'] ?></td>
            <td><a href="<?= $row['ProductLink'] ?>" target="_blank">Xem Link</a></td>
            <td>
                <a href="editpost.php?id=<?= $row['Id'] ?>">Sửa</a> | 
                <a href="deletepost.php?id=<?= $row['Id'] ?>" onclick="return confirm('Bạn có chắc muốn xóa?')">Xóa</a>
            </td>
        </tr>
        <?php
            }
        } else {
            echo "<tr><td colspan='7' align='center'>Không có dữ liệu</td></tr>";
        }
        ?>
    </table>

    <div id="footer">
        <p>All rights reserved by DealCongNghe.Com</p>
    </div>
</body>
</html>