goog.provide('P.plugin.Edition');

goog.require('P.control.Edition');

(function () {
	/**
	 * @classdesc
	 * Main facade plugin object. This class creates a plugin
	 * object which has an implementation Object
	 *
	 * @constructor
	 * @extends {M.Plugin}
	 * @api stable
	 */
	M.plugin.Edition = (function (userParameters) {
		if (M.utils.isNullOrEmpty(userParameters)) {
			M.exception('No ha especificado ningún parámetro');
		}
		/**
		 * Initialization params
		 * @private
		 * @type {Object}
		 */
		this.userParameters_ = userParameters;
		/**
		 * Plugin configuration
		 * @private
		 * @type {Object}
		 */
		this.config_ = userParameters.config;
		/**
		 * Array of controls
		 * @private
		 * @type {Array}
		 */
		this.control_ = null;
		/**
		 * Facade of the map
		 * @private
		 * @type {M.Map}
		 */
		this.map_ = null;

		goog.base(this);
	});
	goog.inherits(M.plugin.Edition, M.Plugin);

	/**	
	 * This function adds this plugin into a new panel
	 *
	 * @public
	 * @function
	 * @param {M.Map} map the map to add the plugin
	 * @api stable
	 */
	M.plugin.Edition.prototype.addTo = function (map) {
		var this_ = this;
		this.map_ = map;
		this.panel_ = new M.ui.Panel('Edition', {
			'collapsible': true,
			'className': 'm-edition',
			'collapsedButtonClass': 'g-editiontools-closed',
			'openedButtonClass': 'g-editiontools-opened-'+this.config_.orientation,
			'position': this.config_.position,
			'tooltip': 'Herramientas de edición'
		});

		this.panel_.on(M.evt.ADDED_TO_MAP, function (html) {
			M.utils.enableTouchScroll(html);
			this_.panel_.open();
		});

		this.control_ = new M.control.Edition(this.userParameters_);
		this.panel_.addControls(this.control_);
		this.map_.addPanels(this.panel_);
	};

	/**
	 * This function destroys this plugin
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.plugin.Edition.prototype.destroy = function () {
		this.map_.removeControls(this.control_);
		this.map_ = null;
	};
	/**
	 * This function returns the controls instanced in this plugin
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.plugin.Edition.prototype.getControls = function () {
		return this.control_;
	};

})();