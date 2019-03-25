goog.provide('P.impl.control.WFSManagerControl');

/**
 * @classdesc
 * Main constructor of the WFSManagerControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.WFSManagerControl = function() {
	
	this.map_ = null;
	
	goog.base(this);
};
goog.inherits(M.impl.control.WFSManagerControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @param {HTMLElement} html of the control
 * @api stable
 */
M.impl.control.WFSManagerControl.prototype.addTo = function(map, html) {
	this.map_ = map;
	// super addTo
	goog.base(this, 'addTo', map, html);
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @param {HTMLElement} html of the control
 * @api stable
 */
M.impl.control.WFSManagerControl.prototype.createGeoJsonLayer = function(layer) {
	var geojsonFormat = new ol.format.GeoJSON();
	var features = layer.getSource().getFeatures();
	return geojsonFormat.writeFeaturesObject(features);
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @param {HTMLElement} html of the control
 * @api stable
 */
M.impl.control.WFSManagerControl.prototype.createVectorLayerFromGeoJson = function(routeJSON, layerName, active) {
	var style = this.setDefaultStyles();
	var format = new ol.format.GeoJSON();
	var features = format.readFeatures(routeJSON);
	var vectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			'useSpatialIndex': false
		}),
		zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999,
		style: style,
		visible: active
	});

	vectorLayer.set('name', layerName);
	this.map_.addLayer(vectorLayer);
	vectorLayer.getSource().addFeatures(features);
};


/**
 * This function sets a default styles to KML, GML and SHP files.	
 *
 * @private
 * @function
 * @api stable
 */
M.impl.control.WFSManagerControl.prototype.setDefaultStyles = function () {
	var fill = new ol.style.Fill({
		color: 'rgba(255, 0, 0, 0.4)'
	});
	var stroke = new ol.style.Stroke({
		color: 'red',
		width: 3
	});
	var point = new ol.style.Circle({
		fill: fill,
		stroke: stroke,
		radius: 5
	});
	return new ol.style.Style({
		stroke: stroke,
		fill: fill,
		image: point
	});
};