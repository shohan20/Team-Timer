<?php
session_start();
	if(isset($_POST['submit'])){
	include 'serverConnection.php';
	$connection=serverConnect();
	$username=$_POST['username'];
	$email =$_POST['remail'];
	$password = SHA1($_POST['password']);
	$team_id=$_POST['team-id'];

	$result = mysqli_query($connection,"select * from users where email='$email'") or die("Failed to query database ".mysqli_error($connection));
	$row =mysqli_fetch_array($result);
	if($row['email']==$email){
        echo "The Email has already been used";
	}
	else{
	$stmt = $connection->prepare("insert into users(name,email,password,team_id) values(?,?,?,?)") or die("Failed to query database ".mysqli_error($connection));
	$stmt->bind_param('ssss',$username,$email,$password,$team_id);
	$stmt->execute();
		$_SESSION['newReg']="true";
		header("location: ../login.html");
	}
	}
?>
