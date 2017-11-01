<?php
function serverConnect(){
	
	$connection= mysqli_connect("localhost", "root", "abcd");
	mysqli_select_db($connection,"team-timer");
	return $connection;
}
?>