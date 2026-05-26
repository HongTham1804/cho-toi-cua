<?php
$host = "db"; // Trong Docker, hostname phải là tên service 'db'
$user = "root";
$pass = "";
$dbname = "dealcongnghe";

// Bạn cần thêm dấu ; ở cuối dòng này
$conn = mysqli_connect($host, $user, $pass, $dbname);

// Kiểm tra kết nối
if (!$conn) {
    die("Kết nối thất bại: " . mysqli_connect_error());
}

// Thiết lập font chữ tiếng Việt
mysqli_set_charset($conn, "utf8");
?>