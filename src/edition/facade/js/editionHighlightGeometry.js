goog.provide('P.control.EditionHighlightGeometry');

/**
 * @classdesc Main constructor of the class. Creates a EditionHighlightGeometry
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionHighlightGeometry = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionHighlightGeometry)) {
		M.exception('La implementación usada no puede crear controles EditionHighlightGeometry');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionHighlightGeometry.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionHighlightGeometry(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionHighlightGeometry.NAME);
});
goog.inherits(M.control.EditionHighlightGeometry, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionHighlightGeometry.prototype.activate = function(callback, idFeature) {
	this.getImpl().activate(callback, idFeature);
	this.activated = true;
};

/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionHighlightGeometry.prototype.deactivate = function() {
	this.getImpl().deactivate();
	this.getImpl().highlightInteraction_ = null;
};

/**
 * This function checks if an object is equals to this control
 *
 * @function
 * @api stable
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 */
M.control.EditionHighlightGeometry.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionHighlightGeometry);
};

/**
 * This function set layer for draw
 *
 * @public
 * @function
 * @param {object} layer - Layer
 * @api stable
 */
M.control.EditionHighlightGeometry.prototype.setLayer = function(layer) {
	this.getImpl().layer_ = layer;
};

/**
 * Name for this control
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.EditionHighlightGeometry.NAME = 'EditionHighlightGeometry';
