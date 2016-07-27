jQuery(document).ready(function () {
	jQuery('#vmap').vectorMap({
		map: 'world_en',
		backgroundColor: '#333333',
		color: '#ffffff',
		hoverOpacity: 0.7,
		selectedColor: '#666666',
		enableZoom: true,
		showTooltip: true,
		scaleColors: ['#C8EEFF', '#006491'],
		values: sample_data,
		normalizeFunction: 'polynomial',
		onRegionClick: function(element, code, region) {
			var message = 'You clicked "'
			+ region
			+ '" which has the code: '
			+ code.toUpperCase();
			alert(message);
		}
	});
});