goog.provide('P.control.advLSLayerCreatorControl');

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSLayerCreatorControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.advLSLayerCreatorControl = (function (base) {
	/**
	 * Base control
	 * @private
	 * @type {Object}
	 */
	this.base_ = base;
	/**
	 * Facade Map
	 * @private
	 * @type {M.Map}
	 */
	this.cqlFilter_ = base.cqlFilter_;
	/**
	 * Facade Map
	 * @private
	 * @type {M.Map}
	 */
	this.map_ = base.map_;
});

/**
 * Creates and returns a number of M.Layer from the info contained in node
 *
 * @public
 * @function
 * @param {HTMLElement} node
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.advLSLayerCreatorControl.prototype.initLayersFromNode = function (node) {
	this.minResolutionDefault = this.map_.getResolutions()[(this.map_.getResolutions().length)-1];
	this.maxResolutionDefault = this.map_.getResolutions()[0];
	this.createLayersFromNode(node);
};

/**
 * Creates and store a number of M.Layer from the info contained in node
 *
 * @public
 * @function
 * @param {HTMLElement} node
 * @param {Array} layers
 * @api stable
 */
M.control.advLSLayerCreatorControl.prototype.createLayersFromNode = function (node) {
	if(node.type === "layer"){
		this.createLayerFromNode(node);
	} else if (node.children) {
		for (let i = 0; i < node.children.length; i++) {
			this.createLayersFromNode(node.children[i]);
		}
	}
};

/**
 * Creates and return a M.Layer from the info contained in node
 *
 * @public
 * @function
 * @param {HTMLElement} node
 * @api stable
 */
M.control.advLSLayerCreatorControl.prototype.createLayerFromNode = function (node) {
	var cql_ = this.cqlFilter_ !== null && node.layerInfo.cqlFilter ? "CQL_FILTER="+this.cqlFilter_ : "";
	var layerConfig = {
			url: node.layerInfo.url+cql_,
			name: node.layerInfo.name,
			legend: node.layerInfo.label,
			tiled: node.layerInfo.tiled,
			visibility: node.active,
			transparent: true,
			opacity_: node.opacity
	};

	var layerOptions = {
			format: node.format,
			minResolution: node.minResolution ? node.minResolution : 0,	
			maxResolution: node.maxResolution ? node.maxResolution : 10000,
			mandatory: node.mandatory,
			exclusive: node.exclusive,
			identify: node.identify,
			dataServiceUrl: node.layerInfo.dataServiceUrl,
			idField: node.layerInfo.idField,
			isBaseLayer: node.isBaseLayer,
			displayInLayerSwitcher: node.layerInfo.displayInLayerSwitcher
	};

	if(node.layerInfo.url && node.layerInfo.url.indexOf("_vector_file:")>-1){
		var fileRef = node.layerInfo.url.split(":")[1];
		for(let i=0;i<this.base_.tocObjectForLoad_.vectors.length;i++){
			if(this.base_.tocObjectForLoad_.vectors[i].file===fileRef){
				var routeJSON = JSON.parse(this.base_.tocObjectForLoad_.vectors[i].data);
				this.base_.getImpl().createVectorLayerFromGeoJson(this.map_, routeJSON, node);
			}
		}
	}
	else{
		if(node.formatType === "VEC"){
			this.base_.editionLayers_.push(new M.impl.AdvLSVectorLayer(this.map_, node.layerInfo.name));
		}
		else if(node.layerInfo.label && node.layerInfo.url && node.layerInfo.name && node.id === node.layerInfo.name){
			var layer = new M.layer.WMS(layerConfig,layerOptions);
			this.map_.addWMS(layer);
		}
		else if(node.layerInfo.url===null && node.layerInfo.name==="OpenStreetMap"){
			var layerOSM = new M.layer.OSM(layerConfig,layerOptions);
			this.map_.addLayers([layerOSM]);
		}	
	}
};