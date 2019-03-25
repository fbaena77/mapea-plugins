goog.provide('P.control.EditionInsertCoords');

/**
 * @classdesc Main constructor of the class. Creates a EditionInsertCoords
 * control to draw features on the map.
 *
 * @constructor
 * @param {M.Map} map - Facade map
 * @param {object} layer - Layer for use in control
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionInsertCoords = (function(map, layer) {
	if (M.utils.isUndefined(M.impl.control.EditionInsertCoords)) {
		M.exception('La implementación usada no puede crear controles EditionInsertCoords');
	}
	/**
	 * Name of the control
	 * @public
	 * @type {String}
	 */
	this.name = M.control.EditionInsertCoords.NAME;
	// implementation of this control
	var impl = new M.impl.control.EditionInsertCoords(map, layer);

	// calls the super constructor
	goog.base(this, impl, M.control.EditionInsertCoords.NAME);
});
goog.inherits(M.control.EditionInsertCoords, M.Control);


/**
 * This function activates this interaction control
 *
 * @function
 * @api stable
 * @param {object} callback - Callback function in activation
 * @param {object} idFeature
 */
M.control.EditionInsertCoords.prototype.activate = function(callback, idFeature) {
	this.getImpl().activate(callback, idFeature);
};

/**
 * This function checks if an object is equals to this control
 *
 * @function
 * @api stable
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 */
M.control.EditionInsertCoords.prototype.equals = function(obj) {
	return (obj instanceof M.control.EditionInsertCoords);
};

/**
 * This function set layer for draw
 *
 * @public
 * @function
 * @param {object} layer - Layer
 * @api stable
 */
M.control.EditionInsertCoords.prototype.setLayer = function(layer) {
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
M.control.EditionInsertCoords.NAME = 'editionInsertCoords';
