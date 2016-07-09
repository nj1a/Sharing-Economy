var slideIndex = 1;
showSlides(slideIndex);

function showSlides(n){
	var i;
	var images = document.getElementsByClassName("slide_image");
	if (n > images.length) {
		slideIndex = 1
	}
	if (n < 1) {
		slideIndex = images.length
	}
	for (i = 0; i < images.length; i++) {
	   images[i].style.display = "none";
	}
	images[slideIndex-1].style.display = "block";
}

function plusDivs(n) {
  showSlides(slideIndex += n);
}