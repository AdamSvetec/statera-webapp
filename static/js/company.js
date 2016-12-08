(function($) {
    $.fn.counter = function(options) {
	var settings = $.extend({
	    start: 0,
	    end: 100,
	    easing: 'swing',
	    duration: 400,
	    complete: ''
	}, options);

	var thisElement = $(this);

	$({
	    count: settings.start
	}).animate({
	    count: settings.end
	}, {
	    duration: settings.duration,
	    easing: settings.easing,
	    step: function() {
		var mathCount = Math.ceil(this.count);
		thisElement.text(mathCount);
	    },
	    complete: settings.complete
	});
    };

}(jQuery));

$('#score-counter').counter({
    start: 0,
    end: 1483,
    duration: 4000
});

$(document).ready(function() {
    $('.score-graph').each(function() {
	$(this).find('.score-graph-bar').animate({
	    width: $(this).attr('data-percent')
	}, 4000);
    });
});
