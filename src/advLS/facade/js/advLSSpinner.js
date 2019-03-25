goog.provide('P.advLSSpinner');

(function () {
	M.advLSSpinner = {};
	/**
	 * This function shows the spinner
	 *
	 * @public
	 * @function
	 * @api stable
	 * @returns {Promise}
	 */
	M.advLSSpinner.show = function () {
		return M.template.compile(M.advLSSpinner.TEMPLATE, {
			'jsonp': false
		}).then(function (html) {
			M.advLSSpinner.append(html);
		});
	};

	/**
	 * This function appends the spinner to the container
	 * 
	 * @public
	 * @api stable
	 */
	M.advLSSpinner.append = function (html) {
		var container = document.getElementsByClassName("m-import-container");
		if (container.length > 0) {
			container[1].appendChild(html);
		}
	};

	/**
	 * This function close the spinner element
	 * 
	 * @public
	 * @api stable
	 */
	M.advLSSpinner.close = function () {
		var advLSSpinner = document.getElementById("m-advLS-spinner");
		if (advLSSpinner) {
			var container = document.getElementsByClassName("m-import-container");
			container[1].removeChild(advLSSpinner);
		}
	};

	/**
	 * Template for this control
	 * @const
	 * @type {String}
	 * @public
	 * @api stable
	 */
	M.advLSSpinner.TEMPLATE = 'advLSSpinner.html';
	if(M.config.devel){
		M.advLSSpinner.TEMPLATE = 'src/advLS/templates/advLSSpinner.html';
	}
})();
