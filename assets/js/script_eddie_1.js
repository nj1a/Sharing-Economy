window.slideNum = 1;

$(document).ready(function() {

	startSlide();

	$("input[type='submit']#existingClient").click(function(e){
				
		return validateEmailandPassword("existing");
	});

	$("input[type='submit']#newClient").click(function(e){

		return validateEmailandPassword("new");
	});

	$(document.getElementById("root-content")).click(function(e){
		//alert(e.target.class);
	
		if (e.target.className != "existing" &&
			e.target.className != "inputField" &&
			e.target.className != "hover underlined" &&
			e.target.className != "span12 text-center" &&
			e.target.className != "newmember" &&
			e.target.className != "background-image" &&
			e.target.className != "login-box span12" &&
			e.target.id != "inputField") {

			if (document.getElementById("pop-wrap").style.display == "block") {
			
				close_login_pop();
				
			} 

		}
		

	});

	function validateEmailandPassword(client) {
		var isValid = true;

		if ($("span.error").length) $("span.error").remove();

		var inputEmail, inputPassword, inputPasswordConfirm;

		if (client == "existing"){
			inputEmail = $("input#emailEx").val();
			//alert(inputEmail);
			inputPassword = $("input#passwordEx").val();
		} else {
			inputEmail = $("input#emailNew").val();
			inputPassword = $("input#passwordNew").val();
			inputPasswordConfirm = $("input#passwordNewConfirm").val();
		}

		if ( inputEmail == "" && client =="existing") {
			$('input#emailEx').after("<span class='error'>Provide a username.<br></span>");
			isValid = false;

		} else if (inputEmail == "" && client =="new") {
			$('input#emailNew').after("<span class='error'>Provide a username.<br></span>");
			isValid = false;

		} else if ( is_email(inputEmail) != true && client =="existing") {
			
			$('input#emailEx').after("<span class='error'>Invalid format<br></span>");
			isValid = false;

		} else if (is_email(inputEmail) != true  && client =="new") {
			$('input#emailNew').after("<span class='error'>Invalid format<br></span>");
			isValid = false;
		} 

		if ( inputPassword == "" && client =="existing"){
			$("input#passwordEx").after("<span class='error'>Provide a password.<br></span>");
			isValid = false;

		} else if (inputPassword == "" && client =="new") {
			$("section#passnew").after("<span class='error span'>Provide a password.<br></span>");
			isValid = false;

		} else if ( inputPassword.length < 8 && client == "existing") {
			$("input#passwordEx").after("<span class='error'>Password must be at least 8 characters<br></span>");
			isValid = false;

		} else if (inputPassword.length < 8 && client =="new"){
			$("section#passnew").after("<span class='error span'>Password must be at least 8 characters<br></span>");
			isValid = false;
		}

		if (client == "new") {
			if (inputPassword.length >= 8 && (inputPassword != inputPasswordConfirm)) {
				$("section#passnew").after("<span class='error span'>Password must match<br></span>");
				isValid = false;

			}

		}

		return isValid;
	
	}

	function is_email(email) {
		
		var regex = new RegExp("([a-zA-Z0-9]*)([@]{1})([a-zA-Z0-9]*)");
		return regex.test(email);

	}

	function matchPassword (pw1, pw2) {
		if (pw1 == pw2) {
			return true;
		}

		return false;
	}
	
});


function show_login_pop(){
	document.getElementById("pop-wrap").style.display = "block";
}

function show_sign_pop(){
	document.getElementById("pop-wrap").style.display = "block";
}

function close_login_pop() {
	document.getElementById("pop-wrap").style.display = "none";
}

function close_sign_pop() {
	document.getElementById("pop-wrap").style.display = "none";
}

function startSlide(){
	var i;
	slideNum += 1;
	var images = document.getElementsByClassName("background-image");
	//alert(slideNum);
	if (slideNum > images.length) {
		slideNum = 1;
	} 
	for (i = 0; i < images.length; i++) {
	   images[i].style.display = "none";
	}
	images[slideNum-1].style.display = "block";
	setTimeout(startSlide, 10000);
}
