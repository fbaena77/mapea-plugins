goog.provide('P.impl.control.Edition');

/**
 * @classdesc
 * Main constructor of the Entity.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.Edition = function() {
	/**
	 * Facade of the map
	 * @private
	 * @type {M.Map}
	 */
	this.facadeMap_ = null;

	/**
	 * Facade of the map
	 * @private
	 * @type {M.Map}
	 */
	this.element_ = null;
	/**
	 * Facade of the map
	 * @private
	 * @type {M.Map}
	 */
	this.layer_ = null;

	goog.base(this);
};
goog.inherits(M.impl.control.Edition, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.Edition.prototype.addTo = function(map, html) {
   // super addTo
   goog.base(this, 'addTo', map, html);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.impl.control.Edition.prototype.getEntityLayer = function() {
	return this.layer_;
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.impl.control.Edition.prototype.getImplLayer = function() {
	return this.layer_.getImplLayer();
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.Edition.prototype.zoomToLayer = function() {
	var extent = new ol.extent.createEmpty();
	ol.extent.extend(this.layer_.getGeometriesExtension(), this.conduccionlayer_.getGeometriesExtension());
	this.olMap.getView().fit(extent, {maxZoom:10, duration: 500});
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.Edition.prototype.selectFeature= function(featureId) {
	this.layer_.selectFeature(featureId);
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.Edition.prototype.unselectFeature= function(featureId) {
	this.layer_.unselectFeature(featureId);
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.impl.control.Edition.prototype.getGeometriesExtension = function () {	
	return this.layer_.getGeometriesExtension();
};
