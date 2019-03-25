goog.provide('P.impl.control.EditionGeometryControl');

/**
 * @classdesc
 * Main constructor of the EditionGeometryControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.EditionGeometryControl = function(map) {
	this.map = map;
	goog.base(this);
};
goog.inherits(M.impl.control.EditionGeometryControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.addTo = function(map, html) {
	// super addTo
	goog.base(this, 'addTo', map, html);
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getFeaturesFromGeoJson = function (geojson) {
	var geojsonFormat = new ol.format.GeoJSON();
	return geojsonFormat.readFeatures(geojson);	
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getGeoJsonFromFeature = function (feature) {
	var geojsonFormat = new ol.format.GeoJSON();
	return geojsonFormat.writeFeatureObject(feature);
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getFilterPointFeatureRequestBody = function (requestParams, coordinates) {
	var point = new ol.geom.Point(coordinates);
	var srsName_ = this.map.getProjection().code;
	return new ol.format.WFS().writeGetFeature({
		srsName: srsName_,
		featurePrefix: requestParams.featurePrefix,
		featureTypes: requestParams.featureTypes,
		outputFormat: requestParams.outputFormat,
		maxFeatures:100,
		filter: ol.format.filter.intersects(requestParams.geomField, point, srsName_)
	});
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getFilterPolygonFeatureRequestBody = function (requestParams, geom) {
	var srsName_ = this.map.getProjection().code;
	var geomA = geom;
	if(geom.getType()==='Circle'){
		var extent = geom.getExtent();
		geomA = new ol.geom.Polygon.fromCircle(geom);
	}
	var filterA = ol.format.filter.or(
			ol.format.filter.within(requestParams.geomField, geomA, srsName_),
			ol.format.filter.intersects(requestParams.geomField, geomA, srsName_)
	); 
	if(geom.getType()==='Polygon'){
		filterA = ol.format.filter.within(requestParams.geomField, geomA, srsName_);
	}
	
	return new ol.format.WFS().writeGetFeature({
		srsName: srsName_,
		featurePrefix: requestParams.featurePrefix,
		featureTypes: requestParams.featureTypes,
		outputFormat: requestParams.outputFormat,
		maxFeatures:100,
		filter: filterA
	});
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getBbox = function (coordinates) {
	var bbox_ = ol.extent.boundingExtent([coordinates, coordinates]);
	for(let i=0;i<bbox_.length;i++){
		if(i==2||i==3){
			bbox_[i] = bbox_[i] +0.0000000001;
		}
	}

	return bbox_;
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.getModifyStyle = function (olFeature) {
	return [
		new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(239,245,3,0.25)'
			}),
			stroke: new ol.style.Stroke({
				width: 3,
				color: 'rgba(239,245,3, 0.8)'
			}),
		}),
		new ol.style.Style({
			image: new ol.style.Circle({
				radius: 6,
				fill: new ol.style.Fill({
					color: 'rgba(230,137,16, 0.8)'
				})
			}),
			geometry: function (feature) {
				// return the coordinates of the first ring of the polygon
				var coordinates = olFeature.getGeometry().getCoordinates()[0];
				if(olFeature.getGeometry().getType()==="MultiPolygon"){
					coordinates = olFeature.getGeometry().getCoordinates()[0][0];	
				}
				return new ol.geom.MultiPoint(coordinates);
			}
		})
		];
};

/**
 * This function set layer for modify features
 *
 * @public
 * @function
 * @param {M.layer.WFS} layer - Layer
 * @api stable
 */
M.impl.control.EditionGeometryControl.prototype.createOLPolygonFeature = function (olFeature) {
	var format = new ol.format.GeoJSON();
	var routeFeatures = format.writeFeature(olFeature);
	var json = JSON.parse(routeFeatures);
	var featureTmp;

	for(let j = 0; j < json.geometry.coordinates.length; j++){
		var polygon = new ol.geom.Polygon(json.geometry.coordinates[j]);

		var projection = ol.proj.get(this.map.getProjection().code);
		featureTmp = new ol.Feature({
			geometry: polygon,
			dataProjection: projection
		});

		featureTmp.setId(Math.floor(Math.random()*1000000));
	}

	return featureTmp;
};