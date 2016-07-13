// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
    var x = document.getElementById("navS");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

$(document).ready(function() {

    // $('nav').load('../assets/common/nav.html');
    // $('#navS').load('../assets/common/navS.html');

    // $('footer').load('../assets/common/footer.html');
});

function show_login_pop(){
    document.getElementById("pop-wrap").style.display = "block";
}

function close_login_pop() {
    document.getElementById("pop-wrap").style.display = "none";
}
