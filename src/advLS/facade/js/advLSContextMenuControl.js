goog.provide('P.control.advLSContextMenuControl');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSContextMenuControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.advLSContextMenuControl = (function (base) {
	// checks if the implementation can create layerimportControl
	if (M.utils.isUndefined(M.impl.control.advLSContextMenuControl)) {
		M.exception('La implementación usada no puede crear controles advLSContextMenuControl');
	}

	/**
	 * Parent control composition
	 * @private
	 * @type {M.control.advLSContextMenuControl}
	 */
	this.base_ = base;
	/**
	 * Facade map
	 * @private
	 * @type {M.Map}
	 */
	this.map_ = base.map_;
	/**
	 * AdvLS DAO control
	 * @private
	 * @type {M.control.advLSDAO}
	 */
	this.advLSDAO_ = base.advLSDAO_;
	/**
	 * m-areas element ( Map tree )
	 * @private
	 * @type {HTMLElement}
	 */
	this.mapTree_ = null;
	/**
	 * Folder context menu
	 * @private
	 * @type {HTMLElement}
	 */
	this.folderContextMenu_ = null; 
	/**
	 * Layer context menu
	 * @private
	 * @type {HTMLElement}
	 */
	this.layerContextMenu_ = null; 
	/**
	 * Add folder item
	 * @private
	 * @type {HTMLElement}
	 */
	this.advLSAddFolderControl_ = null;
	/**
	 * Add WMS layer item
	 * @private
	 * @type {HTMLElement}
	 */
	this.advLSAddWMSControl_ = null;
	/**
	 * Add file layer item
	 * @private
	 * @type {HTMLElement}
	 */
	this.advLSAddFileControl_ = null;
	/**
	 * Add file layer item
	 * @private
	 * @type {HTMLElement}
	 */
	this.advLSTocRepoControl_ = null;
	/**
	 * Predefined WMS server array
	 * @private
	 * @type {Array}
	 */
	this.predefServersArray_ = this.base_.predefServersArray_;
	/**
	 * Node on map tree clicked on in order to show the context menu
	 * @private
	 * @type {HTMLElement}
	 */
	this.currentNode_ = null;
	/**
	 * Implementation of this control
	 * @private
	 * @type {M.impl.control.advLSContextMenuControl}
	 */
	this.impl_ = new M.impl.control.advLSContextMenuControl();

});
goog.inherits(M.control.advLSContextMenuControl, M.Control);


/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.createView = function (map) {
	var this_ = this;
	return new Promise(function (success) {
		M.template.compile(M.control.advLSContextMenuControl.TEMPLATE,{'jsonp': false}).
		then(function (html) {
			this_.addEvents(html);
			success(html);
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
M.control.advLSContextMenuControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.layerContextMenu_ = this.element_.querySelector('#advLSmenu-layer');
	this.folderContextMenu_ = this.element_.querySelector('#advLSmenu-folder');
	this.mapTree_ = document.querySelector('.m-mapea-container');
	this.mapTree_.appendChild(this.layerContextMenu_);
	this.mapTree_.appendChild(this.folderContextMenu_);

	document.addEventListener("contextmenu", function (e) {
		e.preventDefault();
	}, false);

	var mapTreeDiv = this.mapTree_.querySelector('#map-tree');
	var treeNodes = mapTreeDiv.querySelectorAll('.props-up');
	for (let i=0;i<treeNodes.length;i++){
		goog.events.listen(treeNodes[i], goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
	}

	var loadTocFile = this.folderContextMenu_.querySelector('#advLSmenu-btn-loadTocFromFile');
	goog.events.listen(loadTocFile, goog.events.EventType.CLICK, this.openLoadTocFileDialog, false, this);

	var saveTocInFile = this.folderContextMenu_.querySelector('#advLSmenu-btn-saveTocInFile');
	goog.events.listen(saveTocInFile, goog.events.EventType.CLICK, this.downloadTOCFile, false, this);

	var addFolderBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-addFolder');
	goog.events.listen(addFolderBtn, goog.events.EventType.CLICK, this.openAddFolderDialog, false, this);

	var deleteFolderBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-deleteFolder');
	goog.events.listen(deleteFolderBtn, goog.events.EventType.CLICK, this.confirmDialogDeleteFolder, false, this);

	var activateLayersBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-activateLayers');
	goog.events.listen(activateLayersBtn, goog.events.EventType.CLICK, this.activateLayers, false, this);

	var deactivateLayersBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-deactivateLayers');
	goog.events.listen(deactivateLayersBtn, goog.events.EventType.CLICK, this.deactivateLayers, false, this);

	var showLegendBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-showLegend');
	goog.events.listen(showLegendBtn, goog.events.EventType.CLICK, this.showLegend, false, this);

	var hideLegendBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-hideLegend');
	goog.events.listen(hideLegendBtn, goog.events.EventType.CLICK, this.hideLegend, false, this);

	var fAddWMSLayerBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-addWMSLayer');
	goog.events.listen(fAddWMSLayerBtn, goog.events.EventType.CLICK, this.openAddWMSLayerDialog, false, this);

	var fAddFileLayerBtn = this.folderContextMenu_.querySelector('#advLSmenu-btn-addFileLayer');
	goog.events.listen(fAddFileLayerBtn, goog.events.EventType.CLICK, this.addLayerFromFile, false, this);

	var lAddWMSLayerBtn = this.layerContextMenu_.querySelector('#advLSmenu-btn-addWMSLayer');
	goog.events.listen(lAddWMSLayerBtn, goog.events.EventType.CLICK, this.openAddWMSLayerDialog, false, this);

	var lAddFileLayerBtn = this.layerContextMenu_.querySelector('#advLSmenu-btn-addFileLayer');
	goog.events.listen(lAddFileLayerBtn, goog.events.EventType.CLICK, this.addLayerFromFile, false, this);

	var deleteLayerBtn = this.layerContextMenu_.querySelector('#advLSmenu-btn-deleteLayer');
	goog.events.listen(deleteLayerBtn, goog.events.EventType.CLICK, this.confirmDialogDeleteLayer, false, this);

	var zoomToLayerBtn = this.layerContextMenu_.querySelector('#advLSmenu-btn-zoomToLayer');
	goog.events.listen(zoomToLayerBtn, goog.events.EventType.CLICK, this.zoomToLayer, false, this);
};

/**
 * This function shows the context menu
 * 
 * @private
 * @function
 * @param {object} evt - Click event
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.showContextMenu = function (evt) {
	var this_ = this;
	evt.preventDefault();
	this.closeDialog();

	this.currentNode_ = evt.currentTarget.parentNode.parentNode;
	var elementType = this.currentNode_.getAttribute("dt-type");
	var elementReadOnly = this.currentNode_.getAttribute("dt-readonly");
	var isBaseElement = this.currentNode_.getAttribute("dt-baselayer");
	var isVectorLayer = this.currentNode_.getAttribute("dt-vector");

	this.folderContextMenu_.classList.remove('show-advLSmenu');
	this.layerContextMenu_.classList.remove('show-advLSmenu');
	
	var offsets = document.getElementById('mapjs').getBoundingClientRect();
	
	if(elementType==="folder"){
		this.folderContextMenu_.style.left = (evt.clientX - offsets.left) + 'px';
		this.folderContextMenu_.style.top = (evt.clientY - offsets.top) + 'px';
		this.folderContextMenu_.classList.add('show-advLSmenu');
		this.folderContextMenu_.querySelector ("#advLSmenu-loadToc").style.display = "block";
		this.folderContextMenu_.querySelector ("#advLSmenu-loadTocFromFile").style.display = "block";
		this.folderContextMenu_.querySelector ("#advLSmenu-saveTocInFile").style.display = "block";

		if(isBaseElement==="true"){
			this.folderContextMenu_.querySelector ("#advLSmenu-activateLayers").classList.add('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-deactivateLayers").classList.add('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-addLayer").classList.add('disabled');	
		}
		else{
			this.folderContextMenu_.querySelector ("#advLSmenu-activateLayers").classList.remove('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-deactivateLayers").classList.remove('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-addLayer").classList.remove('disabled');	
		}

		if(elementReadOnly==="true"){
			this.folderContextMenu_.querySelector ("#advLSmenu-deleteFolder").classList.add('disabled');	
		}
		else{
			this.folderContextMenu_.querySelector ("#advLSmenu-deleteFolder").classList.remove('disabled');
		}

		if(this.currentNode_.querySelector(".map-child").children.length===0 || isBaseElement==="true"){
			this.folderContextMenu_.querySelector ("#advLSmenu-activateLayers").classList.add('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-deactivateLayers").classList.add('disabled');
		}
		else{
			this.folderContextMenu_.querySelector ("#advLSmenu-activateLayers").classList.remove('disabled');
			this.folderContextMenu_.querySelector ("#advLSmenu-deactivateLayers").classList.remove('disabled');
		}

		goog.events.listen(this.folderContextMenu_, goog.events.EventType.MOUSELEAVE, function(){
			this_.folderContextMenu_.classList.remove('show-advLSmenu');
		}, false, this);

		goog.events.listen(this.folderContextMenu_, goog.events.EventType.CLICK, function(){
			this_.folderContextMenu_.classList.remove('show-advLSmenu');
		}, false, this);
	}
	else if(elementType==="layer" && isBaseElement!=="true"){
		this.layerContextMenu_.style.left = (evt.clientX - offsets.left) + 'px';
		this.layerContextMenu_.style.top = (evt.clientY - offsets.top) + 'px';
		this.layerContextMenu_.classList.add('show-advLSmenu');

		if(elementReadOnly==="true"){
			this.layerContextMenu_.querySelector ("#advLSmenu-deleteLayer").classList.add('disabled');	
		}
		else{
			this.layerContextMenu_.querySelector ("#advLSmenu-deleteLayer").classList.remove('disabled');
		}

		if(isVectorLayer==="true"){
			this.layerContextMenu_.querySelector ("#advLSmenu-zoomToLayer").classList.remove('disabled');	
		}
		else{
			this.layerContextMenu_.querySelector ("#advLSmenu-zoomToLayer").classList.add('disabled');
		}

		goog.events.listen(this.layerContextMenu_, goog.events.EventType.MOUSELEAVE, function(){
			this_.layerContextMenu_.classList.remove('show-advLSmenu');
		}, false, this);

		goog.events.listen(this.layerContextMenu_, goog.events.EventType.CLICK, function(){
			this_.layerContextMenu_.classList.remove('show-advLSmenu');
		}, false, this);
	}

	document.body.addEventListener('click',  function(){
		this_.folderContextMenu_.classList.remove('show-advLSmenu');
	}, true); 
};

/**
 * This function shows the file selector dialog for loading locally saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.closeDialog = function () {
	var mapContainer = document.querySelector("#mapjs");
	var dialog = mapContainer.querySelector("#dialog-box-advLS");
	if(dialog!==null){
		mapContainer.removeChild(dialog);	
	}
};

/**
 * This function shows the TOC repository dialog for loading bd saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.downloadTOCFile = function () {
	var this_ = this;
	this.generateZipFromTOC()
	.then(function(content) {
		saveAs(content, "reafa-catalog.zip");
	});
};

/**
 * This function shows the file selector dialog for loading locally saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.openLoadTocFileDialog = function () {
	this.closeDialog();
	this.advLSToc2FileControl_ = new M.control.advLSToc2FileControl(this);
};

/**
 * This function shows the TOC repository dialog for loading bd saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.readTocFile = function (zipFile) {
	var this_ = this;
	M.catalogSpinner.show();
	var contFull = 0;
	var tocObject = {};
	tocObject.vectors = [];
	var filesLength = Object.keys(zipFile.files).length;
	Object.keys(zipFile.files).forEach(function (filename) {
		zipFile.files[filename].async('string').then(function (fileData) {
			++contFull;
			if(filename==="toc.json"){
				tocObject.main = fileData;
			}
			else{
				tocObject.vectors.push({file: filename, data:fileData});
			}   
			if(contFull===filesLength){
				this_.base_.loadTOC(tocObject);
			}
		});
	});
};

/**
 * This function shows the TOC repository dialog for loading bd saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.generateZipFromTOC = function () {
	var exportObj = this.base_.serializeTOC();
	var zip = new JSZip();
	var tocBlob = new Blob([JSON.stringify(exportObj)], {type: "data:application/json;charset=utf-8"});
	zip.file("toc.json", tocBlob);
	for (let i=0;i<this.base_.geoJsonVectorLayersArray_.length;i++){
		zip.file(this.base_.geoJsonVectorLayersArray_[i].id+".json", JSON.stringify(this.base_.geoJsonVectorLayersArray_[i].content));	
	}

	return zip.generateAsync({type:"blob"});
};

/**
 * This function shows the legend for current folder node
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.showLegend = function () {
	this.base_.expandNode(this.currentNode_);
	var layerNodes = this.currentNode_.querySelectorAll('.prop-legend');
	for(let i=0;i<layerNodes.length;i++){
		layerNodes[i].style.display="block";
	}
};

/**
 * This function hides the legend for current folder node
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.hideLegend = function () {
	var layerNodes = this.currentNode_.querySelectorAll('.prop-legend');
	for(let i=0;i<layerNodes.length;i++){
		layerNodes[i].style.display="none";
	}
};

/**
 * This function opens add folder dialog for typing the folder name
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.openAddFolderDialog = function () {
	this.closeDialog();
	var addFolderFn = this.addFolder.bind(this);
	this.advLSAddFolderControl_ = new M.control.advLSAddFolderControl({title: "Añadir carpeta", placeholder: "Nombre de la carpeta"}, addFolderFn);
};

/**
 * This function adds a folder into the map tree
 *
 * @public
 * @function
 * @param {string} Folder name
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.addFolder = function (folderName) {
	var folderObject = {};
	folderObject.id = "id-"+folderName;
	folderObject.label = folderName;
	folderObject.type = "folder";
	folderObject.isOpenOnStartUp = false;
	folderObject.active = true;
	folderObject.isBaseLayer = false;
	folderObject.opacity = 1;
	folderObject.meta = null;
	folderObject.children = [];
	folderObject.readOnly = false;

	var node = this.base_.createNode(folderObject, false);
	var dtId = this.currentNode_.getAttribute('dt-id');
	if(dtId==="root"){
		var mapChild = this.currentNode_.querySelector(".map-child");
		mapChild.children[0].parentNode.insertBefore(node, mapChild.children[0]);
	}
	else{
		this.currentNode_.parentNode.insertBefore(node, this.currentNode_);
	}

	this.base_.registerEvents(node.parentNode);
	this.advLSAddFolderControl_.close();
	goog.events.listen(node.querySelector('.props-up'), goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
};

/**
 * This function shows the delete folder confirm dialog
 * 
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.confirmDialogDeleteFolder = function() {
	var acceptFn = this.deleteFolder.bind(this);
	M.advLSDialog.show('¿Desea eliminar la carpeta?',
			'Eliminar carpeta', 'info', acceptFn);
};

/**
 * This function deletes a folder in the map tree
 * 
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.deleteFolder = function () {
	var layerNodes = this.currentNode_.querySelectorAll('div[dt-type="layer"]');
	for(let i=0;i<layerNodes.length;i++){
		var layer = this.base_.getLayerFromNode(layerNodes[i]);
		if(layer!==undefined){
			var isVectorLayer = layerNodes[i].getAttribute("dt-vector");
			if(isVectorLayer!==undefined && isVectorLayer==="true"){
				this.impl_.removeVectorLayer(this.map_, layer);	
			}
			else{
				this.impl_.removeWMSLayer(this.map_, layer);
			}	
		}
	}
	this.currentNode_.parentNode.removeChild(this.currentNode_);
	M.advLSDialog.close();
};

/**
 * This function activates the layers under current folder node
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.activateLayers = function () {
	this.base_.activateLayersFromFolder(this.currentNode_,true);
};

/**
 * This function deactivates the layers under current folder node
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.deactivateLayers = function () {
	this.base_.activateLayersFromFolder(this.currentNode_,false);
};

/**
 * This function shows the delete folder confirm dialog
 * 
 * @private
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.openAddWMSLayerDialog = function () {
	this.closeDialog();
	this.advLSAddWMSControl_ = new M.control.advLSAddWMSControl(this);
};

/**
 * This function adds a WMS layer into the map tree
 *
 * @public
 * @function
 * @param {string} Server url
 * @param {object} WMS layer
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.addWMSLayer = function (serverUrl, layer) {
	var layerObject = {};
	layerObject.id = layer.Name;
	layerObject.type = "layer";
	layerObject.active = true;
	layerObject.minResolution = null;
	layerObject.maxResolution = null;
	layerObject.isBaseLayer = false;
	layerObject.opacity = 1;
	layerObject.format = "application/vnd.ogc.gml";
	layerObject.formatType = "WMS";
	layerObject.mandatory = false;
	layerObject.exclusive = false;
	layerObject.identify = true;
	layerObject.layerInfo = {};
	layerObject.layerInfo.url = serverUrl;
	layerObject.layerInfo.name = layer.Name;
	layerObject.layerInfo.label = layer.Title;
	layerObject.layerInfo.tiled = false;
	layerObject.layerInfo.displayInLayerSwitcher = true;
	layerObject.readOnly = false;

	this.base_.advLSLayerCreatorControl_.initLayersFromNode(layerObject);
	var node = this.base_.createNode(layerObject, false);
	var elementType = this.currentNode_.getAttribute("dt-type");

	if(elementType==="layer"){
		this.currentNode_.parentNode.insertBefore(node, this.currentNode_);
	}
	else if(elementType==="folder"){
		this.currentNode_.classList.remove("collapsed");
		this.currentNode_.classList.add("expanded");
		var firstLayer = this.currentNode_.querySelector('.map-child').querySelector('.map-node'); 
		if(firstLayer!==null){
			firstLayer.parentNode.insertBefore(node, firstLayer);
		}
		else{
			this.currentNode_.querySelector('.map-child').appendChild(node);	
		}
	}

	this.base_.registerEvents(node.parentNode);
	this.base_.reorderLayers();
	goog.events.listen(node.querySelector('.props-up'), goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
};

/**
 * This function adds a vector layer into the map tree
 *
 * @public
 * @function
 * @param {object} WMS layer
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.addVectorLayer = function (layer) {
	var layerObject = {};
	layerObject.id = layer.Name;
	layerObject.type = "layer";
	layerObject.active = true;
	layerObject.minResolution = null;
	layerObject.maxResolution = null;
	layerObject.isBaseLayer = false;
	layerObject.opacity = 1;
	layerObject.format = "application/vnd.ogc.gml";
	layerObject.formatType = layer.formatType;
	layerObject.geometryType = layer.layerGeometryType;
	layerObject.style = {};
	layerObject.style.fillColor = layer.layerStyles.fillColor;
	layerObject.style.strokeColor = layer.layerStyles.strokeColor;
	layerObject.mandatory = false;
	layerObject.exclusive = false;
	layerObject.identify = false;
	layerObject.layerInfo = {};
	layerObject.layerInfo.url = null;
	layerObject.layerInfo.name = layer.Name;
	layerObject.layerInfo.label = layer.Name;
	layerObject.layerInfo.tiled = false;
	layerObject.layerInfo.displayInLayerSwitcher = true;
	layerObject.readOnly = false;
	layerObject.vector = true;

	var node = this.base_.createNode(layerObject, false);
	var elementType = this.currentNode_.getAttribute("dt-type");

	if(elementType==="layer"){
		this.currentNode_.parentNode.insertBefore(node, this.currentNode_);
	}
	else if(elementType==="folder"){
		this.currentNode_.classList.replace("collapsed","expanded");
		var firstLayer = this.currentNode_.querySelector('.map-child').querySelector('.map-node'); 
		if(firstLayer!==null){
			firstLayer.parentNode.insertBefore(node, firstLayer);
		}
		else{
			this.currentNode_.querySelector('.map-child').appendChild(node);	
		}
	}

	this.base_.registerEvents(node.parentNode);
	this.base_.reorderLayers();
	goog.events.listen(node.querySelector('.props-up'), goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.addLayerFromFile = function () {
	this.closeDialog();
	this.advLSAddFileControl_ = new M.control.advLSAddFileControl(this);
};

/**
 * This function remove unsaved changes
 * 
 * @private
 * @function
 */
M.control.advLSContextMenuControl.prototype.confirmDialogDeleteLayer = function() {
	var acceptFn = this.deleteLayer.bind(this);
	M.advLSDialog.show('¿Desea eliminar la capa?',
			'Eliminar capa', 'info', acceptFn);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.deleteLayer = function (evt) {
	var layer = this.base_.getLayerFromNode(this.currentNode_);
	var isVectorLayer = this.currentNode_.getAttribute("dt-vector");
	if(isVectorLayer==="true"){
		this.impl_.removeVectorLayer(this.map_, layer);
	}
	else{
		this.impl_.removeWMSLayer(this.map_, layer);
	}
	this.currentNode_.parentNode.removeChild(this.currentNode_);
	M.advLSDialog.close();
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.zoomToLayer = function (evt) {
	var layer = this.base_.getLayerFromNode(this.currentNode_);
	this.impl_.zoomToLayer(this.map_, layer);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.advLSContextMenuControl.prototype.equals = function (obj) {
	return (obj instanceof M.control.advLSContextMenuControl);
};

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSContextMenuControl.NAME = 'advLSContextMenu';

/**
 * Template for this control
 * @const
 * @type {String}
 * @public
 * @api stable
 */
M.control.advLSContextMenuControl.TEMPLATE = 'advLSContextMenu.html';
if(M.config.devel){
	M.control.advLSContextMenuControl.TEMPLATE = 'src/advLS/templates/advLSContextMenu.html';
}

