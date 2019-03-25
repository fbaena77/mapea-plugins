goog.provide('P.control.EditionInsertLine');


/**
 * @classdesc Main constructor of the class. Creates a EditionInsertLine
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionInsertLine = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionInsertLine)) {
		M.exception('La implementación usada no puede crear controles EditionInsertLine');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionInsertLine.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionInsertLine(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionInsertLine.NAME);
});
goog.inherits(M.control.EditionInsertLine, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionInsertLine.prototype.activate = function(callback, idFeature, layer) {
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
M.control.EditionInsertLine.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionInsertLine);
};

/**
 * Name for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.EditionInsertLine.NAME = 'editionInsertLine';