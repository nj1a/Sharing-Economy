$(document).ready(function(){

	var w = document.getElementById("work");
	var e = document.getElementById("education");
	var b = document.getElementById("basic-info");
	var c = document.getElementById("contact-info");

	$("a#nav1").click(function(){

		if (w.className.indexOf("hidden") != -1) {
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
		}
	});
	
	$("a#nav2").click(function(){

		if (w.className.indexOf("hidden") == -1) {
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
		}
	});
});