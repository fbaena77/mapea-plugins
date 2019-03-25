goog.provide('P.catalogSpinner');

(function () {
	M.catalogSpinner = {};
	/**
	 * This function shows the spinner
	 *
	 * @public
	 * @function
	 * @api stable
	 * @returns {Promise}
	 */
	M.catalogSpinner.show = function () {
		return M.template.compile(M.catalogSpinner.TEMPLATE, {
			'jsonp': false
		}).then(function (html) {
			M.catalogSpinner.append(html);
		});
	};

	/**
	 * This function appends the spinner to the container
	 * 
	 * @public
	 * @api stable
	 */
	M.catalogSpinner.append = function (html) {
		var container = document.getElementsByClassName("m-catalog-container");
		container[0].appendChild(html);
	};

	/**
	 * This function close the spinner element
	 * 
	 * @public
	 * @api stable
	 */
	M.catalogSpinner.close = function () {
		var catalogSpinner = document.getElementById("m-catalog-spinner");
		if (catalogSpinner) {
			var container = document.getElementsByClassName("m-catalog-container");
			container[0].removeChild(catalogSpinner);
		}
	};

	/**
	 * Template for this control
	 * @const
	 * @type {String}
	 * @public
	 * @api stable
	 */
	M.catalogSpinner.TEMPLATE = 'catalogSpinner.html';
	if(M.config.devel){
		M.catalogSpinner.TEMPLATE = 'src/catalog/templates/catalogSpinner.html';
	}
})();
