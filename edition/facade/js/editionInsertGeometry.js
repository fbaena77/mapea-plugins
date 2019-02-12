goog.provide('P.control.EditionInsertGeometry');


/**
 * @classdesc Main constructor of the class. Creates a EditionInsertGeometry
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionInsertGeometry = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionInsertGeometry)) {
		M.exception('La implementación usada no puede crear controles EditionInsertGeometry');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionInsertGeometry.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionInsertGeometry(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionInsertGeometry.NAME);
});
goog.inherits(M.control.EditionInsertGeometry, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionInsertGeometry.prototype.activate = function(callback, idFeature, entityLayer) {
	this.getImpl().activate(callback, idFeature, entityLayer);
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
M.control.EditionInsertGeometry.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionInsertGeometry);
};

/**
 * This function set layer for draw
 *
 * @public
 * @function
 * @param {object} layer - Layer
 * @api stable
 */
M.control.EditionInsertGeometry.prototype.setLayer = function(layer) {
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
M.control.EditionInsertGeometry.NAME = 'editionInsertGeometry';