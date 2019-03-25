goog.provide('P.impl.control.WFSManagerAddServiceControl');

/**
 * @classdesc
 * Main constructor of the WFSManagerAddServiceControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.WFSManagerAddServiceControl = function() {
	goog.base(this);
};
goog.inherits(M.impl.control.WFSManagerAddServiceControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.WFSManagerAddServiceControl.prototype.addTo = function(map, html) {
	// super addTo
	goog.base(this, 'addTo', map, html);
};