goog.provide('P.impl.control.WFSManagerContextMenuControl');

/**
 * @classdesc
 * Main constructor of the WFSManagerContextMenuControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.WFSManagerContextMenuControl = function() {
	goog.base(this);
};
goog.inherits(M.impl.control.WFSManagerContextMenuControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.WFSManagerContextMenuControl.prototype.addTo = function(map, html) {
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
M.impl.control.WFSManagerContextMenuControl.prototype.zoomToLayer = function (map, layer) {
	if (layer.getSource().getFeatures().length > 0) {
		var features = layer.getSource().getFeatures();
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
M.impl.control.WFSManagerContextMenuControl.prototype.removeWMSLayer = function (map, layer) {
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
M.impl.control.WFSManagerContextMenuControl.prototype.removeVectorLayer = function (map, layer) {
	map.getMapImpl().removeLayer(layer);
};