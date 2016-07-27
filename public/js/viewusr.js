//"Send request for friends"

$(document).ready(function() {
	if ($(".friendship").html() == "Send request for friends") {

		$('<form>', {
				"action": "/profile",
				"id": "friendReq"
			}).appendTo(".reqLink");


			$('<div>', {
				"class": "link-container" ,
				"id": "link-wrap"
			}).appendTo("#friendReq");

			$('<input>', {
				"class": "submitButton",
				"id": "reqButton",
				"value": "send friend request!"
			}).appendTo("#link-wrap");

			
	} else if ($(".friendship").html() == "request has been sent") {
		$('<div>', {
				"class": "link-container" ,
				"id": "link-wrap"
			}).appendTo(".reqLink");

			$('<span>', {
				"class": "submitButton",
				html: "request sent!"
			}).appendTo("#link-wrap");

		
	}



	$("#reqButton").click(function(){

		//alert($('.username-field').html());
		$.get("/requestFriend/" + $('.username-field').html(), function(data){
			if (data===$('.username-field').html()){
				alert("request sent!");

				window.location.href="/showusr";

			}
		});
	});
});