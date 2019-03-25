goog.provide('P.impl.control.advLSContextMenuControl');

/**
 * @classdesc
 * Main constructor of the advLSContextMenuControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.advLSContextMenuControl = function() {
	goog.base(this);
};
goog.inherits(M.impl.control.advLSContextMenuControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.advLSContextMenuControl.prototype.addTo = function(map, html) {
	// super addTo
	goog.base(this, 'addTo', map, html);
};

/**
 * This function do a zoom to layer
 *
 * @public
 * @function
 * @param {*} selectedUrl - WMS server url
 * @api stable
 */
M.impl.control.advLSContextMenuControl.prototype.zoomToLayer = function (map, layer) {
	var features;
	if(layer.type==="Vector"){
		features = layer.getImpl().getOL3Layer().getSource().getFeatures();
	}
	else{
		features = layer.getSource().getFeatures();
	}
	if (features.length > 0) {
		var extent = new ol.extent.createEmpty();
		features.forEach(function(f, index, array){
			ol.extent.extend(extent, f.getGeometry().getExtent());
		});
		map.getMapImpl().getView().fit(extent, {duration: 500});	
	}
};

/**
 * This function removes a WMS layer from map
 *
 * @public
 * @function
 * @param {M.Map} map
 * @param {M.Layer} layer
 * @api stable
 */
M.impl.control.advLSContextMenuControl.prototype.removeWMSLayer = function (map, layer) {
	if(layer.type===M.layer.type.OSM){
		map.getMapImpl().removeLayer(layer.getImpl().ol3Layer);
	}
	else{
		map.removeLayers(layer);	
	}
};

/**
 * This function removes a vector layer from map
 *
 * @public
 * @function
 * @param {M.Map} map
 * @param {ol.layer} layer
 * @api stable
 */
M.impl.control.advLSContextMenuControl.prototype.removeVectorLayer = function (map, layer) {
	if(layer instanceof M.Layer){
		map.removeLayers(layer);
	}
	else{
		map.getMapImpl().removeLayer(layer);
	}
};