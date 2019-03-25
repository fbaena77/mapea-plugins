goog.provide('P.impl.control.EditionTranslateGeometry');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionTranslateGeometry
 * control
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionTranslateGeometry = function(map, layer) {
	/**
	 * Facade map object
	 * @public
	 * @type {M.Map}
	 */
	this.map_ = map;
	/**
	 * OpenLayers select interaction object
	 * @public
	 * @type {ol.interaction.Select}
	 */
	this.selectTranslateInteraction_ = null;
	/**
	 * OpenLayers interaction object
	 * @public
	 * @type {ol.interaction.Translate}
	 */
	this.translateInteraction_ = null;
	goog.base(this, map, layer);
};

goog.inherits(M.impl.control.EditionTranslateGeometry, M.impl.control.EditionGeometryBase);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.impl.control.EditionTranslateGeometry.prototype.createInteraction = function(callback, idFeature) {
	var featuresCollection = this.layer_.getFeatureCollectionById(idFeature);
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.4)'
		}),
		stroke: new ol.style.Stroke({
			color: '#ffcc33',
			width: 3
		})
	});
	this.translateInteraction_ = new ol.interaction.Translate({
		features: featuresCollection,
		style: style
	});

	this.translateInteraction_.on('translateend', callback, this);
	this.interactions_.push(this.translateInteraction_);
};

/**
 * DEPRECATED
 *
 * @private
 * @function
 */
M.impl.control.EditionTranslateGeometry.prototype.addSelectionListener = function() {
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.4)'
		}),
		stroke: new ol.style.Stroke({
			color: '#ffcc33',
			width: 3
		})
	});
	var collection = this.selectTranslateInteraction_.getFeatures();
	collection.forEach(function(feature){
		feature.setStyle(style);
	});
};

/**
 * DEPRECATED
 *
 * @private
 * @function
 */
M.impl.control.EditionTranslateGeometry.prototype.removeSelectionListener = function() {
	var this_ = this;
	var collection = this.layer_.getImplLayer().getSource().getFeatures();
	collection.forEach(function(feature){
		feature.setStyle(this_.layer_.getImplLayer().getStyle());
	});
};
