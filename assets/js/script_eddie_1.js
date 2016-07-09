$(document).ready(function() {
	//alert(3);

	$("input[type='submit']#existingClient").click(function(e){
		
		return validateEmailandPassword("existing");
	});

	$("input[type='submit']#newClient").click(function(e){

		return validateEmailandPassword("new");
	});

	function validateEmailandPassword(client) {
		var isValid = true;

		if ($("span.error").length) $("span.error").remove();

		var inputEmail, inputPassword, inputPasswordConfirm;

		if (client == "existing"){
			inputEmail = $("input#emailEx").val();
			inputPassword = $("input#passwordEx").val();
		} else {
			inputEmail = $("input#emailNew").val();
			inputPassword = $("input#passwordNew").val();
			inputPasswordConfirm = $("input#passwordNewConfirm").val();
		}

		if ( inputEmail == "" && client =="existing") {
			$('input#emailEx').after("<span class='error'>Provide a username.</span>");
			isValid = false;

		} else if (inputEmail == "" && client =="new") {
			$('input#emailNew').after("<span class='error'>Provide a username.</span>");
			isValid = false;

		} else if ( containsReqChar(inputEmail) != 1  && client =="existing") {
			$('input#emailEx').after("<span class='error'>Invalid format</span>");
			isValid = false;

		} else if (containsReqChar(inputEmail) != 1  && client =="new") {
			$('input#emailNew').after("<span class='error'>Invalid format</span>");
			isValid = false;
		} 

		if ( inputPassword == "" && client =="existing"){
			$("input#passwordEx").after("<span class='error'>Provide a password.</span>");
			isValid = false;

		} else if (inputPassword == "" && client =="new") {
			$("input#passwordNew").after("<span class='error'>Provide a password.</span>");
			isValid = false;

		} else if ( inputPassword.length < 8 && client == "existing") {
			$("input#passwordEx").after("<span class='error'>Password must be at least 8 characters</span>");
			isValid = false;

		} else if (inputPassword.length < 8 && client =="new"){
			$("section#passnew").after("<span class='error span'>Password must be at least 8 characters</span>");
			isValid = false;
		}

		if (client == "new") {
			if (inputPassword.length >= 8 && (inputPassword != inputPasswordConfirm)) {
				$("section#passnew").after("<span class='error span'>Password must match</span>");
				isValid = false;

			}

		}

		return isValid;
	
	}

	function containsReqChar (email) {
		var foundAt = 0;

		for (i=0; i < email.length; i++){
			if (email[i] == "@") {
				foundAt++;
			} 
		}
		return foundAt;
	}

	function matchPassword (pw1, pw2) {
		if (pw1 == pw2) {
			return true;
		}

		return false;
	}
	
});