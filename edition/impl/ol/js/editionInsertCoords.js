goog.provide('P.impl.control.EditionInsertCoords');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionInsertCoords
 * control
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionInsertCoords = function(map, layer) {
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
goog.inherits(M.impl.control.EditionInsertCoords, M.impl.control.EditionGeometryBase);

/**
 * This function creates the interaction to draw
 *
 * @private
 * @function
 * @param {object} callback - Callback function in activation
 * @api stable
 */
M.impl.control.EditionInsertCoords.prototype.createInteraction = function(callback) {
	var layerImpl = this.layer_.getImplLayer();

	this.drawInteraction_ = new ol.interaction.Draw({
		'source': layerImpl.getSource(),
		'type': this.layer_.getType(),
		'style':layerImpl.getStyle(),
	});

	this.drawInteraction_.on('drawend', callback, this);
	this.interactions_.push(this.drawInteraction_);
};

