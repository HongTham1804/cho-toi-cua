<?php
  if (isset($_GET['name']) && isset($_GET['gender'])) {
    $name = $_GET['name'];
    $gender = $_GET['gender'];
    echo "Chào bạn $name, giới tính: $gender";
  } else {
    echo "Vui lòng nhập đầy đủ thông tin.";
  }
?>