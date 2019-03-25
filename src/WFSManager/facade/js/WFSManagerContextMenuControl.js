goog.provide('P.control.WFSManagerContextMenuControl');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a WFSManagerContextMenuControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.WFSManagerContextMenuControl = (function (base) {
	// checks if the implementation can create layerimportControl
	if (M.utils.isUndefined(M.impl.control.WFSManagerContextMenuControl)) {
		M.exception('La implementación usada no puede crear controles WFSManagerContextMenuControl');
	}

	/**
	 * Parent control composition
	 * @private
	 * @type {M.control.WFSManagerContextMenuControl}
	 */
	this.base_ = base;
	/**
	 * Facade map
	 * @private
	 * @type {M.Map}
	 */
	this.map_ = base.map_;
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
	this.serviceContextMenu_ = null; 
	/**
	 * Add folder item
	 * @private
	 * @type {HTMLElement}
	 */
	this.WFSManagerAddFolderControl_ = null;
	/**
	 * Add WMS layer item
	 * @private
	 * @type {HTMLElement}
	 */
	this.WFSManagerAddServiceControl_ = null;
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
	 * @type {M.impl.control.WFSManagerContextMenuControl}
	 */
	this.impl_ = new M.impl.control.WFSManagerContextMenuControl();

});
goog.inherits(M.control.WFSManagerContextMenuControl, M.Control);


/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.createView = function (map) {
	var this_ = this;
	return new Promise(function (success) {
		M.template.compile(M.control.WFSManagerContextMenuControl.TEMPLATE,{'jsonp': false}).
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
M.control.WFSManagerContextMenuControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.serviceContextMenu_ = this.element_.querySelector('#WFSManagermenu-service');
	this.folderContextMenu_ = this.element_.querySelector('#WFSManagermenu-folder');
	this.mapTree_ = document.querySelector('.m-mapea-container');
	this.mapTree_.appendChild(this.serviceContextMenu_);
	this.mapTree_.appendChild(this.folderContextMenu_);

	document.addEventListener("contextmenu", function (e) {
		e.preventDefault();
	}, false);

	var mapTreeDiv = this.mapTree_.querySelector('#wfs-manager');
	var treeNodes = mapTreeDiv.querySelectorAll('.props-up');
	for (let i=0;i<treeNodes.length;i++){
		goog.events.listen(treeNodes[i], goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
	}

	var loadTocFile = this.folderContextMenu_.querySelector('#WFSManagermenu-btn-loadTocFromFile');
	goog.events.listen(loadTocFile, goog.events.EventType.CLICK, this.openLoadTocFileDialog, false, this);

	var saveTocInFile = this.folderContextMenu_.querySelector('#WFSManagermenu-btn-saveTocInFile');
	goog.events.listen(saveTocInFile, goog.events.EventType.CLICK, this.downloadTOCFile, false, this);

	var addFolderBtn = this.folderContextMenu_.querySelector('#WFSManagermenu-btn-addFolder');
	goog.events.listen(addFolderBtn, goog.events.EventType.CLICK, this.openAddFolderDialog, false, this);

	var deleteFolderBtn = this.folderContextMenu_.querySelector('#WFSManagermenu-btn-deleteFolder');
	goog.events.listen(deleteFolderBtn, goog.events.EventType.CLICK, this.confirmDialogDeleteFolder, false, this);

	var faddWFSServiceBtn = this.folderContextMenu_.querySelector('#WFSManagermenu-btn-addService');
	goog.events.listen(faddWFSServiceBtn, goog.events.EventType.CLICK, this.openAddWFSServiceDialog, false, this);
	
	var saddWFSServiceBtn = this.serviceContextMenu_.querySelector('#WFSManagermenu-btn-addService');
	goog.events.listen(saddWFSServiceBtn, goog.events.EventType.CLICK, this.openAddWFSServiceDialog, false, this);
	
	var ldeleteWFSServiceBtn = this.serviceContextMenu_.querySelector('#WFSManagermenu-btn-deleteService');
	goog.events.listen(ldeleteWFSServiceBtn, goog.events.EventType.CLICK, this.confirmDialogDeleteService, false, this);

};

/**
 * This function shows the context menu
 * 
 * @private
 * @function
 * @param {object} evt - Click event
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.showContextMenu = function (evt) {
	var this_ = this;
	evt.preventDefault();

	this.currentNode_ = evt.currentTarget.parentNode.parentNode;
	var elementType = this.currentNode_.getAttribute("dt-type");
	var elementReadOnly = this.currentNode_.getAttribute("dt-readonly");

	this.folderContextMenu_.classList.remove('show-WFSManagermenu');
	this.serviceContextMenu_.classList.remove('show-WFSManagermenu');
	
	var offsets = document.getElementById('mapjs').getBoundingClientRect();
	
	if(elementType==="folder"){
		this.folderContextMenu_.style.left = (evt.clientX - offsets.left) + 'px';
		this.folderContextMenu_.style.top = (evt.clientY - offsets.top) + 'px';
		this.folderContextMenu_.classList.add('show-WFSManagermenu');

		if(elementReadOnly==="true"){
			this.folderContextMenu_.querySelector ("#WFSManagermenu-deleteFolder").classList.add('disabled');
		}
		else{
			this.folderContextMenu_.querySelector ("#WFSManagermenu-deleteFolder").classList.remove('disabled');
		}

		goog.events.listen(this.folderContextMenu_, goog.events.EventType.MOUSELEAVE, function(){
			this_.folderContextMenu_.classList.remove('show-WFSManagermenu');
		}, false, this);

		goog.events.listen(this.folderContextMenu_, goog.events.EventType.CLICK, function(){
			this_.folderContextMenu_.classList.remove('show-WFSManagermenu');
		}, false, this);
	}
	else if(elementType==="service"){
		this.serviceContextMenu_.style.left = (evt.clientX - offsets.left) + 'px';
		this.serviceContextMenu_.style.top = (evt.clientY - offsets.top) + 'px';
		this.serviceContextMenu_.classList.add('show-WFSManagermenu');

		if(elementReadOnly==="true"){
			this.serviceContextMenu_.querySelector ("#WFSManagermenu-deleteService").classList.add('disabled');	
		}
		else{
			this.serviceContextMenu_.querySelector ("#WFSManagermenu-deleteService").classList.remove('disabled');
		}
		goog.events.listen(this.serviceContextMenu_, goog.events.EventType.MOUSELEAVE, function(){
			this_.serviceContextMenu_.classList.remove('show-WFSManagermenu');
		}, false, this);

		goog.events.listen(this.serviceContextMenu_, goog.events.EventType.CLICK, function(){
			this_.serviceContextMenu_.classList.remove('show-WFSManagermenu');
		}, false, this);
	}

	document.body.addEventListener('click',  function(){
		this_.folderContextMenu_.classList.remove('show-WFSManagermenu');
	}, true); 
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.getAllServices = function() {
    return this.base_.getAllServices();
};

/**
 * This function shows the file selector dialog for loading locally saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.closeDialog = function () {
	var mapContainer = document.querySelector("#mapjs");
	var dialog = mapContainer.querySelector("#dialog-box-WFSManager");
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
M.control.WFSManagerContextMenuControl.prototype.downloadTOCFile = function () {
	this.generateZipFromTOC()
	.then(function(content) {
		M.WFSManagerUtils.saveAs(content, M.WFSManagerUtils.generateUUID()+".zip");
	});
};

/**
 * This function shows the file selector dialog for loading locally saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.openLoadTocFileDialog = function () {
	this.closeDialog();
	this.WFSManagerToc2FileControl_ = new M.control.WFSManagerToc2FileControl(this);
};

/**
 * This function shows the TOC repository dialog for loading bd saved TOC
 *
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.readTocFile = function (zipFile) {
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
M.control.WFSManagerContextMenuControl.prototype.generateZipFromTOC = function () {
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
 * This function opens add folder dialog for typing the folder name
 *
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.openAddFolderDialog = function () {
	this.closeDialog();
	var addFolderFn = this.addFolder.bind(this);
	this.WFSManagerAddFolderControl_ = new M.control.WFSManagerAddFolderControl({title: "Añadir carpeta", placeholder: "Nombre de la carpeta"}, addFolderFn);
};

/**
 * This function adds a folder into the map tree
 *
 * @public
 * @function
 * @param {string} Folder name
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.addFolder = function (folderName) {
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

	this.base_.registerEvents(node.parentNode, true);
	this.WFSManagerAddFolderControl_.close();
	goog.events.listen(node.querySelector('.props-up'), goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
};

/**
 * This function shows the delete folder confirm dialog
 * 
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.confirmDialogDeleteFolder = function() {
	var acceptFn = this.deleteFolder.bind(this);
	M.WFSManagerDialog.show('¿Desea eliminar la carpeta?',
			'Eliminar carpeta', 'info', acceptFn);
};

/**
 * This function deletes a folder in the map tree
 * 
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.deleteFolder = function () {
	if(this.currentNode_.querySelector("input[type='radio']:checked")) this.base_.setDefaultServiceActive();
	var radioButtons = this.currentNode_.querySelectorAll("input[type='radio']");
	for(var i = 0; i<radioButtons.length; i++) {
		this.base_.removeService(radioButtons[i]);
	}
	this.currentNode_.parentNode.removeChild(this.currentNode_);
	M.WFSManagerDialog.close();
};

/**
 * This function shows the delete folder confirm dialog
 * 
 * @private
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.openAddWFSServiceDialog = function () {
	this.closeDialog();
	this.WFSManagerAddServiceControl_ = new M.control.WFSManagerAddServiceControl(this);
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
M.control.WFSManagerContextMenuControl.prototype.addWFSService = function (serverUrl, layer) {
	var layerObject = {};
	layerObject.id = layer.Name;
	layerObject.type = "service";
	layerObject.description = layer.Title;
	layerObject.featurePrefix=layer.featurePrefix;
	layerObject.featureTypes=[layer.Name];
	layerObject.geomField= layer.geometryName;
	layerObject.maxFeatures= 1;
	layerObject.outputFormat= "gml3";
	layerObject.srsName= layer.SRS;
	layerObject.url= serverUrl;
	layerObject.readOnly = false;

	var node = this.base_.createNode(layerObject, false);
	var elementType = this.currentNode_.getAttribute("dt-type");

	if(elementType==="service"){
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

	this.base_.registerEvents(node.parentNode, true);
	goog.events.listen(node.querySelector('.props-up'), goog.events.EventType.CONTEXTMENU, this.showContextMenu, false, this);	
};

/**
 * This function remove unsaved changes
 * 
 * @private
 * @function
 */
M.control.WFSManagerContextMenuControl.prototype.confirmDialogDeleteService= function() {
	var acceptFn = this.deleteService.bind(this);
	M.WFSManagerDialog.show('¿Desea eliminar el servicio?',
			'Eliminar servicio', 'info', acceptFn);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.deleteService = function (evt) {
	var isActive = false;
	if(this.currentNode_.querySelector("input[type='radio']:checked")){
		isActive = true;
	}
	this.base_.removeService(this.currentNode_.querySelector("input[type='radio']"));
	this.currentNode_.parentNode.removeChild(this.currentNode_);
	if(isActive) this.base_.setDefaultServiceActive();
	M.WFSManagerDialog.close();
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.WFSManagerContextMenuControl.prototype.equals = function (obj) {
	return (obj instanceof M.control.WFSManagerContextMenuControl);
};

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerContextMenuControl.NAME = 'WFSManagerContextMenu';

/**
 * Template for this control
 * @const
 * @type {String}
 * @public
 * @api stable
 */
M.control.WFSManagerContextMenuControl.TEMPLATE = 'WFSManagerContextMenu.html';
if(M.config.devel){
	M.control.WFSManagerContextMenuControl.TEMPLATE = 'src/WFSManager/templates/WFSManagerContextMenu.html';
}

