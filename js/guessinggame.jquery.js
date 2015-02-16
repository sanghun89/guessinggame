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

		// Default settings
		this._default = {
			guessLimit : [1,100],
			guessedNum : [],
			generatedNum : null,
			movesLeft : 20,
			guessRange : 20,
			tickLength : null,
			tickspeed : 40,
			tickTimeOut : [],
			temp_msg : {
				"cold" : ["Ice Ice Baby.", "You're Cold.", "Cold."],
				"warm" : ["Oh you getting warm.", "Getting warm.", "Warm."],
				"warmer" : ["Getting warmer.", "Warmer.", "Oh you getting warmer."],
				"hot" : ["Hot.", "Hawtness.", "It's getting hot in here."],
				"match" : ["You got it!", "0 to 100 real quick.", "You're a guessing master!"],
			}
		};

		// Default custom
		this._custom = this._default;

		$.extend(true, this, this._default);
	};

	// Set Options
	$.GuessingGame.prototype.setOptions = function (options) {
		$.extend(true, this, options);
		$.extend(true, this._custom, options);
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

		this.tickLength = ticker_consumed;

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
					// console.log(key);
					key++;
				}, _delay));
			}
		}
	};

	// Get temperature msg
	$.GuessingGame.prototype.getTempMsg = function(deg) {
		var temp = "cold";
		if (this.tickLength !== null) {
			this.tickLength = Math.floor($(this._ticker).children('.ticker').length * deg);
		}

		if (this.tickLength <= Math.floor(this.guessRange * 0.35)) {
			temp = "cold";
		} else if (this.tickLength <= Math.floor(this.guessRange * 0.6)) {
			temp = "warm";
		} else if (this.tickLength <= Math.floor(this.guessRange * 0.8)) {
			temp = "warmer";
		} else if (this.tickLength === this.guessRange) {
			temp = "match";
		} else {
			temp = "hot";
		}

		var randMsg = Math.floor((Math.random() * this.temp_msg[temp].length));

		return this.temp_msg[temp][randMsg];

	};

	// Update status message
	$.GuessingGame.prototype.displayStatus = function(str) {
		this._status.html(str);
	};

	// Update move count
	$.GuessingGame.prototype.countMove = function() {
		this._moves.text(--this.movesLeft);
	};

	// Give Hint
	$.GuessingGame.prototype.hint = function() {
		// Ceiling & floor Deviation
		var ceil_dev = Math.floor(Math.random() * 3),
			floor_dev = Math.floor(Math.random() * 3);

		// minimum gap of 4;
		min_dev = 4;

		// Makes sure ceiling and floor doesn't go beyond the limits
		var ceiling = this.generatedNum + ceil_dev + min_dev;
		ceiling = ceiling > this.guessLimit[1] ? this.guessLimit[1] : ceiling;
		
		var floor = this.generatedNum - floor_dev - min_dev;
		floor = floor < this.guessLimit[0] ? this.guessLimit[0] : floor;

		var hint_msg = "Guess between " + floor + " and " + ceiling + ".";
		$('#pop-up').displayPopUp(
			'<h2>Hint</h2>' + '<br>' +
			'<p>' + hint_msg + "</p>"
		);
	};

	// Do Reset
	$.GuessingGame.prototype.resetGame = function() {
		$.extend(true, this, this._custom);
		this.displayStatus("Guess a number from 0 - 100");
	};

	// When complete, do something cool
	$.GuessingGame.prototype.startEnding = function() {
		// Display once it is a match
		setTimeout(function() {
			$('#pop-up').displayPopUp('woot!' + '<a href="#" class="restart">Play Again!</a>');
		}, (this.tickspeed * this.guessRange + 500));
	};
})(jQuery);