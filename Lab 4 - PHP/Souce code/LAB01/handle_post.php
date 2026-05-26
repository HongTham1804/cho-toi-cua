<?php
  if (isset($_POST['email'])) {
    $email = $_POST['email'];
    echo "Email bạn vừa nhập là: " . $email;
  } else {
    echo "Chưa nhập email.";
  }
?>