<?php
  if (isset($_POST['rate'])) {
    $rate = $_POST['rate'];
    echo "Bạn đã đánh giá: $rate sao";
  } else {
    echo "Vui lòng chọn mức đánh giá.";
  }
?>