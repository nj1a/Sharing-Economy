

$(document).ready(function() {
//{username: event.target.value}
	$("#submitButton").on("click", function(event){
		//alert(event.target.value);
		$.get("/viewusr/" + event.target.value, function(data){
			if (data==="good"){
				window.location.href="/showusr";
			}
		});

		//alert(result);
	});

	//var renderType = document.getElementById("own");
	//var editButtons = document.getElementsByClass("edit-icon");
	//alert(renderType);
	/*if (renderType === null) {

		for(i=0; i<editButtons.length; i++) {
			editButtons[i].className += " hidden";
		}
	} else {

		for(i=0; i<editButtons.length; i++) {
			editButtons[i].className = "edit-icon";
		}
	}*/
});