goog.provide('P.control.EditionTemporalGeometry');


/**
 * @classdesc Main constructor of the class. Creates a EditionTemporalGeometry
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionTemporalGeometry = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionTemporalGeometry)) {
		M.exception('La implementación usada no puede crear controles EditionInsertLine');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionTemporalGeometry.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionTemporalGeometry(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionTemporalGeometry.NAME);
});
goog.inherits(M.control.EditionTemporalGeometry, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionTemporalGeometry.prototype.activate = function(callback, idFeature, layer) {
	this.getImpl().activate(callback, idFeature, layer);
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
M.control.EditionTemporalGeometry.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionTemporalGeometry);
};

/**
 * Name for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.EditionTemporalGeometry.NAME = 'editionInsertLine';