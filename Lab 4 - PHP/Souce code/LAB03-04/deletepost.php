<?php
include "connect.php";

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Xóa dựa trên cột Id
    $sql = "DELETE FROM product WHERE Id = $id";
    
    if ($conn->query($sql) === TRUE) {
        header("Location: managepost.php");
    } else {
        echo "Lỗi khi xóa: " . $conn->error;
    }
}
?>