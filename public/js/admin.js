$(document).ready(function(){

	/*$('<>', {
				"class":
			}).appendTo();*/

	$("#findUsr").click(function(event) {
		$.get("/findUser/" + $("#inputEmail").val(), function(result){
			alert(result[0].username);

			$("#resultBox").attr("class", "perma hidden");

			$('<div>', {
				"id": "editEnabledArea1",
				//"class": ""
			}).appendTo($("#resultArea"));

			$('<input>', {
				"class": "m_b_10 hidden",
				//"name":
				"id": "unq",
				"value": result[0].user_id
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Email "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				//"name":
				"id": "editedEmail",
				"value": result[0].email
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Username "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedUsername",
				"value": result[0].username
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Password "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedPassword",
				"value": result[0].password
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "First name "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedFirst",
				"value": result[0].first_name
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Last name "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedLast",
				"value": result[0].last_name
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Gender "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedGender",
				"value": result[0].gender
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Phone number "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedPhone",
				"value": result[0].phone_num
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "City " 
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedCity",
				"value": result[0].city_id
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Country "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedCountry",
				"value": result[0].country_id
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Date of birth "
			}).appendTo("#editEnabledArea1");


			$('<input>', {
				"class": "m_b_10",
				"id": "editedDOB",
				"value": result[0].date_of_birth
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<label>', {
				"class": "m_r_10", 
				html: "Description "
			}).appendTo("#editEnabledArea1");

			$('<input>', {
				"class": "m_b_10",
				"id": "editedDesc",
				"value": result[0].description
			}).appendTo("#editEnabledArea1");

			$('<br>', {
				//"class":
			}).appendTo("#editEnabledArea1");

			$('<input>', {
				"class": "m_b_10",
				"id": "updateUserInfo",
				"type": "button",
				"value": "Update!"
			}).appendTo("#editEnabledArea1");

			$("#updateUserInfo").click(function(event){
				
				$.post("/adminUpdate", {user_id:$("#unq").val(),
										email:$("#editedEmail").val(),
										username: $("#editedUsername").val(),
										password: $("#editedPassword").val(),
										first_name: $("#editedFirst").val(),
										last_name: $("#editedLast").val(),
										gender: $("#editedGender").val(),
										phone_num: $("#editedPhone").val(),
										city_id: $("#editedCity").val(),
										country_id: $("#editedCountry").val(),
										date_of_birth: $("#editedDOB").val(),
										description: $("#editedDesc").val()}, 
										function(data){
											alert(data);
											$("#resultBox").attr("class", "perma");
											
											$("#editEnabledArea1").remove();

										});
			});
		


		});


		
	});


		

	$("#deleteUsr").click(function(event) {
		//alert($("#deleteEmail").val());
		$.get("/deleteUser/" + $("#deleteEmail").val(), function(result){
			alert(result);
		});
		
	});

	$("#createUsr").click(function(event) {
		/*alert($("#newACCemail").val());
		alert($("#newACCpass").val());
		alert($("#newACCusername").val());
		alert($("#newACCfname").val());
		alert($("#newACClname").val());*/

		$.post("/createUser", {email: $("#newACCemail").val(),
							   password: $("#newACCpass").val(),
							   username: $("#newACCusername").val(),
							   first_name: $("#newACCfname").val(),
							   last_name: $("#newACClname").val()}, 
							   function(data){
							       alert(data);
							   });

	});

});