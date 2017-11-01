<?php
/**
 * Created by PhpStorm.
 * User: rifat
 * Date: 11/2/17
 * Time: 12:35 AM
 */

session_start();
include 'serverConnection.php';

//$id=$_SESSION['id'];

$id=6;

$status =$_POST['status'];
$connection=serverConnect();


$result = mysqli_query($connection,"update users set status = '$status' where id=$id") or die("Failed to query database ".mysqli_error($connection));


$result = mysqli_query($connection,"select * from users where id=$id") or die("Failed to query database ".mysqli_error($connection));


if(mysqli_num_rows($result)>0) {
    $row = mysqli_fetch_array($result);
    $team_id= $row['team_id'];
}else{
//    echo "error";
    die();
}

$jsonData= array();

$result = mysqli_query($connection,"select * from users where team_id=$team_id and id<>$id") or die("Failed to query database ".mysqli_error($connection));

while ($array = mysqli_fetch_row($result)) {

    $jsonData[] = $array;
}

echo json_encode($jsonData)."\n";

//echo $team_id

