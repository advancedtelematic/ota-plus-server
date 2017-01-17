define(function(require, exports, module) {

	function setFocusAtEnd(e) {
		var temp_value = e.target.value;
		e.target.value = '';
		e.target.value = temp_value;
	}

	function limitToNumbersRange(min, max, e) {
		var value = e.target.value;
		if(min !== null)
			value = Math.max(min, value);
		if(max !== null)
			value = Math.min(max, value);
		e.target.value = value;
	}

	module.exports = { 
		setFocusAtEnd,
		limitToNumbersRange,
	};
});