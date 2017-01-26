define(function(require, exports, module) {

	function setFocusAtEnd(e) {
		var temp_value = e.target.value;
		e.target.value = '';
		e.target.value = temp_value;
	}

	module.exports = { 
		setFocusAtEnd
	};
});