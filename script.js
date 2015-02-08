(function($) {
	// Initiate Guessing Game Class
	$.GuessingGame = function (element) {
		// Storing the element 
		if (null !== element) {
			this.element = (element instanceof $) ? element : $(element);
		} else {
			this.element = null;
		}

		this.guessLimit = [0,0];
		this.guessedNum = 0;
		this.generatedNum = 0;
	};

	// Set Limit
	$.GuessingGame.prototype.setLimit = function (min, max) {

	};

	// Generate a Number 
	$.GuessingGame.prototype.generateNumber = function () {

	};
	
	// Check number inputed with number stored. return difference
	$.GuessingGame.prototype.checkNumber = function(num) {

	};

	// Determine the "degree" of how close you are to the number
	$.GuessingGame.prototype.checkDegree = function(num) {

	};

	// Animate ticker bar 
	$.GuessingGame.prototype.tick = function() {

	};

	// Update status message
	$.GuessingGame.prototype.displayStatus = function(str) {

	};

	// Store guessed number
	$.GuessingGame.prototype.setGuessed = function() {

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