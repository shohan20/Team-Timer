<?php
session_start();
if($_SESSION['newReg']=="true"){
    $_SESSION['newReg']="false";
    echo "true";
}
else{
    echo "false";
}
?>