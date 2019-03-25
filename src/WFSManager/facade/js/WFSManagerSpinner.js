goog.provide('P.WFSManagerSpinner');

(function () {
	M.WFSManagerSpinner = {};
	/**
	 * This function shows the spinner
	 *
	 * @public
	 * @function
	 * @api stable
	 * @returns {Promise}
	 */
	M.WFSManagerSpinner.show = function () {
		return M.template.compile(M.WFSManagerSpinner.TEMPLATE, {
			'jsonp': false
		}).then(function (html) {
			M.WFSManagerSpinner.append(html);
		});
	};

	/**
	 * This function appends the spinner to the container
	 * 
	 * @public
	 * @api stable
	 */
	M.WFSManagerSpinner.append = function (html) {
		var container = document.getElementsByClassName("m-import-container");
		container[1].appendChild(html);
	};

	/**
	 * This function close the spinner element
	 * 
	 * @public
	 * @api stable
	 */
	M.WFSManagerSpinner.close = function () {
		var WFSManagerSpinner = document.getElementById("m-WFSManager-spinner");
		if (WFSManagerSpinner) {
			var container = document.getElementsByClassName("m-import-container");
			container[1].removeChild(WFSManagerSpinner);
		}
	};

	/**
	 * Template for this control
	 * @const
	 * @type {String}
	 * @public
	 * @api stable
	 */
	M.WFSManagerSpinner.TEMPLATE = 'WFSManagerSpinner.html';
	if(M.config.devel){
		M.WFSManagerSpinner.TEMPLATE = 'src/WFSManager/templates/WFSManagerSpinner.html';
	}
})();
