<?php
function serverConnect(){
	
	$connection= mysqli_connect("localhost", "root", "");
	mysqli_select_db($connection,"team-timer");
	return $connection;
}
?>