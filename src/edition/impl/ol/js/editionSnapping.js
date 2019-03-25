goog.provide('P.impl.control.EditionSnapping');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionSnapping
 * control
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionSnapping = function(map, layer) {
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
	this.snapInteraction_ = null;

	goog.base(this, map, layer);
};
goog.inherits(M.impl.control.EditionSnapping, M.impl.control.EditionGeometryBase);

/**
 * This function creates the interaction to draw
 *
 * @private
 * @function
 * @param {object} callback - Callback function in activation
 * @api stable
 */
M.impl.control.EditionSnapping.prototype.createInteraction = function(callback, idFeature) {
	this.snapInteraction_ = new ol.interaction.Snap({
		  source: this.layer_.getImplLayer().getSource()
		});

	this.interactions_.push(this.snapInteraction_);
};
