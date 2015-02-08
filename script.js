(function($) {
	
	// Set Popup
	$.fn.displayPopUp = function(el) {

	};

	// Initiate Guessing Game Class
	$.GuessingGame = function (element) {
		// Storing the element 
		if (null !== element) {
			this.element = (element instanceof $) ? element : $(element);
		} else {
			this.element = null;
		}

		this.guessLimit = [1,100];
		this.guessedNum = 0;
		this.generatedNum = 0;

		// Setting the "sensitivity" of the measurment of how warm the guessing number is.
		// Higher the number, the more extensive measurement will be in place;
		this.guessRange = 20;
	};

	// Set Limit
	$.GuessingGame.prototype.setLimit = function (min, max) {
		this.guessLimit = [min, max];
	};

	// Generate a Number 
	$.GuessingGame.prototype.generateNumber = function () {
		// Generate random between set min and max
		this.generatedNum = Math.floor(Math.random() * (this.guessLimit[1] - this.guessLimit[0]) + this.guessLimit[0]);
	};
	
	// Check number inputed with number stored. return difference
	$.GuessingGame.prototype.checkNumber = function(num) {
		// overriding previously guessed number
		this.guessedNum = Math.floor(num);

		// Positive num is guessed low, Negative 
		return this.generatedNum - this.guessedNum;
	};

	// Determine the "degree" of how close you are to the number
	$.GuessingGame.prototype.checkDegree = function() {
		var diff = Math.abs(this.generatedNum - this.guessedNum);

		// Set the diff to 0 if the gap is bigger than the range
		diff = diff > this.guessRange ? 0 : diff;

		// Closer to 1, then closer to the guessed
		return (diff/this.guessRange);
	};

	// Animate ticker bar 
	$.GuessingGame.prototype.tick = function() {

	};

	// Update status message
	$.GuessingGame.prototype.displayStatus = function(str) {

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