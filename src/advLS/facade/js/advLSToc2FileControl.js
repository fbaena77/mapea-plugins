goog.provide('P.control.advLSToc2FileControl');

goog.require('P.impl.control.advLSAddFileControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSToc2FileControl
 * control
 *
 * @constructor
 * @api stable
 */
M.control.advLSToc2FileControl = (function (base) {
	// checks if the implementation can create advLSLoadTocFromFileControl
	if (M.utils.isUndefined(M.impl.control.advLSAddFileControl)) {
		M.exception('La implementación usada no puede crear controles advLSToc2FileControl');
	}
	/**
	 * Parent control composition
	 * @private
	 * @type {M.control.advLSContextMenuControl}
	 */
	this.base_ = base;
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
	/**
	 * m-layerimportfile-container element from HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.divContainer_ = null;
	/**
	 * drop-zone element from HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.divDragDrop_ = null;
	/**
	 * inputfileContainer element from HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.fileContainer_ = null;
	/**
	 * JSON file parsed to load
	 * @private
	 * @type {Object}
	 */
	this.importedLocalZip_ = null;
	/**
	 * Implementation of this control
	 * @private
	 * @type {M.impl.control.advLSAddFileControl}
	 */
	this.impl_ = new M.impl.control.advLSAddFileControl();

	this.createView();
});

/**
 * This function compiles the template and calls the floatingpanel's creation function
 *
 * @public
 * @function
 * @returns {Promise}
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.createView = function () {
	var this_ = this;
	this.panel_ = new M.control.advLSPanelControl();
	return Promise.resolve(this.panel_.createView()).then(function(){
		return new Promise(function (success) {
			M.template.compile(M.control.advLSToc2FileControl.TEMPLATE,{'jsonp': false}).then(function (html) {
				this_.createPanelInfo(html);
				success(html);
			});
		});
	});
};

/**
 * This function assign the template of panel's info and open the panel
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template of this control
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.createPanelInfo = function (html) {
	this.panelInfo_ = html;
	var element = this.panel_.createDialog('open', {
		title: 'Cargar Tabla de Contenidos',
		content: this.panelInfo_.outerHTML,
		width: 482,
		height: 250
	});
	this.addEvents(element);
};

/**
 * This function adds the events for this control's template
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template of this control
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.divContainer_ = this.element_.querySelector('#m-importfile-container');
	this.divDragDrop_ = this.divContainer_.querySelector('.drop-zone');
	this.fileContainer_ = this.element_.querySelector('.inputfileContainer');
	var importFileButton_ = this.element_.querySelector('#importJsonFileButton');

	goog.events.listen(this.divDragDrop_, goog.events.EventType.DRAGOVER, this.handleDragOver, false, this);
	goog.events.listen(this.divDragDrop_, goog.events.EventType.DROP, this.handleDropFile, false, this);
	goog.events.listen(this.fileContainer_, goog.events.EventType.CHANGE, this.handleBrowseFile, false, this);
	goog.events.listen(importFileButton_, goog.events.EventType.CLICK, this.loadTocFile, false, this);
};

/**
 * This function creates an ObjectUrl and assigns it to a class object
 *
 * @private
 * @function
 * @param {File} file - Selected file
 * @param {string} type - File type
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.importZipFile = function (file) {
	var this_ = this;
	if(file.name.indexOf(".zip") === -1){
		M.dialog.error('El archivo ' + file.name + ' no es un archivo válido');
		return;
	}
	else{
		M.advLSSpinner.show();
		var inputtext = this.divContainer_.querySelector("input[type=text]");
		inputtext.value = escape(file.name);
		var reader = new FileReader();
		reader.onload = function(fileLoadedEvent){
			 var reader_zip = new JSZip();
			 reader_zip.loadAsync(fileLoadedEvent.target.result, {checkCRC32: true})
		     .then(function(zip) {
		    	 this_.importedLocalZip_ = zip;
		    	 M.advLSSpinner.close();
		     }, function() {
		    	M.advLSSpinner.close();
		 		M.dialog.error('El archivo ' + file.name + ' no es un archivo válido');
				return;
		     }); 
		};
		reader.readAsArrayBuffer(file);
	}
};

/**
 * This function loads the saved TOC in json file
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.loadTocFile = function () {
	if (this.importedLocalZip_ !== null) {
		this.base_.readTocFile(this.importedLocalZip_);
		var inputtext = this.fileContainer_.querySelector("input[type=text]");
		inputtext.value = "";
		this.close();

	} else {
		M.dialog.info("Seleccione un fichero");
	}
};

/**
 * This function handles the drag of the file
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.handleDragOver = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.event_.dataTransfer.dropEffect = 'copy';
};

/**
 * This function handles the browsed kml file
 *
 * @private
 * @function
 * @param {object} evt - Change event
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.handleBrowseFile = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	this.importZipFile(evt.target.files[0]);
};

/**
 * This function handles the dropped kml file
 *
 * @private
 * @function
 * @param {object} evt - Drop event
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.handleDropFile = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	this.importZipFile(evt.event_.dataTransfer.files[0]);
};

/**
 * This function returns the implementation object of this control
 *
 * @public
 * @function
 * @returns {object} the implementation object of this control
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.getImpl = function () {
	return this.impl_;
};

/**
 * This function closes the floating panel of this control
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSToc2FileControl.prototype.close = function () {
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
M.control.advLSToc2FileControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.advLSToc2FileControl) {
		equals = (this.name === obj.name);
	}
	return equals;
};

/**
 * Name for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSToc2FileControl.NAME = 'advLSToc2FileControl';

/**
 * Template path for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSToc2FileControl.TEMPLATE = 'advLSToc2File.html';
if(M.config.devel){
	M.control.advLSToc2FileControl.TEMPLATE = 'src/advLS/templates/advLSToc2File.html';
}

