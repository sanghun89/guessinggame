(function($) {
	
	// Set Popup
	$.fn.displayPopUp = function(content, f) {
		var el = $(this),
			_html = content || '';
		el.fadeIn(function() {
			if (typeof f === "function") f();
		}).css('display','table').find('.popup-wrapper').html(_html);
	};

	// Initiate Guessing Game Class
	$.GuessingGame = function (ticker, status, moves) {
		// Storing the element 
		if (null !== ticker) {
			this._ticker = (ticker instanceof $) ? ticker : $(ticker);
		} else {
			this._ticker = null;
		}

		if (null !== status) {
			this._status = (status instanceof $) ? status : $(status);
		} else {
			this._status = null;
		}

		if (null !== moves) {
			this._moves = (moves instanceof $) ? moves : $(moves);
		} else {
			this._moves = null;
		}

		this.guessLimit = [1,100];
		this.guessedNum = 0;
		this.generatedNum = null;
		this.movesLeft = 20;

		// Setting the "sensitivity" of the measurment of how warm the guessing number is.
		// Higher the number, the more extensive measurement will be in place;
		this.guessRange = 20;

		this._moves.text(this.movesLeft);
	};

	// Set Limit
	$.GuessingGame.prototype.setLimit = function (min, max) {
		this.guessLimit = [min, max];
	};

	// Change the number of moves left 
	$.GuessingGame.prototype.setMovesLeft = function (num) {
		this.movesLeft = num;
		this._moves.text(this.movesLeft);
	};

	// Set guess Range
	$.GuessingGame.prototype.setGuessRange = function (range) {
		this.guessRange = range;
	};

	// Generate a Number 
	$.GuessingGame.prototype.generateNumber = function () {
		// Generate random between set min and max
		this.generatedNum = Math.floor(Math.random() * (this.guessLimit[1] - this.guessLimit[0]) + this.guessLimit[0]);
	};

	// Validate Number 
	$.GuessingGame.prototype.validateNumber = function (_submit) {
		var status = {no_error : true},
			user_num = parseInt(_submit.value, 10);

		// Check if input is a number 
		if (user_num.toString() !== _submit.value) {
			status.no_error = false;
			status.error_type = 0;
		} else {
			// Check if the number is inbound
			if (user_num > this.guessLimit[1] || user_num < this.guessLimit[0]) {
				status.no_error = false;
				status.error_type = 1;
			}
		}

		return status;
	};

	// Check moves left
	$.GuessingGame.prototype.checkMovesLeft = function() {
		return (this.movesLeft > 0);
	};

	// Check number inputed with number stored. return difference
	$.GuessingGame.prototype.checkNumber = function(num) {
		// overriding previously guessed number
		var num_int = parseInt(num, 10);
		this.guessedNum = num_int;

		// Positive num is guessed low, Negative 
		return this.generatedNum - this.guessedNum;
	};

	// Determine the "degree" of how close you are to the number
	$.GuessingGame.prototype.checkDegree = function(gap) {
		var diff = Math.abs(gap);

		// Set the diff to 0 if the gap is bigger than the range
		diff = diff > this.guessRange ? 0 : this.guessRange - diff;

		// Closer to 1, then closer to the guessed
		return (diff/this.guessRange);
	};

	// Animate ticker bar 
	$.GuessingGame.prototype.tick = function(deg) {
		var tickers = $(this._ticker).children('.ticker'),
			ticker_length = tickers.length,
			ticker_consumed = Math.floor(ticker_length * deg),
			_delay = 0;
		tickers.removeClass('.active');
		// .one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			for (var i = 1; i <= ticker_consumed; i++) {
				tickers.filter('.tick-'+i).delay(_delay).addClass('active');
				_delay += 500;
			}
		// });
	};

	// Update status message
	$.GuessingGame.prototype.displayStatus = function(str) {
		this._status.text(str);
		console.log(str);
	};

	// Update move count
	$.GuessingGame.prototype.countMove = function() {
		this._moves.text(--this.movesLeft);
	};

	// Give Hint
	$.GuessingGame.prototype.hint = function() {

	};

	// Do Reset
	$.GuessingGame.prototype.resetGame = function() {

	};

	// When complete, do something cool
	$.GuessingGame.prototype.startEnding = function() {

	};

	/* ------------------------------------------
	 * Click Events called on DOM Ready
	 * -----------------------------------------*/
	$(document).ready(function() {
		// Instantiate GuessingGame
		var guess_game = new $.GuessingGame('#ticker', '#status', '#moves');

		// On clicking start Button
		$('#start-guess').one('click', function(e) {
			e.preventDefault();

			// Generate random number
			if (guess_game.generatedNum === null)
				guess_game.generateNumber();

			// Hide the start button
			$(this).fadeOut(function() {
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

			var _submit = $(this).serializeArray()[0],
				check_num = guess_game.validateNumber(_submit),
				error_msg = null;
			
			switch (check_num) {
				case 0: // Not a number
					error_msg = "You have to guess a number!";
					break;
				case 1: // Not inbound the guessing limits
					error_msg = "Guess between " + guess_game.guessLimit[0] + " and " + guess_game.guessLimit[1] + "!";
					break;
			}

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
				console.log(degree);
				
				// Animate the ticker
				guess_game.tick(degree);
			}
		});
	});
})(jQuery);