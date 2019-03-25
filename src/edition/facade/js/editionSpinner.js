goog.provide('P.EditionSpinner');

(function () {
	M.EditionSpinner = {};
	/**
	 * This function shows the spinner
	 *
	 * @public
	 * @function
	 * @param {HTMLElement} target - Target element for showing the spinner
	 * @api stable
	 * @returns {Promise}
	 */
	M.EditionSpinner.show = function (target) {
		return M.template.compile(M.EditionSpinner.TEMPLATE, {
			'jsonp': false
		}).then(function (html) {
			if(target!==undefined){
				html.style.height = "100%";
				html.style.backgroundColor= "rgba(255, 255, 255, 0.5)";
				M.EditionSpinner.append(html, target);
			}
			else{
				M.EditionSpinner.append(html);
			}
		});
	};

	/**
	 * This function appends the spinner to the container
	 *
	 * @public
	 * @api stable
	 * @param {HTMLElement} html - Spinner template
	 * @param {HTMLElement} target - Target element for showing the spinner
	 */
	M.EditionSpinner.append = function (html, target) {
		if(target!==undefined){
			target.appendChild(html);
		}
		else{
			var editorContainer = document.getElementsByClassName("m-editor-container");
			editorContainer[1].appendChild(html);
		}
	};

	/**
	 * This function close the spinner element
	 * 
	 * @public
	 * @api stable
	 * @param {HTMLElement} target - Target element for showing the spinner
	 */
	M.EditionSpinner.close = function (target) {
		var EditionSpinner = document.getElementById("m-edition-spinner");
		if(target!==undefined && EditionSpinner){
			target.removeChild(EditionSpinner);
		}
		else{
			if (EditionSpinner) {
				var editorContainer = document.getElementsByClassName("m-edition-container");
				editorContainer[1].removeChild(EditionSpinner);
			}
		}
	};

	/**
	 * Template for this control
	 * @const
	 * @type {string}
	 * @public
	 * @api stable
	 */
	M.EditionSpinner.TEMPLATE = 'editionSpinner.html';
	if(M.config.devel){
		M.EditionSpinner.TEMPLATE = 'src/edition/templates/editionSpinner.html';		
	}

})();
