window.slideNum = 1;

$(document).ready(function() {
	var reqType;
	var x;
	//$(document).onload(function(){
		x = document.getElementById("adminMain");
		if (x===null){
			startSlide();
		} 

	//});
	

		
	

	var email,pass;
   



	$("input[type='button']#existingClient").click(function(e){
		reqType = 1;
		return validateEmailandPassword("existing");
	});

	
	$("input[type='button']#newClient").click(function(e){
		reqType = 2;
		return validateEmailandPassword("new");
	});


	$("input[type='button']#adminLogin").click(function(e){
		reqType = 3;
		return validateEmailandPassword("admin");
	});



	$(document.getElementById("root-content")).click(function(e){
		
		if (e.target.className != "existing" &&
			e.target.className != "inputField" &&
			e.target.className != "hover underlined" &&
			e.target.className != "span12 text-center" &&
			e.target.className != "newmember" &&
			e.target.className != "background-image" &&
			e.target.className != "login-box span12" &&
			e.target.id != "inputField") {

			if (document.getElementById("pop-wrap").style.display == "block") {
			
				//close_login_pop();
				
			} 

		}
		

	});

	function checkError(arg){
		if (arg > 0) {
			return false;
		}
		return true;
	}

	




	function validateEmailandPassword(client) {
		var isValid = true;
		

		if ($("span.error").length) $("span.error").remove();

		var inputEmail, inputPassword, inputPasswordConfirm, username;

		if (client == "existing"){
			inputEmail = $("input#emailEx");
			inputPassword = $("input#passwordEx");
		} else if (client =="admin") {
			inputEmail = $("input#adminEmail");
			inputPassword = $("input#adminPass");
		}else {
			inputEmail = $("input#emailNew");
			inputPassword = $("input#passwordNew");
			inputPasswordConfirm = $("input#passwordNewConfirm");
		}
		
		if ( inputEmail.val() === "") {
			inputEmail.after("<span class='error'>Provide an email address. </br></span>");
			return false;
		}  

		if (!is_email(inputEmail.val())) {
			inputEmail.after("<span class='error'>Invalid format. </br></span>");
			return false;

		} if ( inputPassword.val().length < 8) {
			inputPassword.after("<span class='error'> password must be at least 8 character. </br></span>");
			
			return false;
		} if (client == "new" && inputPasswordConfirm.val().length < 8){
			$("section#passnew").after("<span class='error span'> this field cannot be empty </br></span>");
			return false;
		}	

		if (client == "new") {
			if (inputPassword.length >= 8 && (inputPassword != inputPasswordConfirm)) {
				$("section#passnew").after("<span class='error span'>Password must match</br></span>");
				return false;

			}
		}		

		if (reqType === 1){
            email=$("#emailEx").val();
        	pass=$("#passwordEx").val();
		} else if (reqType === 2) {
			email=$("#emailNew").val();
			pass=$("#passwordNew").val();
			username=$("#usernameNew").val();
		}else{
			email=$("#adminEmail").val();
			pass=$("#adminPass").val();
		}

		//alert("email: " + email + " pass: " + pass + " username: " + username);

		if (reqType===2) {
			$.post("/signup", {emailNew:email, password:pass, username:username}, function(data){
				if(data==='done')           
            {	
            	//alert(1);
                window.location.href="/profile";
            } else {
            	//alert(2);
            	if (x===null){
            		show_login_pop();
					
				} 
            	
            	isValid = false;

            }
			});

			return isValid;

		} else {

			$.post("/login",{email:email,pass:pass},function(data){        
	            if(data==='done')           
	            {	
	            	//alert(1);
	                window.location.href="/profile";
	            } else {
	            	//alert(2);
	            	if (x===null){
	            		show_login_pop();
						
					} 
	            	
	            	isValid = false;

	            }
	    	});


		return isValid;


		}


		
		

		
	
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
	
	if (slideNum > images.length) {
		slideNum = 1;
	} 
	for (i = 0; i < images.length; i++) {
	   images[i].style.display = "none";
	}
	images[slideNum-1].style.display = "block";
	setTimeout(startSlide, 10000);
}
