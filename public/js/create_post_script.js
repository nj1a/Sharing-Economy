$(document).ready(function() {

	$('input.city-field').typeahead({
		name: 'from_city',
		remote: 'https://wander-land.herokuapp.com/get_city?key=%QUERY',
		limit: 3
	});


});