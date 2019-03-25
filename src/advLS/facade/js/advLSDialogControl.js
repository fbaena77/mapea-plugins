goog.provide('P.advLSDialog');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

(function () {
	
	M.advLSDialog ={};
	/**
	 * This function shows a message
	 * 
	 * @public
	 * @function
	 * @api stable
	 * @param {*} message - Dialog message
	 * @param {*} title - Dialog title
	 * @param {*} severity - Message severity
	 * @param {*} acceptFn - Accept callback function
	 */
	M.advLSDialog.show = function (message, title, severity, acceptFn, cancelFn) {
		return M.template.compile(M.advLSDialog.TEMPLATE, {
			'jsonp': false,
			'vars': {
				'message': message,
				'title': title,
				'severity': severity
			}
		}).then(function (html) {
			// removes previous dialogs
			M.dialog.remove();
			M.advLSDialog.addEvents(html, acceptFn, cancelFn);
		});
	};

	/**
	 * This function closes a message
	 * 
	 * @public
	 * @function
	 * @api stable
	 */
	M.advLSDialog.close = function () {
		var element = document.querySelector('div.m-dialog');
		goog.dom.removeNode(element);
	};

	/**
	 * This function adds the events for this control's template
	 *
	 * @private
	 * @function
	 * @param {HTMLElement} html - Template of this control
	 * @param {*} acceptFn - Accept callback function
	 * @param {*} cancelFn - Cancel callback function
	 * @api stable
	 */
	M.advLSDialog.addEvents = function (html, acceptFn, cancelFn) {
		// append new dialog
		var mapeaContainer = document.querySelector('div.m-mapea-container');

		// adds listener to accept button click
		var acceptButton = html.querySelector('#m-advLS-dialog-button-aceptar > button');
		goog.events.listen(acceptButton, goog.events.EventType.CLICK, acceptFn);

		// adds listener to cancel button click
		var cancelButton = html.querySelector('#m-advLS-dialog-button-cancelar > button');
		if(cancelFn === undefined){
			goog.events.listen(cancelButton, goog.events.EventType.CLICK, M.advLSDialog.close);
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
	 * @type {String}
	 * @public
	 * @api stable
	 */
	M.advLSDialog.TEMPLATE = 'advLSDialog.html';
	if(M.config.devel){
		M.advLSDialog.TEMPLATE = 'src/advLS/templates/advLSDialog.html';
	}
})();
