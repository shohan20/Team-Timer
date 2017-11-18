<?php
/**
 * Created by PhpStorm.
 * User: shohan
 * Date: 11/1/2017
 * Time: 8:41 PM
 */
session_start();
include 'serverConnection.php';
$id=$_SESSION['id'];
//$id=6;

$health =$_POST['health'];
$connection=serverConnect();


$result = mysqli_query($connection,"update users set health = $health where id=$id") or die("Failed to query database ".mysqli_error($connection));

/*
$stmt = $connection->prepare("update users set health=? WHERE id=?") or die("Failed to query database ".mysqli_error($connection));
$stmt->bind_param('ss',$health,$id);
$stmt->execute();
*/


echo $health;