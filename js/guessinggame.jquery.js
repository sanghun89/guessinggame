(function($) {
	// Initiate Guessing Game Class
	$.GuessingGame = function () {
		// Storing the elements from the parameter
		var args = arguments;
			param_length = args.length;

		if (param_length > 0) {
			for (var i = 0; i < param_length; i++) {
				if ($(args[i]).length) {
					this['_' + args[i].replace('#', '')] = $(args[i]);
				}
			}
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
})(jQuery);