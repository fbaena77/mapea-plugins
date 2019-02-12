goog.provide('P.control.EditionTranslateGeometry');


/**
 * @classdesc Main constructor of the class. Creates a EditionTranslateGeometry
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionTranslateGeometry = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionTranslateGeometry)) {
		M.exception('La implementación usada no puede crear controles EditionTranslateGeometry');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionTranslateGeometry.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionTranslateGeometry(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionTranslateGeometry.NAME);
});
goog.inherits(M.control.EditionTranslateGeometry, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionTranslateGeometry.prototype.activate = function(callback, idFeature) {
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
M.control.EditionTranslateGeometry.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionTranslateGeometry);
};

/**
 * This function set layer for draw
 *
 * @public
 * @function
 * @param {object} layer - Layer
 * @api stable
 */
M.control.EditionTranslateGeometry.prototype.setLayer = function(layer) {
	this.getImpl().layer_ = layer;
};

/**
 * Name for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.EditionTranslateGeometry.NAME = 'editionTranslateGeometry';
