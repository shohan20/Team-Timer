<?php
function serverConnect(){
	
	$connection= mysqli_connect("localhost", "root", "rifat007");
	mysqli_select_db($connection,"team-timer");
	return $connection;
}
?>