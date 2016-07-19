$(document).ready(function(){

	var w = document.getElementById("work");
	var e = document.getElementById("education");
	var b = document.getElementById("basic-info");
	var c = document.getElementById("contact-info");

	var navs = document.getElementsByClassName("nav-menu");
	var info = document.getElementsByClassName("profile-info");

	$("a#nav1").click(function(){
		processMenu(1, navs);
		listInfo(1, info);
	});
	
	$("a#nav2").click(function(){
		processMenu(2, navs);
		listInfo(2, info);
	});
});

function processMenu(n, menu){
	for (i=0; i < menu.length; i++){
		menu[i].className = "nav-menu";
	}
	menu[n-1].className += " selected";

}

function listInfo(n, info){
	for (i=0; i < info.length; i++){
		info[i].className = "profile-info";
	}
	if (n==1) {
		info[0].className += " selected";
		info[1].className += " selected";

	} else if (n==2){
		info[2].className += " selected";
		info[3].className += " selected";
	}
}