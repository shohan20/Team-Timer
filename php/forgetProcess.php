<?php
session_start();
function sendVerificationBySwift($email,$name,$password)
{
    require_once '../lib/swift_required.php';

    $subject = '[PickaJob][Forget password]'; // Give the email a subject
    
    $body = 'Dear '.$name.',

   	Your PickaJob password is "'.$password.'"';

        $transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, "ssl")
            ->setUsername('dujobportal@gmail.com')
            ->setPassword('dujobportal1#')
            ->setEncryption('ssl');

        $mailer = Swift_Mailer::newInstance($transport);

        $message = Swift_Message::newInstance($subject)
            ->setFrom(array('noreply@pickajob.com' => 'PickaJob'))
            ->setTo(array($email))
            ->setBody($body);

        $result = $mailer->send($message);
}

	
	include 'serverConnection.php';
	$connection=serverConnect();
	$email =$_POST['email'];
	$result = mysqli_query($connection,"select * from users where email='$email' or username='$email'") or die("Failed to query database ".mysqli_error($connection));
	$row =mysqli_fetch_array($result);
	if($row['email']==$email){
		sendVerificationBySwift($row['email'],$row['username'],$row['password']);
		echo "true";
	}
	else{
		echo "false";
	}

?>
