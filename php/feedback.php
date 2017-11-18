<?php
session_start();
include 'serverConnection.php';
$id=$_SESSION['id'];
$mental_health =$_POST['mental_health'];
$physical_health=$_POST['physical_health'];
$productivity=$_POST['productivity'];
$connection=serverConnect();
        //store feedback

/*
$stmt = $connection->prepare("insert into feedback(user_id,mental_health,physical_health,productivity) values(?,?,?,?)") or die("Failed to query database ".mysqli_error($connection));
$stmt->bind_param('ssss',$id,$mental_health,$physical_health,$productivity);
$stmt->execute();
*/
$result = mysqli_query($connection,"insert into feedback(user_id,mental_health,physical_health,productivity) values($id,$mental_health,$physical_health,$productivity)") or die("Failed to query database ".mysqli_error($connection));

?>