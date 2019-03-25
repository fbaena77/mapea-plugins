goog.provide('P.control.advLSAddFolderControl');

goog.require('goog.dom.classlist');
goog.require('goog.events');

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSAddFolderControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.advLSAddFolderControl = (function (config, callback) {
	/**
	 * Config of this control
	 * @private
	 * @type {object}
	 */
	this.config_ = config;
	/**
	 * Callback function triggered on Añadir button click
	 * @private
	 * @type {object}
	 */
	this.addCallback_ = callback;
	/**
	 * HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.element_ = null;
	/**
	 * Floating panel for this control
	 * @private
	 * @type {M.control.advLSPanelControl}
	 */
	this.panel_ = null;

	this.createView();
});

/**
 * This function creates the view
 *
 * @public
 * @function
 * @returns {Promise}
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.createView = function () {
	var this_ = this;
	this.panel_ = new M.control.advLSPanelControl();
	var config = this.config_;
	return Promise.resolve(this.panel_.createView()).then(function(){
		return new Promise(function (success) {
			M.template.compile(M.control.advLSAddFolderControl.TEMPLATE,{
				'jsonp': false,
				'vars': config,
				'parseToHtml': true
			}).then(function (html) {
				this_.createPanelInfo(html);
				success(html);
			});
		});
	});
};

/**
 * This function adds events to the control
 *
 * @private
 * @function
 * @param {HTMLElement} element
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.addEvents = function (html) {
	this.element_ = html;

	var addFolderButton = this.element_.querySelector('#m-addFolder-button');

	goog.events.listen(addFolderButton, goog.events.EventType.CLICK, this.addFolder, false, this);

	var input = this.element_.querySelector("#m-addFolder-input");
	input.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			addFolderButton.click();
		}
	});
};

/**
 * This function stops the drag of the panel
 *
 * @public
 * @function
 * @param {object} Event
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.addFolder = function (evt) {
	var inputValue = this.element_.querySelector("#m-addFolder-input").value;
	if(inputValue!==""){
		this.addCallback_(this.element_.querySelector("#m-addFolder-input").value);
	}
	else{
		M.dialog.info("Debe introducir un nombre");
	}
};

/**
 * This function compiles the template of panel's info and open the panel
 *
 * @public
 * @function
 * @param {HTMLElement} html
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.createPanelInfo = function (html) {
	this.panelInfo_ = html;
	var element = this.panel_.createDialog('open', {
		title: this.config_.title,
		content: this.panelInfo_.outerHTML,
		width: 320,
		height: 154
	});

	element.querySelector("#m-addFolder-input").focus();
	this.addEvents(element);
};

/**
 * This function closes the floating panel of this control
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.close = function () {
	this.panel_.closePanel();
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {object} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.advLSAddFolderControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.advLSAddFolderControl) {
		equals = (this.name === obj.name);
	}
	return equals;
};

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSAddFolderControl.NAME = 'advLSAddFolderControl';

/**
 * Template that contains the info of the panel of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */

M.control.advLSAddFolderControl.TEMPLATE = 'advLSAddFolder.html';
if(M.config.devel){
	M.control.advLSAddFolderControl.TEMPLATE = 'src/advLS/templates/advLSAddFolder.html';
}
