(function($) {
	/* ------------------------------------------
	 * Click Events called on DOM Ready
	 * -----------------------------------------*/
	$(document).ready(function() {
		// Instantiate GuessingGame
		var guess_game = new $.GuessingGame('#ticker', '#status', '#moves');

		// On clicking start Button
		$('#start-guess').on('click', function(e) {
			e.preventDefault();

			// Generate random number
			if (guess_game.generatedNum === null)
				guess_game.generateNumber();

			// Display buttons 
			$('#guess-tools').stop(true).fadeIn();

			// Hide the start button
			$(this).stop(true).fadeOut(function() {
				console.log(guess_game);
			});
		});

		// On Submit
		$('#guess-number').on('submit', function(e) {
			e.preventDefault();

			// Check how many moves there are first
			if (!guess_game.checkMovesLeft()) {
				guess_game.displayStatus("You have no moves left! Game over. gg");
				return false;
			}

			// Store and validate inputs
			var _submit = $(this).serializeArray()[0],
				check_num = guess_game.validateNumber(_submit),
				error_msg = null;
			
			if (!check_num.no_error) {
				switch (check_num.error_type) {
					case 0: // Not a number
						error_msg = "You have to guess a number!";
						break;
					case 1: // Not inbound the guessing limits
						error_msg = "Guess between " + guess_game.guessLimit[0] + " and " + guess_game.guessLimit[1] + "!";
						break;
					case 2: // Duplicate Entry
						error_msg = "You already guessed this number!";
						break;
				}
			}

			// If no error, calculate how close you are
			if (null !== error_msg) {
				guess_game.displayStatus(error_msg);
				return false;
			} else {
				// count the moves left
				guess_game.countMove();

				// Get how close the user is
				var gap = guess_game.checkNumber(_submit.value),
					degree = guess_game.checkDegree(gap);

				console.log(gap);
				// guess_game.displayStatus(gap);

				// Animate the ticker
				guess_game.tick(degree);
				var temp_msg = guess_game.getTempMsg(degree);

				// Update status msg and check if gap is 0
				if (gap === 0) {
					$('#guess-number').animate({opacity:0});
					guess_game.startEnding();
				} else {
					temp_msg += guess_game.checkPrev();
					temp_msg += " ";
					temp_msg += gap > 0 ? "Guess higher." : "Guess lower.";
				}

				guess_game.displayStatus(temp_msg);

			}
		});

		// On popup activity 
		$('#pop-up').on('click', function(e) {
			e.preventDefault();
			$(this).fadeOut();
		}).on('click', '.popup-wrapper', function(e) {
			e.preventDefault();
			e.stopPropagation();
		}).on('click', '.restart', function(e) {
			e.preventDefault();
			guess_game.resetGame();
			$('#pop-up').fadeOut(function() {
				guess_game.resetGame();
			});

			$('#guess-number').animate({opacity:1});
			$('#start-guess').stop(true).fadeIn();
			$('#guess-tools').stop(true).fadeOut();
		});

		// On hint click 
		$('#hint').on('click touch', function(e) {
			e.preventDefault();

			guess_game.hint();
		});

		// On reset click 
		$('#reset').on('click touch', function(e) {
			e.preventDefault();

			guess_game.resetGame();
			$('#start-guess').stop(true).fadeIn();
			$('#guess-tools').stop(true).fadeOut();
		});
	});
})(jQuery);