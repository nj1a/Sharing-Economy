$(document).ready(function(){

	var w = document.getElementById("work");
	var e = document.getElementById("education");
	var b = document.getElementById("basic-info");
	var c = document.getElementById("contact-info");

	//var wn = document.getElementsByClassName("info-nav");
	//var nav1 = document.getElementById("nav1");
	//var nav2 = document.getElementById("nav2");
	//alert(nav1.id);

	var navs = document.getElementsByClassName("nav-menu");
	var info = document.getElementsByClassName("profile-info");
	//alert(info.length);

	

	$("a#nav1").click(function(){
		/*if (nav1.className.indexOf("selected") == -1){
			nav1.className = "selected";
			$(nav1).parent().addClass("selected");
		}*/
		//alert(1);
		processMenu(1, navs);
		listInfo(1, info);


		/*if (w.className.indexOf("hidden") != -1) {
			$("#work").toggleClass("hidden");
		}

		if (e.className.indexOf("hidden") != -1) {
			$("#education").toggleClass("hidden");
		}

		if (b.className.indexOf("hidden") == -1) {
			$("#basic-info").toggleClass("hidden");
		}

		if (c.className.indexOf("hidden") == -1) {
			$("#contact-info").toggleClass("hidden");
		}*/
	});
	
	$("a#nav2").click(function(){
		//alert(2);
		processMenu(2, navs);
		listInfo(2, info);

		/*if (w.className.indexOf("hidden") == -1) {
			$("#work").toggleClass("hidden");
		}

		if (e.className.indexOf("hidden") == -1) {
			$("#education").toggleClass("hidden");
		}

		if (b.className.indexOf("hidden") != -1) {
			$("#basic-info").toggleClass("hidden");
		}

		if (c.className.indexOf("hidden") != -1) {
			$("#contact-info").toggleClass("hidden");
		}*/
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