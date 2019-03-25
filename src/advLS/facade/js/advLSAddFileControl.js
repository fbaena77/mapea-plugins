goog.provide('P.control.advLSAddFileControl');

goog.require('P.impl.control.advLSAddFileControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSAddFileControl
 * control
 *
 * @constructor
 * @api stable
 */
M.control.advLSAddFileControl = (function (base) {
	// checks if the implementation can create advLSAddFileControl
	if (M.utils.isUndefined(M.impl.control.advLSAddFileControl)) {
		M.exception('La implementación usada no puede crear controles advLSAddFileControl');
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
	 * importForm element from HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.importshpForm_ = null;
	/**
	 * input[type=file] element from HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.shpFileContainer_ = null;
	/**
	 * Shapefile wrapper in .zip file to upload
	 * @private
	 * @type {File}
	 */
	this.zipFile_ = null;
	/**
	 * GML or KML file to upload
	 * @private
	 * @type {Object}
	 */
	this.queueXmlFile_ = null;
	/**
	 * Max size allowed in bytes for the imported shapefile
	 * @private
	 * @type {number}
	 */
	this.maxSizeShapefile = 50000000;
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
M.control.advLSAddFileControl.prototype.createView = function () {
	var this_ = this;
	this.panel_ = new M.control.advLSPanelControl();
	return Promise.resolve(this.panel_.createView()).then(function(){
		return new Promise(function (success) {
			M.template.compile(M.control.advLSAddFileControl.TEMPLATE,{'jsonp': false}).then(function (html) {
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
M.control.advLSAddFileControl.prototype.createPanelInfo = function (html) {
	this.panelInfo_ = html;
	var element = this.panel_.createDialog('open', {
		title: 'Añadir capa vectorial',
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
M.control.advLSAddFileControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.divContainer_ = this.element_.querySelector('#m-importfile-container');
	this.divDragDrop_ = this.divContainer_.querySelector('.drop-zone');
	this.fileContainer_ = this.element_.querySelector('.inputfileContainer');
	var importFileButton_ = this.element_.querySelector('#importFileButton');

	goog.events.listen(this.divDragDrop_, goog.events.EventType.DRAGOVER, this.handleDragOver, false, this);
	goog.events.listen(this.divDragDrop_, goog.events.EventType.DROP, this.handleDropFile, false, this);
	goog.events.listen(this.fileContainer_, goog.events.EventType.CHANGE, this.handleBrowseFile, false, this);
	goog.events.listen(importFileButton_, goog.events.EventType.CLICK, this.addXmlLayer, false, this);

	this.importshpForm_ = this.element_.querySelector('#importForm');
	this.shpFileContainer_ = this.importshpForm_.querySelector('input[type=file]');
	goog.events.listen(this.importshpForm_, goog.events.EventType.SUBMIT, this.readShpFile, false, this);
};

/**
 * This function updates the input text and queueFile
 *
 * @private
 * @function
 * @param {File} file - Selected file
 * @api stable
 */
M.control.advLSAddFileControl.prototype.updateShpFile = function (file) {
	if (file.size <= this.maxSizeShapefile) {
		var labelFile = this.importshpForm_.querySelector('#inputFile');
		labelFile.value = file.name;
		if(this.zipFile_=== null){
			this.zipFile_ = file;
		} 
	} else {
		M.dialog.error('El fichero tiene un tamaño superior a 50 MB');
	}
};

/**
 * This function checks if the file is already loaded in map
 *
 * @private
 * @function
 * @param {File} file - Selected file
 * @api stable
 */
M.control.advLSAddFileControl.prototype.isFileLayerLoaded = function (file, shpFileName) {
	var fileName;
	if (file.type !== "application/zip") {
    	fileName = file.name.replace(/\s/g, '');
	} else {
		fileName = shpFileName;
	}
	var fileNameCleaned = fileName;
	if(fileName.indexOf(".")>-1){
		fileNameCleaned = fileName.substring(0, fileName.indexOf("."));	
	}
	var loadedWfsLayers = this.base_.map_.getMapImpl().getLayers();
	for(let i = 0; i<loadedWfsLayers.getLength();i++){
		var loadedWfsLayerName = loadedWfsLayers.item(i).get('name');
		if (loadedWfsLayerName == fileNameCleaned) {
			M.dialog.info('La capa ' + fileNameCleaned + ' ya ha sido añadida al catálogo');
			return true;
		}
	}

	return false;
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
M.control.advLSAddFileControl.prototype.importXmlFile = function (file, type) {
	var this_ = this;
	var reader;
	var inputtext;
	reader = new FileReader();
	inputtext = this.divContainer_.querySelector("input[type=text]");
	inputtext.value = escape(file.name).replace(/\s/g, '');
	reader.onload = function (e) {
		var xml = file;
		var xmlContent = e.srcElement.result;
		var blob = new Blob([xml], {
			type: 'text/plain'
		});
		this_.queueXmlFile_ = {
				url: window.URL.createObjectURL(blob),
				name: inputtext.value,
				type: type,
				xml: xmlContent
		};
	};
	reader.readAsText(file);
};
/**
 * This function reads the SHP layer
 *
 * @private
 * @function
 * @param {object} Event
 * @api stable
 */
M.control.advLSAddFileControl.prototype.readShpFile = function (event) {
	event.preventDefault();
	if (this.zipFile_!==null) {
			this.getGeoJsonFromShapefile(this.zipFile_);	
	} else {
		M.dialog.info("Seleccione un fichero");
	}
};

/**
 * This function add the KML layer
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSAddFileControl.prototype.addXmlLayer = function () {
	var this_ = this;
	if (this.queueXmlFile_ !== null) {
		if(this.isFileLayerLoaded(this.queueXmlFile_)){
			return;
		}		
		var importedLayer = this.getImpl().addXmlLayer(this.base_.map_, this.queueXmlFile_);
		importedLayer.then(function(importedLayer){
			if (!M.utils.isNullOrEmpty(importedLayer)) {
				var layerGeometryType_ = this_.getImpl().getLayerGeometryType(importedLayer);
				if(layerGeometryType_ !==null){
					var layerStyles_ = this_.getImpl().getLayerStyles(importedLayer);
					var layer = {
							Name: this_.queueXmlFile_.name.substring(0, this_.queueXmlFile_.name.indexOf(".")), 
							formatType: this_.queueXmlFile_.type, 
							layerGeometryType: layerGeometryType_, 
							layerStyles: layerStyles_
					};
					
					this_.base_.addVectorLayer(layer);
					this_.close();
					M.dialog.info("La capa se ha añadido al catálogo correctamente");	
				}
				else{
					M.dialog.error('Error al añadir la capa al catálogo');
				}
			} else {
				M.dialog.error('Error al añadir la capa al catálogo');
			}
		});
	} else {
		M.dialog.info("Seleccione un fichero");
	}	
};

/**
 * This function calls the integration service that reads and transforms the shapefile into a GML file and adds the layer to map
 *
 * @private
 * @function
 * @param {File} file - The zip file
 * @api stable
 */
M.control.advLSAddFileControl.prototype.getGeoJsonFromShapefile = function (file) {
	var this_ = this;
	var fr = new FileReader();
	M.advLSSpinner.show();
	fr.onload = function (fileLoadedEvent) {
		shp(fileLoadedEvent.target.result).then(function (geojson) {
				if (geojson instanceof Array === true) {
					for (let i = 0; i < geojson.length; i++) {
						this_.manageGeoJsonFromShapefile(geojson[i], file, name);	
					}
				} else {
					this_.manageGeoJsonFromShapefile(geojson, file);	
				}
			this_.importshpForm_.reset();
			M.advLSSpinner.close();
		});
	};
	fr.readAsArrayBuffer(file);	
};

/**
 * This function handles the drag of the file
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSAddFileControl.prototype.manageGeoJsonFromShapefile = function (geojson, file) {
	var shpFileName = geojson.fileName.substring(geojson.fileName.indexOf("/") + 1, geojson.fileName.length);
	if (!this.isFileLayerLoaded(this.zipFile_, shpFileName)) {
		var importedLayer = this.getImpl().addShpLayerByGeoJson(this.base_.map_, geojson, shpFileName);
		if (!M.utils.isNullOrEmpty(importedLayer)) {
			var layerGeometryType = this.getImpl().getLayerGeometryType(importedLayer);
			var layerStyles_ = this.getImpl().getLayerStyles(importedLayer);
			var layer = {
					Name: shpFileName,  
					formatType: 'SHP', 
					layerGeometryType: layerGeometryType,
					layerStyles: layerStyles_
			};
			
			this.base_.addVectorLayer(layer);
			this.close();
			M.dialog.info("La capa se ha añadido al catálogo correctamente");
		} else {
			M.dialog.error('Error al añadir la capa al catálogo');
		}
	} 	
};


/**
 * This function handles the file type in order to show the accurate DOM elements from template
 *
 * @private
 * @function
 * @param {File} file - The file
 * @api stable
 */
M.control.advLSAddFileControl.prototype.updateFileAdapter = function (file) {

	var shpContainer = this.element_.querySelector('#addShpContainer');
	var xmlContainer = this.element_.querySelector('#addXmlContainer');
	var type = null;

	if(file.name.indexOf(".zip")>-1){
		xmlContainer.classList.add("hidden");
		shpContainer.classList.remove("hidden");
		this.updateShpFile(file);
		return;
	}
	else if(file.name.indexOf(".kml")>-1){
		type = "KML";
	}
	else if(file.name.indexOf(".gml")>-1){
		type = "GML";
	}
	else{
		this.importshpForm_.reset();
		M.dialog.error('El archivo ' + file.name + ' no es un archivo válido');
		return;
	}

	shpContainer.classList.add("hidden");
	xmlContainer.classList.remove("hidden");
	this.importXmlFile(file, type);
};

/**
 * This function handles the drag of the file
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSAddFileControl.prototype.handleDragOver = function (evt) {
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
M.control.advLSAddFileControl.prototype.handleBrowseFile = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	this.updateFileAdapter(evt.target.files[0]);
};

/**
 * This function handles the dropped kml file
 *
 * @private
 * @function
 * @param {object} evt - Drop event
 * @api stable
 */
M.control.advLSAddFileControl.prototype.handleDropFile = function (evt) {
	evt.stopPropagation();
	evt.preventDefault();
	this.updateFileAdapter(evt.event_.dataTransfer.files[0]);
};

/**
 * This function returns the implementation object of this control
 *
 * @public
 * @function
 * @returns {object} the implementation object of this control
 * @api stable
 */
M.control.advLSAddFileControl.prototype.getImpl = function () {
	return this.impl_;
};

/**
 * This function closes the floating panel of this control
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSAddFileControl.prototype.close = function () {
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
M.control.advLSAddFileControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.advLSAddFileControl) {
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
M.control.advLSAddFileControl.NAME = 'advLSAddFileControl';

/**
 * Template path for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSAddFileControl.TEMPLATE = 'advLSAddFile.html';
if(M.config.devel){
	M.control.advLSAddFileControl.TEMPLATE = 'src/advLS/templates/advLSAddFile.html';
}

