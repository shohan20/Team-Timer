$(document).ready(function(){
			
		$(".register").hide();
		$(".forget").hide();
		$("#account").click(function(){
			$(".login").hide();
			$(".register").show();
			$('h1#clog').html("Sign Up");
		});

		$("#login").click(function(){
			$(".register").hide();
			$(".login").show();
			$('h1#clog').html("login");
		});

		$("#flogin").click(function(){
			$(".forget").hide();
			$(".login").show();
		});


		$("#forget").click(function(){
			$(".login").hide();
			$(".forget").show();
		});
	});
 
  	