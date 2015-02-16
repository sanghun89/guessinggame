(function($) {
	// Initiate Guessing Game Class
	$.GuessingGame = function () {
		// Storing the elements from the parameter
		// Setting array obj to arguments obj
		var args = Array.prototype.slice.call(arguments);
			param_length = args.length;

		if (param_length > 0) {
			for (var i = 0; i < param_length; i++) {
				if ($(args[i]).length) {
					this['_' + args[i].replace('#', '')] = $(args[i]);
				}
			}
		}

		this.guessLimit = [1,100];
		this.guessedNum = [];
		this.generatedNum = null;
		this.movesLeft = 20;

		// Setting the "sensitivity" of the measurment of how warm the guessing number is.
		// Higher the number, the more extensive measurement will be in place;
		this.guessRange = 20;

		this._moves.text(this.movesLeft);

		// tick speed
		this.tickspeed = 40;
		this.tickTimeOut = [];
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

	// Check for duplicates
	$.GuessingGame.prototype.checkDuplicate = function(num) {
		var duplicate = false;

		for (var i = 0; i < this.guessedNum.length; i++) {
			if (num === this.guessedNum[i]) {
				duplicate = true;
				break;
			}
		}

		return duplicate;
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

			if (this.checkDuplicate(user_num)) {
				status.no_error=false;
				status.error_type = 2;
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
		this.guessedNum.push(num_int);

		// Positive num is guessed low, Negative 
		return this.generatedNum - this.guessedNum[this.guessedNum.length - 1];
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
			_delay = 0,
			key = 1;

		// Reset Tick
		if (this.tickTimeOut.length > 0) {
			for (var i = 0; i < this.tickTimeOut.length; i++) {
				clearTimeout(this.tickTimeOut[i]);
			}

			this.tickTimeOut = [];
		}

		tickers.removeClass('.active');
		
		// Use setTimeOut to allow incremental css changes. 
		if (ticker_consumed > 0) {
			for (var k = 0; k < ticker_consumed; k++) {
				_delay = this.tickspeed * (k+1);
				this.tickTimeOut.push(setTimeout(function() {
					tickers.filter('.tick-'+key).addClass('active');
					console.log(key);
					key++;
				}, _delay));
			}
		}	
	};

	// Update status message
	$.GuessingGame.prototype.displayStatus = function(str) {
		this._status.text(str);
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