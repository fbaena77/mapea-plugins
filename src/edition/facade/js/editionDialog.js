goog.provide('P.EditionDialog');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

(function () {
	
	M.EditionDialog ={};
	/**
	 * This function shows the edition dialog
	 *
	 * @public
	 * @function
	 * @api stable
	 * @param {string} Dialog message
	 * @param {string} Dialog title
	 * @param {object} Message severity
	 * @param {object} Accept callback function
	 * @param {object} Cancel callback function
	 * @returns {Promise}
	 */
	M.EditionDialog.show = function (message, title, severity, acceptFn, cancelFn) {
		return M.template.compile(M.EditionDialog.TEMPLATE, {
			'jsonp': false,
			'vars': {
				'message': message,
				'title': title,
				'severity': severity
			}
		}).then(function (html) {
			M.EditionDialog.addEvents(html, acceptFn, cancelFn);
		});
	};

	/**
	 * This function closes the edition dialog
	 * 
	 * @public
	 * @function
	 * @api stable
	 */
	M.EditionDialog.close = function () {
		var element = document.querySelector('div.m-dialog');
		goog.dom.removeNode(element);
	};

	/**
     * This function add the events to the specified html element
	 *
	 * @private
	 * @function
	 * @param {HTMLElement} html template
	 * @param {object} Accept callback function
	 * @param {object} Cancel callback function
	 * @api stable
	 */
	M.EditionDialog.addEvents = function (html, acceptFn, cancelFn) {
		// append new dialog
		var mapeaContainer = document.querySelector('div.m-mapea-container');

		// adds listener to accept button click
		var acceptButton = html.querySelector('#m-edition-dialog-button-aceptar > button');
		goog.events.listen(acceptButton, goog.events.EventType.CLICK, acceptFn);

		// adds listener to cancel button click
		var cancelButton = html.querySelector('#m-edition-dialog-button-cancelar > button');
		if(cancelFn === undefined){
			goog.events.listen(cancelButton, goog.events.EventType.CLICK, M.EditionDialog.close);
		}
		else{
			goog.events.listen(cancelButton, goog.events.EventType.CLICK, cancelFn);
		}
		goog.dom.removeNode(html);

		goog.dom.appendChild(mapeaContainer, html);
	};
	
	/**
	 * Template for this control
	 * @const
	 * @type {string}
	 * @public
	 * @api stable
	 */
	M.EditionDialog.TEMPLATE = 'editionDialog.html';
	if(M.config.devel){
		M.EditionDialog.TEMPLATE = 'src/edition/templates/editionDialog.html';
	}

})();
