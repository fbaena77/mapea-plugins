goog.provide('P.control.advLSControl');

goog.require('P.impl.control.advLSControl');
goog.require('P.control.advLSContextMenuControl');
goog.require('P.control.advLSLayerCreatorControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.advLSControl = (function (params) {
	if (M.utils.isUndefined(M.impl.control.advLSControl)) {
		M.exception('La implementación usada no puede crear controles advLSControl');
	}
	/**
	 * JSON layers configuration resource
	 * @private
	 * @type {object}
	 */
	this.configJson = params.layers;
	/**
	 * Predefined WMS server array
	 * @private
	 * @type {Array}
	 */
	this.predefServersArray_ = params.wmsServers;
	/**
	 * Predefined WMS server array
	 * @private
	 * @type {Array}
	 */
	this.saveToEnabled_ = {
			localEnabled: params.enableTOCFile, 
			repoEnabled: params.enableCatalog
	};
	/**
	 * Swagger client connector for remote data access
	 * @private
	 * @type {object}
	 */
	this.apiRestUrl_ = params.apiRestUrl;
	/**
	 * Swagger client connector for remote data access
	 * @private
	 * @type {object}
	 */
	this.user_ = params.user;
	/**
	 * Swagger client connector for remote data access
	 * @private
	 * @type {object}
	 */
	this.cqlFilter_ = params.cqlFilter;
	/**
	 * advLS DAO control for remote data access
	 * @private
	 * @type {M.control.advLSDAO}
	 */
	this.color_ = params.color;
	/**
	 * HTML template for this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.html_ = null;
	/**
	 * Tab order in TOC
	 * @private
	 * @type {number}
	 */
	this.order_ = 1;
	/**
	 * Map tree element
	 * @private
	 * @type {HTMLElement}
	 */
	this.mapTree_ = null;
	/**
	 * Map tree element
	 * @private
	 * @type {HTMLElement}
	 */
	this.jsonTOC_ = {};
	/**
	 * Map tree element
	 * @private
	 * @type {HTMLElement}
	 */
	this.tocObjectForLoad_ = {};
	/**
	 * Map tree element
	 * @private
	 * @type {HTMLElement}
	 */
	this.geoJsonVectorLayersArray_ = [];
	/**
	 * Facade Map
	 * @private
	 * @type {M.Map}
	 */
	this.editionLayers_ = [];
	/**
	 * asdvLS Layer Creator control
	 * @private
	 * @type {M.control.advLSLayerCreatorControl}
	 */
	this.advLSLayerCreatorControl_ = null;
	/**
	 * User catalog configuration json for TOC
	 * @public
	 * @type {object}
	 */
	this.userCatalog_ = {};
	/**
	 * UUID geoperfil from layers config json file
	 * @public
	 * @type {string}
	 */
	this.uuidgeoperfil_ = null;
	/**
	 * Context menu control
	 * @private
	 * @type {M.control.advLSContextMenuControl}
	 */
	this.contextMenu_ = null;

	this.impl_ = new M.impl.control.advLSControl(this);

	goog.base(this, this.impl_, 'advLSControl');
});
goog.inherits(M.control.advLSControl, M.Control);

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.advLSControl.prototype.createView = function (map) {
	this.map_ = map;
	var this_ = this;

	return new Promise(function (success) {
		M.template.compile(M.control.advLSControl.TEMPLATE,{'jsonp': false}).
		then(function (html) {
			this_.html_ = html;
			this_.deserializeJson(html, this_.configJson);
			success(html);
		});
	});
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.getEditionLayer = function () {
	var editionLayer;
	//TODO seleccionar la que el usuario haya señalado como en edición
	for(let i=0;i<this.editionLayers_.length;i++){
		if (this.editionLayers_[i].layerName === "SandboxLayer") {
			editionLayer = this.editionLayers_[i];
		}
	}
	
	return editionLayer;
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.getEditionLayersArray = function () {
	return this.editionLayers_;
};

/**
 * This function deserializes the JSON layers configuration resource
 *
 * @private
 * @function
 * @param {HTMLElement} html - HTML template for this control
 * @param {object} configJson - JSON layers configuration resource
 * @api stable
 */
M.control.advLSControl.prototype.deserializeJson = function (html, configJson) {
	var this_ = this;
	this.advLSLayerCreatorControl_ = new M.control.advLSLayerCreatorControl(this);
	this.contextMenu_ = new M.control.advLSContextMenuControl(this);
	var initControlFromJson = function (data) {
		this_.uuidgeoperfil_ = data.uuidgeoperfil;
		this_.advLSLayerCreatorControl_.initLayersFromNode(data);
		this_.mapTree_ = this_.initMapTree(data);
		if (!M.utils.isNullOrEmpty(this_.mapTree_)) {
			html.appendChild(this_.mapTree_);
			this_.registerEvents(this_.html_);
			this_.reorderLayers();
			this_.enableLayersInRange();
			this_.contextMenu_.createView();
			M.catalogSpinner.close();
		}
	};

	var json;
	try {
		if(configJson.uuidgeoperfil!==undefined){
			json = configJson;
		}
		else{
			json = JSON.parse(configJson.toString());	
		}
		initControlFromJson(json);
	} 
	catch (e) {
		var options = {
				jsonp: false
		};
		if(json===undefined){
			M.remote.get(configJson, null, options).then(function (response) {
				var data = JSON.parse(response.text);
				initControlFromJson(data);
			}).catch(function(e) {
				M.catalogSpinner.close();
				M.dialog.error("Configuración de capas no válida");
				this_.deserializeJson(this_.html_, this_.configJson);
			});
		}
		else{
			M.catalogSpinner.close();
			M.dialog.error("Configuración de capas no válida");
			this_.deserializeJson(this_.html_, this_.configJson);
		}
	}
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.loadTOC = function (tocObject) {
	this.tocObjectForLoad_ = tocObject;
	if(tocObject.main!==undefined){
		var json = JSON.parse(tocObject.main);
		if(this.uuidgeoperfil_ !== null && this.uuidgeoperfil_=== json.uuidgeoperfil){
			this.deleteMapTree();
			this.deserializeJson(this.getTemplate(),tocObject.main);
		}
		else{
			M.catalogSpinner.close();
			M.dialog.error("La configuración de capas no se corresponde con el geoperfil actual");
		}
	}
	else{
		M.catalogSpinner.close();
		M.dialog.error("El fichero de configuración no es válido");
	}
};

/**
 * This function deletes a folder in the map tree
 * 
 * @private
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.deleteMapTree = function () {
	var layerNodes = this.html_.querySelectorAll('div[dt-type="layer"]');
	for(let i=0;i<layerNodes.length;i++){
		var layer = this.getLayerFromNode(layerNodes[i]);
		if(layer!==undefined){
			var isVectorLayer = layerNodes[i].getAttribute("dt-vector");
			if(isVectorLayer!==undefined && isVectorLayer==="true"){
				this.contextMenu_.impl_.removeVectorLayer(this.map_, layer);	
			}
			else{
				this.contextMenu_.impl_.removeWMSLayer(this.map_, layer);
			}	
		}
	}
	var rootNode = this.html_.querySelector('div[dt-id="root"]');
	rootNode.parentNode.removeChild(rootNode);
	M.advLSDialog.close();
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.serializeTOC = function () {
	this.geoJsonVectorLayersArray_ = [];
	this.walkOnTOCDom(this.mapTree_);
	return this.jsonTOC_;
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.walkOnTOCDom = function (node, parent) {
	if (node.getAttribute("dt-type")==="folder"){
		var jsonFolder = this.createFolderObject(node);
		if(!parent){
			this.jsonTOC_ = jsonFolder;
		}
		else{
			this.fillUpTOCJson(jsonFolder, parent);	
		}

		for (let i = 0; i < node.children.length; i++) {
			if(node.children[i].className === ("map-child")){
				for (let j = 0; j < node.children[i].children.length; j++) {
					this.walkOnTOCDom(node.children[i].children[j], jsonFolder);
				}
			}
		}
	}
	else if (node.getAttribute("dt-type")==="layer"){
		var jsonLayer = this.createLayerObject(node);
		parent.children.push(jsonLayer);	
	}
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.fillUpTOCJson = function (mapObject, parent) {
	var findById = function (node, parent_) {
		if(node === parent_){
			return node;
		}
		if(node.children !== undefined){
			var result = null;
			for (let i = 0; i < node.children.length; i++) {
				result = findById(node.children[i], parent_);
				if(result){
					return result;
				}
			}
			return result;
		}
	};
	var filtered = findById(this.jsonTOC_, parent);

	if(!filtered){
		this.jsonTOC_.children.push(mapObject);
	}
	else{
		filtered.children.push(mapObject);
	}
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.createFolderObject = function (node) {
	var folderObject ={};
	folderObject.id = node.getAttribute("dt-id");
	if(folderObject.id === "root"){
		folderObject.uuidgeoperfil = this.uuidgeoperfil_;
	}
	folderObject.label = node.querySelector(".prop-info label").innerHTML;
	folderObject.type = "folder";
	folderObject.isOpenOnStartUp = node.getAttribute("dt-data")==="expanded" ? true : false;
	folderObject.active = node.querySelector(".tree-check input").checked;
	folderObject.isBaseLayer = (node.getAttribute("dt-baselayer")!==undefined && node.getAttribute("dt-baselayer")==="true") ? true : false;
	folderObject.opacity = node.querySelector(".prop-actions input").value;
	folderObject.children = [];
	folderObject.readOnly = node.getAttribute("dt-readonly")==="true" ? true : false;

	return folderObject;
};

/**
 * This function serializes the TOC DOM into a JSON object
 *
 * @private
 * @function
 * @returns {Object} the JSON config layers and folders
 * @api stable
 */
M.control.advLSControl.prototype.createLayerObject = function (node) {
	var minResolutionDefault = this.map_.getResolutions()[(this.map_.getResolutions().length)-1];
	var maxResolutionDefault = this.map_.getResolutions()[0];
	var layerObject = {};
	var layer = this.getLayerFromNode(node);
	layerObject.id = node.getAttribute("dt-id");
	layerObject.type = "layer";
	layerObject.active = node.querySelector(".tree-check input").checked;
	layerObject.isBaseLayer = (node.getAttribute("dt-baselayer")!==undefined && node.getAttribute("dt-baselayer")==="true") ? true : false;
	layerObject.opacity = node.querySelector(".prop-actions input").value;
	layerObject.layerInfo = {};
	layerObject.layerInfo.name = node.getAttribute("dt-id");
	layerObject.layerInfo.label = node.querySelector(".prop-info label").title;
	layerObject.layerInfo.tiled = layer.tiled ? layer.tiled : false;

	if(node.getAttribute("dt-vector") && node.getAttribute("dt-vector") === "true"){
		var geoJsonLayer = this.getImpl().createGeoJsonLayer(layer);
		var newUUID = this.generateUUID();
		this.geoJsonVectorLayersArray_.push({id:newUUID, content:geoJsonLayer});

		layerObject.minResolution = null;
		layerObject.maxResolution = null;
		layerObject.format = "text/plain";
		layerObject.mandatory = false;
		layerObject.exclusive = false;
		layerObject.identify = false;
		layerObject.layerInfo.url = "_vector_file:"+newUUID+".json";
		layerObject.layerInfo.displayInLayerSwitcher = true;
		layerObject.readOnly =  node.getAttribute("dt-readonly") === "true";
		layerObject.vector = true;
		if(layer.type!=="Vector"){
			layerObject.formatType = layer.get("type");
			layerObject.geometryType = layer.getSource().getFeatures()[0].getGeometry().getType();
			layerObject.style = {};
			layerObject.style.fillColor = layer.getStyle().getFill().getColor();
			layerObject.style.strokeColor = layer.getStyle().getStroke().getColor();	
		}
		else{
			layerObject.formatType = "VEC";
			//TODO provisional. Hay que obtener el tipo de la capa
			layerObject.geometryType = "Polygon";
			layerObject.style = {};
			layerObject.style.fillColor = node.querySelector(".prop-legend>div").style.backgroundColor;
			layerObject.style.strokeColor = node.querySelector(".prop-legend>div").style.borderColor;
		}
	}
	else{
		layerObject.minResolution = layer.options.minResolution === minResolutionDefault ? null : layer.options.minResolution;
		layerObject.maxResolution = layer.options.maxResolution === maxResolutionDefault ? null : layer.options.maxResolution;
		layerObject.format = layer.options.format ? layer.options.format : "text/plain";
		layerObject.mandatory = layer.options.mandatory ? layer.options.mandatory : false;
		layerObject.exclusive = layer.options.exclusive ? layer.options.exclusive : false;
		layerObject.identify = layer.options.identify ? layer.options.identify : false;
		layerObject.layerInfo.url = layer.url ? layer.url : null;
		layerObject.layerInfo.displayInLayerSwitcher = layer.options.displayInLayerSwitcher ? layer.options.displayInLayerSwitcher : true;
		layerObject.readOnly = node.getAttribute("dt-readonly")==="true" ? true : false;
	}

	return layerObject;
};

/**
 * This function generates an UUID
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.generateUUID = function () {
	var s4 = function () {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/**
 * This function initializes the map tree element
 *
 * @private
 * @function
 * @param {HTMLElement} data - Layers nodes
 * @api stable
 */
M.control.advLSControl.prototype.initMapTree = function (data) {
	this.baseLayerFolderNode = null;
	this.ignoredBaseLayerFolders = [];
	return this.createNode(data, !data.active);
};

/**
 * This function creates the nodes for map tree
 *
 * @private
 * @function
 * @param {HTMLElement} node - Layer or folder node from json config
 * @param {boolean} uncheckedAncestor - Evaluates if ancestor is checked
 * @returns {HTMLElement} 
 * @api stable
 */
M.control.advLSControl.prototype.createNode = function (node, uncheckedAncestor) {
	var displayNode = "block";
	if (!node.id || (node.layerInfo && node.layerInfo.displayInLayerSwitcher === false)) {
		displayNode = "none";
	}

	var displayOpacityRoot = "block";
	var displayCheck = "inline-block";
	var checkRootDisabled = "";
	var colorStyle = "";
	var nodeClass = "";
	var typeNode = "layer";
	var marginLabel = 'margin-left: 14px;';
	if (node.type === "folder") {
		marginLabel = '';
		nodeClass += "map-node-group";
		typeNode = "folder";
		if (node.isBaseLayer) {
			if (M.utils.isNullOrEmpty(this.baseLayerFolderNode)) {
				this.baseLayerFolderNode = node;
			} else {
				node.isBaseLayer = false;
				this.ignoredBaseLayerFolders.push(node.label);
			}
		}
	}
	if (node.id === "root") {
		displayCheck = "none";
		nodeClass = nodeClass.replace("group","root");
		colorStyle = 'background-color: '+this.color_+' !important;';
		displayOpacityRoot = "none";
		checkRootDisabled = "disabled";
	}
	var collapsePoint = "collapsed";
	if (node.isOpenOnStartUp) {
		collapsePoint = "expanded";
	}
	var checkedDisabled = "";
	if (uncheckedAncestor) {
		checkedDisabled = "disabled";
	}
	var sliderdisabled = "disabled";
	var nodeActive = "";
	if (node.active) {
		nodeActive = "checked";
		if (!uncheckedAncestor) {
			sliderdisabled = "";
		}
	} else {
		uncheckedAncestor = !node.active;
	}

	var readOnly = true;
	if (node.readOnly!==undefined && node.readOnly===false) {
		readOnly = false;
	}

	var vector = false;
	if (node.vector!==undefined && node.vector===true) {
		vector = true;
	}

	var childrenTemp = "";
	if (node.children) {
		for (var i = 0; i < node.children.length; i++) {
			childrenTemp += this.createNode(node.children[i], uncheckedAncestor).outerHTML;
		}
	}

	var tempIcon = '<div class="tree-icon"><i class="map-node-expand fa fa-chevron-right"></i></div>';
	if (!node.children || node.children.length < 0 || node.type === "layer" || node.id === "root") {
		tempIcon = '';
	}

	var propLegend = "";
	if (typeNode === "layer" && node.layerInfo.url!==null) {
		var legendHtml = this.getLegend(node.id);
		this.initLayerOpacity(node.id, node.opacity);
		if(legendHtml!==undefined){
			propLegend = '' +
			'<div class="prop-legend" style="display: none;">' +
			'	<img src="' + legendHtml + '"></img>' +
			'</div>';
		}
	} 
	if(node.geometryType !== undefined){
		var legendStyle;
		if (node.geometryType === "Point" || node.geometryType === "MultiPoint") {
			legendStyle = 'style="height: 9px; width: 9px; margin-left: 3px; border: 2px solid '+ node.style.strokeColor+';background-color: '+ node.style.fillColor+';border-radius: 50%"';
		} else if (node.geometryType === "Polygon" || node.geometryType === "MultiPolygon") {
			legendStyle = 'style="height: 12px;width: 12px; margin-left: 2px; border: 2px solid '+ node.style.strokeColor+';background-color:' + node.style.fillColor+'"';
		} else {
			legendStyle = 'style="margin-top:6px; margin-bottom:6px; border: 2px solid '+ node.style.strokeColor+';width: 28px;"';
		}
		propLegend = '<div class="prop-legend" style="display: none;">' +
			'	<div '+ legendStyle +'></div>' +
			'</div>';
	}
	var labelNode = typeNode === "layer" ? node.layerInfo.label : node.label;
	var label;
	if (node.formatType !== undefined) {
		label = '<label title="' + labelNode + '"><span class="styleLayerType">' + node.formatType + '</span>' + ' ' + labelNode +'</label>';
	} else if (node.formatType === undefined && typeNode === 'layer') {	
		label = '<label title="' + labelNode + '"><span class="styleLayerType">WMS</span>'  +  labelNode + '</label>';
	} else {
		label = '<label title="' + labelNode + '">' + labelNode + '</label>';
	}
	var nodeTemp = '' +
	'   <div style="display:' + displayNode + ';'+marginLabel+ colorStyle +'" class="props ' + nodeClass + '" title="">' +
	'       <div class="props-up">' + tempIcon +
	'           <div class="tree-check" style="display: '+displayCheck+';">' +
	'               <input ' + nodeActive + ' id= "tocLayerCheckBoxId_' + node.id + '" type="checkbox" ' + checkRootDisabled + checkedDisabled + '/>' +
	'				<span class="checkmark"></span>' +
	'           </div>' +
	'           <div class="prop-info" draggable="' + (node.id !== "root") + '">' + label +
	'           </div>' +
	'           <div class="prop-actions" style="display:' + displayOpacityRoot + '">' +
	'               	<input type="range" title="Opacidad" min="0" max="1" step="0.1" value="' + node.opacity + '" ' + sliderdisabled + '/>' +
	'           </div>' +
	'       </div>' +
	'       <div class="props-down">' + propLegend + '</div>' +
	'   </div>' +
	'   <div class="map-child">' +
	'       ' + childrenTemp +
	'   </div>';
	var mapNode = document.createElement('div');
	mapNode.className = 'map-node ' + collapsePoint;
	mapNode.setAttribute('onselectstart', 'return false');
	mapNode.setAttribute('onmousedown', 'return true');
	mapNode.setAttribute('dt-id', node.id);
	mapNode.setAttribute('dt-data', collapsePoint);
	mapNode.setAttribute('dt-type', typeNode);
	mapNode.setAttribute('dt-readonly', readOnly);
	mapNode.setAttribute('dt-vector', vector);
	if (node.isBaseLayer) {
		mapNode.setAttribute('dt-baselayer', node.isBaseLayer);
	}
	mapNode.innerHTML = nodeTemp;

	return mapNode;
};

/**
 * On zoom callback function 
 *
 * @private
 * @function
 * @param {object} evt - Event
 * @api stable
 */
M.control.advLSControl.prototype.onZoom = function (evt) {
	this.enableLayersInRange();
};

/**
 * This function evaluates if the layer is in range
 * 
 * @private
 * @function
 * @param {M.Layer} layer - Layer
 * @api stable
 */
M.control.advLSControl.prototype.inRange = function (layer) {
	try{
		var inRange = true;
		if (!M.utils.isNullOrEmpty(layer.getImpl())) {
			var layerImpl = layer.getImpl();
			if(layerImpl.name==='OpenStreetMap'){
				return true;
			}
			var resolution = this.map_.getMapImpl().getView().getResolution();
			var maxResolution = layerImpl.getMaxResolution();
			var minResolution = layerImpl.getMinResolution();

			inRange = ((resolution >= minResolution) && (resolution <= maxResolution));
		}
		return inRange;
	}
	catch(err){
		return true;
	}
};

/**
 * This function enables layers in range
 *
 * @private
 * @function
 * @param {object} evt - Event
 * @api stable
 */
M.control.advLSControl.prototype.enableLayersInRange = function (evt) {
	var this_ = this;
	this.map_.getLayers().filter(function(layer) {
		const node = this_.getNodeFromLayer(layer);
		if(node){
			const activate = this_.inRange(layer) && this_.checkAncestorsVisibility(node);
			this_.enableLayers(node, activate);
		}
	});
};

/**
 * This function enables a layer or layers in folder
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Layer or folder node from map tree
 * @param {boolean} activate - Evaluates if layer must be enabled or disabled
 * @api stable
 */
M.control.advLSControl.prototype.enableLayers = function (nodeDom, activate) {
	if (M.utils.isNullOrEmpty(activate)) {
		activate = nodeDom.checked;
	}

	if (!M.utils.isNullOrEmpty(nodeDom) && !M.utils.isNullOrEmpty(activate)) {
		if(nodeDom.getAttribute("dt-type") === "layer"){
			const slider = nodeDom.querySelector("input[type='range']");
			slider.disabled = !activate;
			const checkbox = nodeDom.querySelector("input[type='checkbox']");
			checkbox.disabled = !activate;
			const childIsActive = checkbox.checked;
			const layer = this.getLayerFromNode(nodeDom);
			const inRange_ = this.inRange(layer);
			if (layer) {
				layer.setVisible(activate && childIsActive && inRange_);
			}
			slider.disabled = !activate || !childIsActive || !inRange_;
			return;
		}

		var parentDom = this.closest(nodeDom, 'map-node');
		const nodeType = parentDom.getAttribute("dt-type");
		var slider = parentDom.querySelector("input[type='range']");
		slider.disabled = !activate;
		if (nodeType === "folder") {
			var subs = parentDom.querySelectorAll("input[type='checkbox']");
			for (let i = 1; i < subs.length; i++) {
				const childIsActive = subs[i].checked;
				var parent = this.closest(subs[i], 'map-node');
				const layer = this.getLayerFromNode(parent);
				const inRange_ = this.inRange(layer);
				subs[i].disabled = !activate  || !inRange_;
				var subNodeType = parent.getAttribute("dt-type");
				if (subNodeType === "layer") {
					const layer = this.getLayerFromNode(parent);
					if (layer) {
						layer.setVisible(activate && childIsActive && inRange_);
					}
				}
				const slider = parent.querySelector("input[type='range']");
				slider.disabled = !activate || !childIsActive || !inRange_;
			}
		} else {
			const layer = this.getLayerFromNode(parentDom);
			if (layer) {
				layer.setVisible(activate);
			}
		}
	}
};

/**
 * This function reorders the layers in map tree
 *
 * @private
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.reorderLayers = function () {
	const layerNodes = this.mapTree_.querySelectorAll("div[dt-type='layer']");
	for (let i = 0; i < layerNodes.length; i++) {
		const layer = this.getLayerFromNode(layerNodes[i]);
		var isBaseLayer = false;
		if(layer!==undefined){
			if(layer.options!==undefined && layer.options.isBaseLayer!==undefined){
				isBaseLayer = layer.options.isBaseLayer; 
			}
			if (!isBaseLayer) {
				layer.setZIndex((M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999) + (layerNodes.length-i));
			}
			else {
				layer.setZIndex(0 + (layerNodes.length-i));
			}
		}
	}
};

/**
 * This function activates layers in a folder
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Folder node in map tree
 * @param {boolean} activate - Evaluates if layer must be activated or deactivated
 * @api stable
 */
M.control.advLSControl.prototype.activateLayersFromFolder = function (nodeDom, activate) {
	var subs = nodeDom.querySelectorAll("input[type='checkbox']");
	for (let i = 1; i < subs.length; i++) {
		subs[i].checked = activate;
		var parent = this.closest(subs[i], 'map-node');
		const layer = this.getLayerFromNode(parent);
		const inRange_ = this.inRange(layer);
		var subNodeType = parent.getAttribute("dt-type");
		if (subNodeType === "layer") {
			const layer = this.getLayerFromNode(parent);
			if (layer) {
				layer.setVisible(activate && inRange_ && this.checkAncestorsVisibility(subs[i]));
			}
		}
		else{
			this.activateLayersFromFolder(parent, activate);
		}
		const slider = parent.querySelector("input[type='range']");
		slider.disabled = !activate || !inRange_;
	}
};

/**
 * This function registers events on map and layers to render
 * the advLSControl
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template for this control
 * @api stable
 */
M.control.advLSControl.prototype.registerEvents = function (html) {
	var this_ = this;
	var onZoom = this.onZoom.bind(this);
	this.map_.getMapImpl().getView().on('change:resolution', onZoom, this);
	this.dragSourceNode = null;
	this.dragTargetNode = null;
	this.dom = html;
	this.on(M.evt.COMPLETED, function () {
		goog.dom.classlist.add(this.dom, "shown");
	}, this);

	var expandNode = function(evt){
		evt.preventDefault();
		var parentDom = this_.closest(evt.target, 'map-node');
		if(parentDom.getAttribute("dt-id")!=="root"){
			var classData = parentDom.getAttribute("dt-data");
			if (classData === 'expanded') {
				this_.collapseNode(parentDom);
			} else if (classData === 'collapsed') {
				this_.expandNode(parentDom);
			}	
		}
	};

	//TREE LISTENERS
	/** Expand/collapse nodes listener **/
	var nodes = this.dom.querySelectorAll('.map-node-expand');
	for (let i = 0; i < nodes.length; i++) {
		if(!goog.events.hasListener(nodes[i], goog.events.EventType.CLICK)){
			goog.events.listen(nodes[i], goog.events.EventType.CLICK, expandNode);
		}
	}

	var folders = this.dom.querySelectorAll("div[dt-type='folder']");
	for (let i = 0; i < folders.length; i++) {
		if(!goog.events.hasListener(folders[i].querySelector(".prop-info"), goog.events.EventType.CLICK)){
			goog.events.listen(folders[i].querySelector(".prop-info"), goog.events.EventType.CLICK, expandNode);
		}
	}

	/** Show legend listeners **/
	var legendPanel = this.dom.querySelectorAll("div[dt-type='layer']");
	for (let i = 0; i < legendPanel.length; i++) {
		if(!goog.events.hasListener(legendPanel[i].querySelector(".prop-info"), goog.events.EventType.CLICK)){
			goog.events.listen(legendPanel[i].querySelector(".prop-info"), goog.events.EventType.CLICK, function (evt) {
				this_.showLegend(evt.target.offsetParent);
			});
		}
	}

	//MAP IMPLEMENTATION LISTENERS
	/** Activate/Deactivate layer listeners **/
	var checkBox = this.dom.querySelectorAll("input[type='checkbox']");
	for (let i = 0; i < checkBox.length; i++) {
		if(!goog.events.hasListener(checkBox[i], goog.events.EventType.CHANGE)){
			goog.events.listen(checkBox[i], goog.events.EventType.CHANGE, function (evt) {
				evt.preventDefault();
				this_.enableLayers(evt.target);
			});
		}
	}
	/** Change opacity listener **/
	var slider = this.dom.querySelectorAll("input[type='range']");
	for (let i = 0; i < slider.length; i++) {
		if(!goog.events.hasListener(slider[i], goog.events.EventType.CHANGE)){
			goog.events.listen(slider[i], goog.events.EventType.CHANGE, function (evt) {
				evt.preventDefault();
				this_.changeOpacity(evt.target);
			});
		}
	}
	/** Change layer / folder order listener **/
	var dragStartHandler_ = function (evt) {
		if (this_.dragSourceNode !== null) {
			return false;
		}
		this_.dragSourceNode = this_.closest(this, "map-node"); // Here, 'this' refers to the html node being dragged
		evt.event_.dataTransfer.effectAllowed = 'move';
		evt.event_.dataTransfer.setData('text/html', ''); // Hack to make drag and drop work on Firefox

	};
	var dragOverHandler_ = function (evt) {
		// Give visual feedback to user
		let overNode = this;
		if (this.classList && this.classList.contains("props") && this.classList.contains("map-node-group") &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			overNode = this.parentNode;
		}
		if (M.utils.isNullOrEmpty(this_.dragSourceNode) ||
				this_.dragSourceNode.getAttribute("dt-baselayer") !== overNode.getAttribute("dt-baselayer")) {
			return;
		}
		overNode.classList.add("currentDragTarget");
		if (evt.preventDefault) {
			evt.preventDefault(); // Necessary. Allows us to drop
		}
		evt.event_.dataTransfer.dropEffect = 'move';
		return false;
	};
	var dragLeaveHandler_ = function (evt) {
		// Give visual feedback to user
		let overNode = this;
		if (this.classList && this.classList.contains("props") && this.classList.contains("map-node-group") &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			overNode = this.parentNode;
		}
		if (M.utils.isNullOrEmpty(this_.dragSourceNode) ||
				this_.dragSourceNode.getAttribute("dt-baselayer") !== overNode.getAttribute("dt-baselayer")) {
			return;
		}
		overNode.classList.remove("currentDragTarget");
	};
	var dragEndHandler_ = function (evt) {
		this_.dragSourceNode = null;
		this_.dragTargetNode = null;
	};
	var dropHandler_ = function (evt) {
		if (M.utils.isNullOrEmpty(this_.dragSourceNode)) {
			return;
		}
		let dropCompleted = false;
		// Here, 'this' refers to the target html node
		if (this.getAttribute("dt-type") == "layer") {
			this.classList.remove("currentDragTarget");
			this_.dragTargetNode = this;
		} else if (this.classList && this.classList.contains("props") && (this.classList.contains("map-node-group") || this.classList.contains("map-node-root")) &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			this.parentNode.classList.remove("currentDragTarget");
			this_.dragTargetNode = this.parentNode;
		} else {
			dragEndHandler_();
		}
		if (evt.stopPropagation) {
			evt.stopPropagation(); // Stops the browser from redirecting
		}
		if (this_.dragSourceNode !== null && this_.dragTargetNode !== null &&
				this_.dragSourceNode != this_.dragTargetNode) {
			if (this_.dragTargetNode.getAttribute("dt-type") == "layer" ||
					(this_.dragTargetNode.getAttribute("dt-type") == "folder" && this_.dragTargetNode.classList.contains("collapsed"))) {
				// Drop onto layer or collapsed folder: append the source node to target node
				try {
					this_.dragTargetNode.parentNode.insertBefore(this_.dragSourceNode, this_.dragTargetNode);
					dropCompleted = true;
				} catch (err) {
					dragEndHandler_();
				}
			} else if (this_.dragTargetNode.getAttribute("dt-type") == "folder") {
				// Drop onto expanded folder: append the source node to target's last children node
				var targetMapChild = null;
				for (let i = 0; i < this_.dragTargetNode.childNodes.length; i++) {
					if (this_.dragTargetNode.childNodes[i].classList && this_.dragTargetNode.childNodes[i].classList.contains("map-child")) {
						targetMapChild = this_.dragTargetNode.childNodes[i];
					}
				}
				if (targetMapChild !== null) {
					try {
						targetMapChild.appendChild(this_.dragSourceNode);
						dropCompleted = true;
					} catch (err) {
						dragEndHandler_();
					}
				} else {
					dragEndHandler_();
				}
			}
			// When successful drop,
			// only look for ancestors if dragged node is visible
			// and only set it to false if some ancestor is not visible
			if (dropCompleted) {
				if (this_.dragSourceNode.querySelector("input[type=checkbox]") &&
						this_.dragSourceNode.querySelector("input[type=checkbox]").checked &&
						!this_.checkAncestorsVisibility(this_.dragSourceNode)) {
					if (this_.dragSourceNode.getAttribute("dt-type") == "layer") {
						this_.map_.getLayers().some(function (l) {
							if (l.name === this_.dragSourceNode.getAttribute("dt-id")) {
								l.setVisible(false);
							}
						});
					} else if (this_.dragSourceNode.getAttribute("dt-type") == "folder") {
						var layersChildren = this_.dragSourceNode.querySelectorAll("div[dt-type=layer]");
						for (let i = 0; i < layersChildren.length; i++) {
							this_.map_.getLayers().some(function (l) {
								if (l.name === layersChildren[i].getAttribute("dt-id")) {
									l.setVisible(false);
								}
							});
						}
					}
				}
				this_.reorderLayers();
			}
		}
		dragEndHandler_();
		return false;
	};
	for (let i = 0; i < legendPanel.length; i++) {
		if(!goog.events.hasListener(legendPanel[i].querySelector(".prop-info"), goog.events.EventType.DRAGSTART)){
			goog.events.listen(legendPanel[i].querySelector(".prop-info"), goog.events.EventType.DRAGSTART, dragStartHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGOVER)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGOVER, dragOverHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGLEAVE)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGLEAVE, dragLeaveHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DROP)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DROP, dropHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGEND)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGEND, dragEndHandler_);	
		}
	}
	for (let i = 0; i < folders.length; i++) {
		if (folders[i].getAttribute("dt-id") !== "root" && (folders[i].getAttribute("dt-baselayer") !== "true")) {
			if(!goog.events.hasListener(folders[i].querySelector(".prop-info"), goog.events.EventType.DRAGSTART)){
				goog.events.listen(folders[i].querySelector(".prop-info"), goog.events.EventType.DRAGSTART, dragStartHandler_);	
			}
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DRAGOVER)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DRAGOVER, dragOverHandler_);	
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DRAGLEAVE)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DRAGLEAVE, dragLeaveHandler_);	
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DROP)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DROP, dropHandler_);	
		}
		if(!goog.events.hasListener(folders[i], goog.events.EventType.DRAGEND)){
			goog.events.listen(folders[i], goog.events.EventType.DRAGEND, dragEndHandler_);	
		}
	}
};

/**
 * This function gets a M.Layer object from node layer element in map tree
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Layer node from map tree
 * @api stable
 */
M.control.advLSControl.prototype.getLayerFromNode = function (nodeDom) {
	if (nodeDom.getAttribute("dt-id")) {
		let layer;
		this.map_.getLayers().some(function (l) {
			if (l.name === nodeDom.getAttribute("dt-id")) {
				layer = l;
			}
		});

		if(layer===undefined){
			var layers = this.map_.getMapImpl().getLayers();
			layers.forEach(function (l) {
				var layerName = l.get('name');
				if (layerName === nodeDom.getAttribute("dt-id")) {
					layer = l;
				}
			});
		}

		return layer;
	}
};

/**
 * This function gets a node layer object from a M.Layer object
 *
 * @private
 * @function
 * @param {M.Layer} layer - Layer
 * @api stable
 */
M.control.advLSControl.prototype.getNodeFromLayer = function (layer) {
	return this.mapTree_.querySelector('div[dt-id="'+layer.name+'"');
};

/**
 * This function checks the ancestor visibility of a node
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Layer node from map tree
 * @api stable
 */
M.control.advLSControl.prototype.checkAncestorsVisibility = function (nodeDom) {
	var visibility = false;
	var ancestor = this.closestAttribute(nodeDom, "dt-type", "folder");
	if (!M.utils.isNullOrEmpty(ancestor)) {
		const input = ancestor.querySelector("input[type=checkbox]");
		if (!M.utils.isNullOrEmpty(input)) {
			visibility = input.checked;
		}
	}
	if (ancestor.getAttribute("dt-id") == "root") {
		return visibility;
	} else {
		return visibility && this.checkAncestorsVisibility(ancestor.parentNode);
	}
};

/**
 * This function collapses a folder node in map tree
 *
 * @public
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @api stable
 */
M.control.advLSControl.prototype.collapseNode = function (nodeDom) {
	nodeDom.setAttribute("dt-data", "collapsed");
	nodeDom.classList.remove("expanded");
	nodeDom.classList.add("collapsed");
	var childNodes = nodeDom.getElementsByClassName('map-node');
	for (var i = 0; i < childNodes.length; i++) {
		this.collapseNode(childNodes[i]);
	}
};

/**
 * This function expands a folder node in map tree
 *
 * @public
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @api stable
 */
M.control.advLSControl.prototype.expandNode = function (nodeDom) {
	nodeDom.setAttribute("dt-data", "expanded");
	nodeDom.classList.remove("collapsed");
	nodeDom.classList.add("expanded");
};

/**
 * This function shows the layer legend
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Layer node from map tree
 * @api stable
 */
M.control.advLSControl.prototype.showLegend = function (nodeDom) {
	var detailDom = nodeDom.querySelector(".prop-legend");
	if (detailDom!== null && detailDom.style.display === "none") {
		detailDom.style.display = "block";
	} else if(detailDom!== null){
		detailDom.style.display = "none";
	}
};

/**
 * This function changes the layer opacity
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Layer node from map tree
 * @param {number} opacityLevel - Opacity level
 * @api stable
 */
M.control.advLSControl.prototype.changeOpacity = function (nodeDom, opacityLevel) {
	if (M.utils.isNullOrEmpty(opacityLevel)) {
		opacityLevel = nodeDom.value;
	}

	if (!M.utils.isNullOrEmpty(nodeDom) && !M.utils.isNullOrEmpty(opacityLevel)) {
		var parentDom = M.control.advLSControl.prototype.closest(nodeDom, 'map-node');
		var nodeType = parentDom.getAttribute("dt-type");
		if (nodeType === "folder") {
			var subs = parentDom.querySelectorAll("input[type='range']");
			for (let i = 1; i < subs.length; i++) {
				var parent = this.closest(subs[i], 'map-node');
				var layerSlider = parent.querySelector("input[type='range']");
				layerSlider.value = opacityLevel;
				var subNodeType = parent.getAttribute("dt-type");
				if (subNodeType === "layer") {
					const layer = this.getLayerFromNode(parent);
					if (layer) {
						layer.setOpacity(opacityLevel);
					}
				}
			}
		} else {
			const layer = this.getLayerFromNode(parentDom);
			if (layer) {
				layer.setOpacity(opacityLevel);
			}
		}
	}
};

/**
 * This function finds the closest element of a node based in class
 *
 * @private
 * @function
 * @param {HTMLElement} el - Node from map tree
 * @param {string} cls - Class
 * @api stable
 */
M.control.advLSControl.prototype.closest = function (el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
};

/**
 * This function finds the closest element of a node based in attribute value
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @param {string} attribute - Attribute
 * @param {string} value - Attribute value
 * @api stable
 */
M.control.advLSControl.prototype.closestAttribute = function (nodeDom, attribute, value) {
	if (nodeDom.getAttribute(attribute) == value) {
		return nodeDom;
	} else {
		return this.closestAttribute(nodeDom.parentNode, attribute, value);
	}
};

/**
 * This function gets the layer legend
 *
 * @private
 * @function
 * @param {string} layerName
 * @api stable
 */
M.control.advLSControl.prototype.getLegend = function (layerName) {
	if (!M.utils.isNullOrEmpty(layerName)) {
		var layerLegend = this.map_.getLayers().filter(function (layer) {
			return (layer.name === layerName);
		}).reverse();
		if(layerLegend[0] !== undefined){
			return layerLegend[0].getLegendURL();
		}
	}
};

/**
 * This function initializes the opacity for a layer
 *
 * @private
 * @function
 * @param {string} layerName
 * @param {string} opacityLevel
 * @api stable
 */
M.control.advLSControl.prototype.initLayerOpacity = function (layerName, opacityLevel) {
	if (!M.utils.isNullOrEmpty(layerName)) {
		let layer;
		this.map_.getLayers().some(function (l) {
			if (l.name === layerName) {
				layer = l;
				layer.setOpacity(opacityLevel);
			}
		});
	}
};

/**
 * This function renders the panel
 *
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.render = function () {
	this.getImpl().renderPanel();
};

/**
 * Unegisters events for map and layers from the advLSControl
 *
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.unregisterEvents = function () {
	this.getImpl().unregisterEvents();
};

/**
 * Gets this implementation control
 *
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.getImpl = function () {
	return this.impl_;
};

/**
 * Unegisters events for map and layers from the advLSControl
 *
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.getTemplate = function () {
	return this.html_;
};

/**
 * Gets the variables of the template to compile
 * 
 * @private
 * @function
 * @param {M.Map} map
 * @api stable
 */
M.control.advLSControl.getTemplateVariables_ = function (map) {
	// gets base layers and overlay layers
	var baseLayers = map.getBaseLayers();
	var overlayLayers = map.getLayers().filter(function (layer) {
		const isTransparent = (layer.transparent === true);
		const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
		const isNotWMC = (layer.type !== M.layer.type.WMC);
		const isNotWMSFull = !((layer.type === M.layer.type.WMS) && M.utils.isNullOrEmpty(layer.name));
		return (isTransparent && isNotWMC && isNotWMSFull && displayInLayerSwitcher);
	}).reverse();
	return {
		'baseLayers': baseLayers.map(M.control.advLSControl.parseLayerForTemplate_),
		'overlayLayers': overlayLayers.map(M.control.advLSControl.parseLayerForTemplate_)
	};
};

/**
 * Parses layer for template
 *
 * @private
 * @function
 * @param {M.Layer} layer
 * @api stable
 */
M.control.advLSControl.parseLayerForTemplate_ = function (layer) {
	var layerTitle = layer.legend;
	if (M.utils.isNullOrEmpty(layerTitle)) {
		layerTitle = layer.name;
	}
	if (M.utils.isNullOrEmpty(layerTitle)) {
		layerTitle = 'Servicio WMS';
	}
	return {
		'base': (layer.transparent === false),
		'visible': (layer.isVisible() === true),
		'id': layer.name,
		'title': layerTitle,
		'legend': layer.getLegendURL(),
		'outOfRange': !layer.inRange(),
		'opacity': layer.getOpacity()
	};
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.advLSControl.prototype.equals = function (obj) {
	return (obj instanceof M.control.advLSControl);
};

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSControl.NAME = 'advLSControl';

/**
 * Template for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */

M.control.advLSControl.TEMPLATE = 'advLS.html';
if(M.config.devel){
	M.control.advLSControl.TEMPLATE = 'src/advLS/templates/advLS.html';
}


