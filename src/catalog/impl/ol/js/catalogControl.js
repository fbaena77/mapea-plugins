goog.provide('P.impl.control.CatalogControl');

/**
 * @classdesc
 * Main constructor of the CatalogControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.CatalogControl = function() {
   goog.base(this);
};
goog.inherits(M.impl.control.CatalogControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.CatalogControl.prototype.addTo = function(map, html) {
   // super addTo
   goog.base(this, 'addTo', map, html);
};
