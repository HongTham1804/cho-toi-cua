<?php
  $h = date("H");
  if ($h < 12) {
    echo "Chào buổi sáng!";
  } elseif ($h < 18) {
    echo "Chào buổi chiều!";
  } else {
    echo "Chào buổi tối!";
  }
?>