goog.provide('P.impl.control.EditionHighlightGeometry');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc Main constructor of the class. Creates a EditionHighlightGeometry
 *            control
 * 
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionHighlightGeometry = function(map, layer) {
	/**
	 * Facade map object
	 * @public
	 * @type {M.Map}
	 */
	this.map_ = map;
	/**
	 * OpenLayers interaction object
	 * @public
	 * @type {ol.interaction.Select}
	 */
	this.highlightInteraction_ = null;
	goog.base(this, map, layer);
};
goog.inherits(M.impl.control.EditionHighlightGeometry,
		M.impl.control.EditionGeometryBase);

/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.impl.control.EditionHighlightGeometry.prototype.createInteraction = function(callback, idFeature) {
	var this_ = this;
	this.highlightStyle = [
		new ol.style.Style({
			fill: new ol.style.Fill({ 
				color: [249, 177, 10, 0.2] 
			})
		}),
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'orange', width: 2.5
			})
		})
	];

	this.highlightInteraction_ = new ol.interaction.Select({
		layers: [this.layer_.getImplLayer()],
		condition: ol.events.condition.pointerMove,
		style: this_.highlightStyle
	});

	this.interactions_.push(this.highlightInteraction_);
};
