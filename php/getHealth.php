<?php
/**
 * Created by PhpStorm.
 * User: shohan
 * Date: 11/1/2017
 * Time: 8:49 PM
 */
session_start();
include 'serverConnection.php';
$id=$_SESSION['id'];
$connection=serverConnect();
$stmt = $connection->prepare("select * from users where  id=?") or die("Failed to query database ".mysqli_error($connection));
$stmt->bind_param('s',$id);
$stmt->execute();
$result = $stmt->get_result();
if(mysqli_num_rows($result)>0) {
    $row = mysqli_fetch_array($result);
    echo $row['health'];
}