goog.provide('P.impl.control.EditionInsertGeometry');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionInsertGeometry
 * control
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionInsertGeometry = function(map, layer) {
	/**
	 * Facade map object
	 * @public
	 * @type {M.Map}
	 */
	this.map_ = map;
	/**
	 * OpenLayers interaction object
	 * @public
	 * @type {ol.interaction}
	 */
	this.drawInteraction_ = null;

	goog.base(this, map, layer);
};
goog.inherits(M.impl.control.EditionInsertGeometry, M.impl.control.EditionGeometryBase);

/**
 * This function creates the interaction to draw
 *
 * @private
 * @function
 * @param {object} callback - Callback function in activation
 * @api stable
 */
M.impl.control.EditionInsertGeometry.prototype.createInteraction = function(callback, idFeature, entityLayer) {
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.2)'
		}),
		stroke: new ol.style.Stroke({
			color: '#ffcc33',
			width: 2
		}),
		image: new ol.style.Circle({
			radius: 4,
			fill: new ol.style.Fill({
				color: '#ffcc33'
			})
		})
	});

	var layerType = this.layer_.getType();

	if(entityLayer!==null && entityLayer!==undefined){
		layerType = entityLayer.getType();
	}

	var geometryType = this.getSimpleType(layerType);
	this.drawInteraction_ = new ol.interaction.Draw({
		type: geometryType,
		style: style,
	});

	this.drawInteraction_.on('drawend', callback, this);
	this.interactions_.push(this.drawInteraction_);
};

/**
 * This function gets the simple type geometry from a complex geometry type
 *
 * @private
 * @param {String} type - Geometry type
 * @function
 * @api stable
 */
M.impl.control.EditionInsertGeometry.prototype.getSimpleType = function(type) {
	if(type==='MultiPoint' || type==='Point'){
		return 'Point';
	}
	else if(type==='MultiPolygon' || type==='Polygon'){
		return 'Polygon';
	}
	else if(type==='MultiLineString' || type==='LineString'){
		return 'LineString';
	}
};
