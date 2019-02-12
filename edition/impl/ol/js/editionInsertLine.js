goog.provide('P.impl.control.EditionInsertLine');

goog.require('P.impl.control.EditionGeometryBase');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionInsertLine
 * control
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.impl.control.EditionInsertLine = function(map, layer) {
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
goog.inherits(M.impl.control.EditionInsertLine, M.impl.control.EditionGeometryBase);

/**
 * This function creates the interaction to draw
 *
 * @private
 * @function
 * @param {object} callback - Callback function in activation
 * @api stable
 */
M.impl.control.EditionInsertLine.prototype.createInteraction = function(callback) {
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

	this.drawInteraction_ = new ol.interaction.Draw({
		type: 'LineString',
		style: style,
	});

	this.drawInteraction_.on('drawend', callback, this);
	this.interactions_.push(this.drawInteraction_);
};