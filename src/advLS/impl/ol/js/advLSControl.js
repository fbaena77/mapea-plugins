goog.provide('P.impl.control.advLSControl');

/**
 * @classdesc
 * Main constructor of the advLSControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.advLSControl = function(base) {
	
	this.map_ = null;
	this.base_ = base;
	
	goog.base(this);
};
goog.inherits(M.impl.control.advLSControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @param {HTMLElement} html of the control
 * @api stable
 */
M.impl.control.advLSControl.prototype.addTo = function(map, html) {
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
M.impl.control.advLSControl.prototype.createGeoJsonLayer = function(layer) {
	var geojsonFormat = new ol.format.GeoJSON();
	var features;
	if(layer.type!=="Vector"){
		features = layer.getSource().getFeatures();
	}
	else{
		features = layer.getImpl().getOL3Layer().getSource().getFeatures();
	}
	
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
M.impl.control.advLSControl.prototype.createVectorLayerFromGeoJson = function(map, routeJSON, node) {
	var style = this.setStyle(node.style.fillColor, node.style.strokeColor);
	var format = new ol.format.GeoJSON();
	var features = format.readFeatures(routeJSON);
	var vectorLayer;
	if(node.formatType === "VEC"){
		var editionLayer = new M.impl.AdvLSVectorLayer(map, node.layerInfo.name);
		this.base_.editionLayers_.push(editionLayer);
		features.forEach(function(feature) {
			editionLayer.addFeature(feature);
		});
	}
	else{
		var vectorLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				'useSpatialIndex': false
			}),
			zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999,
			style: style,
			visible: node.active
		});

		vectorLayer.set('name', node.layerInfo.name);
		map.getMapImpl().addLayer(vectorLayer);
		vectorLayer.getSource().addFeatures(features);
	}
};


/**
 * This function sets a default styles to KML, GML and SHP files.	
 *
 * @private
 * @function
 * @api stable
 */
M.impl.control.advLSControl.prototype.setStyle = function (fillColor, strokeColor) {
	var fill = new ol.style.Fill({
		color: fillColor
	});
	var stroke = new ol.style.Stroke({
		color: strokeColor,
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