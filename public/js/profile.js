$(document).ready(function(){

	var navs = document.getElementsByClassName("main-nav-button");
	var info = document.getElementsByClassName("profile-info");
	var disabledBox = document.getElementsByClassName("edit-disable");
	var editButtons =document.getElementsByClassName("edit-img");



	for (i=0; i < editButtons.length+1; i++) {

		$("#edit-button" + i).click(function(event){
			var curr = this.id.substring(11);
			
			$("#newEmailError").html(" ");
			enableEdit(disabledBox, curr);			
		});
	}

	for (i=1; i < navs.length+1; i++){


		$("a#nav" + i).click(function(event){
			var curr = this.id.substring(3);
			
			processMenu(curr, navs);
			if (navs.length === 4 && curr === '3') {
				listInfo(4, info);
			} else if (navs.length === 4 && curr === '4'){
				listInfo(5, info);
			} else if (navs.length === 3 && curr == '3'){
				listInfo(curr, info);
				listFriends();
			}  else {
				listInfo(curr, info);
			}
		});
	}
	

	$("#cpw").on("input", function(event){
		if($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && event.target.value.length >0 &&
			$("#ncpw").val() == $('#npw').val() ) {
				$("#updatePW").attr("disabled", false);
		} else {
			$("#updatePW").attr("disabled", true);
		}
	});

	$("#npw").on("input", function(event) {
		if (event.target.value != $("#ncpw").val() && $("#ncpw").val().length != 0 && event.target.value.length != 0 ) {
			
			$(".error.pw").html("password must match!");
			$("#updatePW").attr("disabled", true);
		} else {
			$(".error.pw").html(" ");
			if ($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && $('#cpw').val().length >0){
				$("#updatePW").attr("disabled", false);
				
			}
		}
	}); 

	$("#ncpw").on("input", function(event) {
		if (event.target.value != $("#npw").val() && $("#npw").val().length != 0 && event.target.value.length != 0) {	
			$("#updatePW").attr("disabled", true);		
			$(".error.pw").html("password must match!");
		} else {
			$(".error.pw").html(" ");
			if ($("#npw").val().length > 0 && $("#ncpw").val().length > 0 && $('#cpw').val().length >0){
				$("#updatePW").attr("disabled", false);
				
			}
		}
	});


});

function enableEdit(disabledBox, i){
	var actionURL;
	var input_type;
	var input_name;
	var input_value;
	switch (i) {
		case "1":
			actionURL = "/update_email";
			input_type = "email";
			input_name = "newEmailValue";
			placeholder = "Email Address";
			
			break;
		case "2":
			actionURL = "/update_name";
			input_type = "text";
			input_name = "newNameFirst";
			placeholder = "First Name";
			
		case "3":
			actionURL = "/update_address";
			input_type = "text";
			input_name = "newCity";
			placeholder = "city";
			break;
		case "4":
			actionURL = "/update_phone";
			input_type = "text";
			input_name = "newPhone";
			placeholder = "phone number...";
			break;
		case "5":
			actionURL = "/update_dob";
			input_type = "text";
			input_name = "newDOB";
			placeholder = "Day-Month-Date-Year";
			break;
		case "6":
			actionURL = "/update_gender";
			input_type = "text";
			input_name = "newGender";
			placeholder = "Enter M or F or O";
			break;
		case "7":
			actionURL = "/update_desc";
			input_type = "text";
			input_name = "newDesc";
			placeholder = "Description....";
			break;		
		default:
			alert("not catched");
	}


	disabledBox[i-1].className += " hidden";
	$('<div>', {
		'class': "edit-enable" + i
	}).appendTo(".edit-box.e" + i);

	$('<form>', {
		'class': "edit-value" + i,
		'action': actionURL,
		'method': "post"
	}).appendTo(".edit-enable" + i);

	$('<div>', {
		'class': "input-zone" + i
	}).appendTo(".edit-value"+i );

	if(i != "7") {

	$('<input>', {
		'class': "new-input" + i,
		'name': input_name,
		'type': input_type,
		'placeholder': placeholder
	}).appendTo(".input-zone" + i);
    }else {
    	$('<textarea>', {
		'class': "new-input" + i,
		'id': "textareaform",
		'name': input_name,
		'type': input_type,
		'placeholder': placeholder
	}).appendTo(".input-zone" + i);

    	$('</br>').appendTo(".input-zone" + i);

    	$('<p>', {
    		'class': "counter",
    		html: "/256"
    	}).appendTo(".input-zone" + i);

    	$('</br>').appendTo(".input-zone" + i);

    }

	if (i == "2") {
		$('<input>', {
		'class': "new-input" + i,
		'name': "newNameLast",
		'type': input_type,
		'placeholder': 'Last Name'	
		 }).appendTo(".input-zone" +i);

	} else if (i =="3") {
		$('<input>', {
		'class': "new-input" + i,
		'name': "newCountry",
		'type': input_type,
		'placeholder': 'country'
		 }).appendTo(".input-zone" + i);
	}
	
	$('<input>', {
		'class': "new-input-button" + i,
		'type': "submit",
		'value' : "Update"
	}).appendTo(".input-zone" + i);

	$('<input>', {
		'class': "new-input-cancel" + i,
		'type': "button",
		'value' : "cancel"
	}).appendTo(".input-zone" + i);

	
	$(".new-input-cancel"+ i).click(function(){
		
		disabledBox[i-1].className = "edit-disable";
		$("#newValueError" + i).html(" ");
		$(".edit-enable" + i).remove();
	});

	$(".new-input1").on("input", function(event) {
		
		if (event.target.value == $(".email-value").html()) {
			$("#newEmailError").html("New email address must be different from the previous one.");
			$(".new-input-button").attr("disabled", true);
		} else {
			$(".new-input-button").attr("disabled", false);
			$("#newEmailError").html(" ");
		}
	});

	$(".new-input2").on("input", function(event) {
		var usrRegex = new RegExp("^[a-zA-Z0-9äöüÄÖÜ]*$");
		if (usrRegex.test(event.target.value)) {
			$("#newNameError").html(" ")
			$(".new-input-button2").attr("disabled", false);
		} else {
			$("#newNameError").html("Special characters are not allowed.")
			$(".new-input-button2").attr("disabled", true);
		}
	});

	$(".new-input7").on("input", function(event){
		$(".counter").html(event.target.value.length + "/256");
		if (event.target.value.length <= 256){
			$("#newDescError").html( " ");
			$(".new-input-button7").attr("disabled", false);
		} else {
			$("#newDescError").html( "You have reached maximum number of characters!!");
			$(".new-input-button7").attr("disabled", true);
		}

	});


	
}

function processMenu(n, menu){
	for (i=0; i < menu.length; i++){
		menu[i].className = "main-nav-button";
	}
	
	menu[n-1].className += " selected";

}

function listInfo(n, info){
	for (i=0; i < info.length; i++){
		info[i].className = "profile-info";
	}
	if (n==1) {
		info[0].className += " selected";
		

	} else if (n==2){
		info[1].className += " selected";
		

	} else if (n==3){
		
		info[2].className += " selected";
		
	} else if (n==4){
		info[3].className += " selected";

	} else if (n==5){
		info[4].className += " selected";
	}
}

function listFriends(){
	$("#resultField").remove();
	$('<div>', {
		"id":"resultField",
		
	}).appendTo("#resultWrap");

	$('<ul>', {
		"class":"flt_l w50p",
		"id":"left_column"
	}).appendTo("#resultField");

	/*$('<ul>', {
		"class": "flt_l w50p"	
	}).appendTo("#resultField");*/

	/*$('<>', {
				"class":
			}).appendTo();*/


	var usr = $(".username-field").html();
	
	$.get("/getFriends/" + usr,  function(result){
		for(i=0; i < result.length ; i++) {

			$('<li>', {
				"class": "fr-pro-wrap b_p_50",
				"id": "usr_" + i
			}).appendTo("#left_column");

			$('<form>', {
				"action": "/profile/a",
				"id": "prof_" + i
			}).appendTo("#usr_" + i);

			$('<div>', {
				"class": "picture" ,
				"id": "pic-container" + i
			}).appendTo("#prof_" + i);



			$('<img>', {
				"class": "profile_pic",
				"src": result[i].pic

			}).appendTo("#pic-container" + i);

			$('<div>', {
				"class": "acc-info" ,
				"id": "acc" + i
			}).appendTo("#prof_" + i);

			$('<input>', {
				"class": "submitButton",
				"id": "submitButton_" + i,
				"value": result[i].username
			}).appendTo("#acc" + i);

			$('<input>', {
				"class": "removeButton " + result[i].user_id,
				"id": "removeButton_" + i,
				"value": "unfriend " + result[i].username
			}).appendTo("#acc" + i);


			
		}
		var submitButtons = document.getElementsByClassName("submitButton");

		var removeButtons = document.getElementsByClassName("removeButton");
		

		for (i=0; i < submitButtons.length; i++){

			$("#submitButton_" + i).click(function(event){

				$.get("/viewusr/" + event.target.value, function(data){
					if (data==="good"){
						window.location.href="/showusr";
					}
				});
			});
		
		}

		for (i=0; i < removeButtons.length; i++){

			$("#removeButton_" + i).click(function(event){
				var username= this.className.substring(13);
				//alert(username);
				$.get("/removeFriend/" + username, function(data){
					
					//alert(data);	
					if (data==="good"){
						window.location.href="/profile";
					}
				});
			});
		
		}
	});
}
