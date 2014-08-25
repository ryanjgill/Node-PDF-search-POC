(function () {
	var $input = $('input'),
			$btn = $('.btn'),
			$plural = $('.plural'),
			$pdfCounts = $('.pdfCounts'),
			text;

	$btn.on('click', function () {
		text = $input.val().trim();
		// no text to search, return
		if (text.length < 1) {
			alert('Must enter a valid search term.');
			$input.focus();
			return;
		}

		clearUl();
		$('#loadingAnimation').removeClass('hide');
		$btn.addClass('disabledItem');
		
		$.ajax({
			url: "/search/" + text,
			success: function (d) {
				$('#loadingAnimation').addClass('hide');
				$btn.removeClass('disabledItem');

				//update total files and counts
				$('.total').html(d.totalFiles);
				$('.matches').html(d.matches.length);

				$pdfCounts.removeClass('hide');

				if (d.matches.length === 1) {
					$plural.addClass('hide');
				}
				else {
					$plural.removeClass('hide');
				}

				if (d.matches.length < 1) {
					$('li.noResults').removeClass('hide');

					return;
				}

				console.log(d);				

				_.each(d.matches, function (match){
					$('ul').append('<li class="match animated fadeInLeftBig">' + match + '</li>');						
				});

			},
			error: function (err) {
				console.log('Get failed!');
			}
		});



	});

	var clearUl = function () {
		$('li.match').remove();
		$('li.noResults').addClass('hide');
		$pdfCounts.addClass('hide');
	};

}());
