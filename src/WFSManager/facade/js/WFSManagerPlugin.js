goog.provide('P.plugin.WFSManager');

goog.require('P.control.WFSManagerControl');

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
M.plugin.WFSManager = (function(params) {
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
     this.WFSManagerControl_ = null;

     /**
      * params
      * @private
      * @type {Object}
      */
     this.params_ = params;

   goog.base(this);
});
goog.inherits(M.plugin.WFSManager, M.Plugin);

/**
 * This function adds this plugin into the map
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.WFSManager.prototype.addTo = function(map) {
   this.map_ = map;
   this.WFSManagerControl_ = new M.control.WFSManager(this.params_);
   this.controls_.push(this.WFSManagerControl_);
   
   this.panel_ = new M.ui.Panel("WFSManager", {
      'collapsible': true,
      'collapsedButtonClass': 'g-cartografia-capas2',
      'className': 'm-wfsmanager',
      'position': M.ui.position.TR,
      'tooltip': 'Servicios WFS'
   });
   
   this.panel_.addControls([this.WFSManagerControl_]);
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
M.plugin.WFSManager.prototype.getControls = function() {
   return this.controls_;
};