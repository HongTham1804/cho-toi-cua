<?php
  if (!empty($_POST['subjects'])) {
    $subs = $_POST['subjects'];
    echo "Bạn đã chọn: <ul>";
    foreach ($subs as $s) {
      echo "<li>$s</li>";
    }
    echo "</ul>";
  } else {
    echo "Bạn chưa chọn môn nào.";
  }
?>