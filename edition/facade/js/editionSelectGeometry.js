goog.provide('P.control.EditionSelectGeometry');

/**
 * @classdesc Main constructor of the class. Creates a EditionSelectGeometry
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionSelectGeometry = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionSelectGeometry)) {
		M.exception('La implementación usada no puede crear controles EditionSelectGeometry');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionSelectGeometry.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionSelectGeometry(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionSelectGeometry.NAME);
});
goog.inherits(M.control.EditionSelectGeometry, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionSelectGeometry.prototype.activate = function(callback, idFeature) {
	this.getImpl().activate(callback, idFeature);
	this.activated = true;
};

/**
 * This function checks if an object is equals to this control
 *
 * @function
 * @api stable
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 */
M.control.EditionSelectGeometry.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionSelectGeometry);
};

/**
 * This function set layer for draw
 *
 * @public
 * @function
 * @param {object} layer - Layer
 * @api stable
 */
M.control.EditionSelectGeometry.prototype.setLayer = function(layer) {
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
M.control.EditionSelectGeometry.NAME = 'editionSelectGeometry';
