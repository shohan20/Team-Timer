<?php
	session_start();
	include 'serverConnection.php';
	$email =$_POST['email'];
	$password = SHA1($_POST['password']);
	$connection=serverConnect();
	//$connection= mysqli_connect("localhost", "root", "abcd");
	$stmt = $connection->prepare("select * from users where  email=?  and password=?") or die("Failed to query database ".mysqli_error($connection));
		$stmt->bind_param('ss',$email,$password);
	$stmt->execute();
	$result = $stmt->get_result();
	/*$result = mysqli_query($connection,"select * from users where  (email='$email' or username='$email') and password='$password'") or die("Failed to query database ".mysqli_error($connection));*/
	if(mysqli_num_rows($result)>0){
	$row =mysqli_fetch_array($result);
	if(($row['email']==$email ) && $row['password']==$password){

		$_SESSION['id']=$row['id'];
		$_SESSION['email']=$row['email'];
        $_SESSION['username']=$row['name'];
        $_SESSION['team-id']=$row['team_id'];
        echo "true";
	}
	else
		echo "Failed to login";
	}
	else
		echo "Failed to login";
?>
