goog.provide('P.impl.control.advLSAddFileControl');

/**
 * @classdesc
 * Main constructor of the advLSAddFileControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.advLSAddFileControl = function() {
	goog.base(this);
};
goog.inherits(M.impl.control.advLSAddFileControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.addTo = function(map, html) {
	// super addTo
	goog.base(this, 'addTo', map, html);
};

/**
 * This function generates a random hexadecimal color
 *
 * @private
 * @function
 * @returns {string} color
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.getLayerGeometryType = function(layer) {
	var features = layer.getSource().getFeatures();
	if(features.length>0){
		var layerGeometryType = features[0].getGeometry().getType();
		return layerGeometryType;	
	}
	else{
		return null;
	}
};

/**
 * This function generates a random hexadecimal color
 *
 * @private
 * @function
 * @returns {string} color
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.getLayerStyles = function(layer) {
	var layerStyles = {
		fillColor: layer.getStyle().getFill().getColor(),
		strokeColor: layer.getStyle().getStroke().getColor()	
	};
	return layerStyles;
};

/**
 * This function generates a random hexadecimal color
 *
 * @private
 * @function
 * @returns {string} color
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.generateRandomColor = function() {
  var o = Math.round, r = Math.random, s = 255;
  var opacity = 0.7;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + opacity + ')';
};

/**
 * This function sets a default styles to KML, GML and SHP files.	
 *
 * @private
 * @function
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.setDefaultStyles = function () {
	var fill = new ol.style.Fill({
		color: this.generateRandomColor()
	});
	var stroke = new ol.style.Stroke({
		color: this.generateRandomColor(),
		width: 2
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

/**
 * This function adds a SHP layer to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map
 * @param {Array} features
 * @param {string} layerName
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.addShpLayerByGeoJson = function (map, geojson, layerName) {
	var projection = map.getProjection();
	var geojsonFormat = new ol.format.GeoJSON();
	var originProjection = geojsonFormat.readProjection(geojson).getCode();
	var finalProjection = projection.code;
	var features = geojsonFormat.readFeatures(geojson, {
		dataProjection: originProjection,
		featureProjection: finalProjection
	});	
	var style = this.setDefaultStyles();
	var vector = new ol.layer.Vector({
		source: new ol.source.Vector({
			'useSpatialIndex': false
		}),
		zIndex: M.impl.Map.Z_INDEX[M.layer.type.WMS] + 999,
		type: 'SHP',
		style: style,
		visible: true
	});

	vector.set('name', layerName);
	vector.getSource().addFeatures(features);
	map.getMapImpl().addLayer(vector);
	
	return vector;
};

/**
 * This function adds a SHP layer to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map
 * @param {Array} features
 * @param {string} layerName
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.addShpLayer = function (map, features, layerName) {
	var style = this.setDefaultStyles();
	var vector = new ol.layer.Vector({
		source: new ol.source.Vector({
			'useSpatialIndex': false
		}),
		zIndex: M.impl.Map.Z_INDEX[M.layer.type.WMS] + 999,
		type: 'SHP',
		style: style,
		visible: true
	});

	vector.set('name', layerName);
	var olFeatures = [];

	for (let i=0;i<features.length;i++){
		var coordinates = features[i].geometry.coordinates;
		if(coordinates===null){
			return;
		}

		if(features[i].geometry.type===M.geom.wkt.type.POLYGON){
			this.geometry = new ol.geom.Polygon(coordinates);
		}
		else if (features[i].geometry.type===M.geom.wkt.type.MULTI_POLYGON){
			this.geometry = new ol.geom.MultiPolygon(coordinates);
		}
		else if(features[i].geometry.type===M.geom.wkt.type.POINT){
			this.geometry = new ol.geom.MultiPoint([coordinates]);
		}
		else if (features[i].geometry.type===M.geom.wkt.type.MULTI_POINT){
			this.geometry = new ol.geom.MultiPoint(coordinates);
		}
		else if (features[i].geometry.type===M.geom.wkt.type.LINE_STRING){
			this.geometry = new ol.geom.LineString(coordinates);
		}
		else if (features[i].geometry.type===M.geom.wkt.type.MULTI_LINE_STRING){
			this.geometry = new ol.geom.MultiLineString(coordinates);
		}

		if(this.geometry!==undefined){
			var feature = new ol.Feature({
				geometry: this.geometry
			});

			olFeatures.push(feature);
		}
	}

	if(olFeatures.length>0){
		vector.getSource().addFeatures(olFeatures);
	}
	
	map.getMapImpl().addLayer(vector);
	return vector;
};

/**
 * This function adds a GML or KML layer to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map
 * @param {object} layer
 * @api stable
 */
M.impl.control.advLSAddFileControl.prototype.addXmlLayer = function (map, layer) {
	var format = null;
	var layerName = layer.name.substring(0, layer.name.indexOf("."));
	var srsName_ = map.getProjection().code;
	
	if(layer.type==="KML"){
		format = new ol.format.KML({
			extractStyles: false
		});
	}
	else if(layer.type==="GML"){
		format = new ol.format.GML({
            srsName: srsName_
        });
		
		if(format.readFeatures(layer.xml)[0].getGeometry().getCoordinates().length===0){
			format = new ol.format.GML2({
	            srsName: srsName_
	        });
			
			if(format.readFeatures(layer.xml)[0].getGeometry().getCoordinates().length===0){
				format = new ol.format.GML3({
		            srsName: srsName_
		        });
				
				if(format.readFeatures(layer.xml)[0].getGeometry().getCoordinates().length===0){
					format = new ol.format.WFS({
			            srsName: srsName_
			        });
				}
			}
		}
	}

	var style = this.setDefaultStyles();
	var vector = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: layer.url,
			format: format
		}),
		projection: srsName_,
		zIndex: M.impl.Map.Z_INDEX[M.layer.type.WMS] + 999,
		type: layer.type,
		transparent: true,
		style: style
	});
	vector.set('name', layerName);
	map.getMapImpl().addLayer(vector);

	return new Promise(function(resolve, reject) {
		vector.getSource().on('change', function(evt){	
			var source = evt.target;
  			if (source.getState() === 'ready') {
				resolve(vector);
			}
		});	 
	});
};