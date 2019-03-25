goog.provide('P.plugin.advLS');

goog.require('P.control.advLSControl');

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {Object} client parameters
 * @api stable
 */
M.plugin.advLS = (function(params) {
    /**
      * Facade of the map
      * @private
      * @type {M.Map}
      */
     this.map_ = null;

     /**
      * Array of controls
      * @private
      * @type {Object}
      */
     this.controls_ = [];

     /**
      * advancedLayerSwitcher control
      * @private
      * @type {Object}
      */
     this.advLSControl_ = null;

     /**
      * params
      * @private
      * @type {Object}
      */
     this.params_ = params;

   goog.base(this);
});
goog.inherits(M.plugin.advLS, M.Plugin);

/**
 * This function adds this plugin into the map
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.advLS.prototype.addTo = function(map) {
   this.map_ = map;
   this.advLSControl_ = new M.control.advLS(this.params_);
   this.controls_.push(this.advLSControl_);
   
   this.panel_ = new M.ui.Panel("Advanced Layer Switcher", {
      'collapsible': true,
      'collapsedButtonClass': 'g-cartografia-capas2',
      'className': 'm-advancedlayerswitcher',
      'position': M.ui.position.TR,
      'tooltip': 'Advanced Layer Switcher'
   });
   
   this.panel_.addControls([this.advLSControl_]);
   this.map_.addPanels(this.panel_);
};

/**
 * Returns controls from the plugin
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.advLS.prototype.getControls = function() {
   return this.controls_;
};