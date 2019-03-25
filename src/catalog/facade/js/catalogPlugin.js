goog.provide('P.plugin.Catalog');

goog.require('P.control.CatalogControl');


(function() {
	/**
	 * @classdesc
	 * Main facade plugin object. This class creates a plugin
	 * object which has an implementation Object
	 *
	 * @constructor
	 * @extends {M.Plugin}
	 * @api stable
	 */
	M.plugin.Catalog= (function(userParameters) {
		// checks if the param is null or empty
		if (M.utils.isNullOrEmpty(userParameters)) {
			M.exception('No ha especificado ningún parámetro');
		}
		/**
		 * Array of controls
		 * @private
		 * @type {Array}
		 */
		this.advLS_ = userParameters.advLS;
		/**
		 * Array of controls
		 * @private
		 * @type {Array}
		 */
		this.WFSManager_ = userParameters.WFSManager;
		/**
		 * Array of controls
		 * @private
		 * @type {Array}
		 */
		this.connector_ = userParameters.connector;
		/**
		 * Array of controls
		 * @private
		 * @type {Array}
		 */
		this.controls_ = [];
		/**
		 * Plugin configuration
		 * @private
		 * @type {Object}
		 */
		this.config_ = userParameters.config;

		/**
		 * Facade of the map
		 * @private
		 * @type {M.Map}
		 */
		this.map_ = null;
		/**
		 * Plugin configuration
		 * @private
		 * @type {Object}
		 */
		this.position_ = M.ui.position.TL;
		/**
		 * Plugin configuration
		 * @private
		 * @type {Object}
		 */
		this.width_ = "380px";

		goog.base(this);
	});
	goog.inherits(M.plugin.Catalog, M.Plugin);

	/**
	 * This function adds this plugin into a new panel
	 *
	 * @public
	 * @function
	 * @param {M.Map} map the map to add the plugin
	 * @api stable
	 */
	M.plugin.Catalog.prototype.addTo = function(map) {
		var this_ = this;
		this.map_ = map;

		if(this.config_!== undefined){
			if(this.config_.position !== undefined){
				this.position_ = this.config_.position;	
			}

			if(this.config_.width !== undefined){
				this.width_ = this.config_.width === 'SMALL' ? "290px" : (this.config_.width === 'LARGE' ? "530px" : this.width_);
			}
		}
		else{
			M.exception('Configuración del plugin Catalog no válida');
		}


		goog.dom.classlist.add(map._areasContainer.getElementsByClassName("m-top m-left")[0], "top-extra");
		this.panel_ = new M.ui.Panel('Catalog', {
			'collapsible': true,
			'className': 'm-catalog collapsed',
			'collapsedButtonClass': 'g-catalog-closed',
			'openedButtonClass': 'g-catalog-opened',
			'position': this_.position_,
			'tooltip': 'Catálogo'
		});
		this.panel_.on(M.evt.ADDED_TO_MAP, function (html) {
			M.utils.enableTouchScroll(html);
			if(this_.config_.opened === undefined || this_.config_.opened){
				this_.panel_.open();
			}
		});
		
		this.panel_.on(M.evt.SHOW, function (html) {
			html._buttonPanel.style.cssText = 'background-color:'+this_.config_.color+'!important';
		});
		
		this.panel_.on(M.evt.HIDE, function (html) {
			html._buttonPanel.style.cssText = 'background-color: white !important';
		});
		
		var advLSControl = new M.control.advLSControl(this.advLS_);
		var wfsVisible = false;
		if(this.WFSManager_){
			var WFSManagerControl = new M.control.WFSManagerControl(this.WFSManager_);
			this.controls_.push(WFSManagerControl);
			wfsVisible = true;
		}
		
		this.controls_.push(advLSControl);

		this.panel_.addControls(new M.control.CatalogControl(this.controls_,this.config_, this.width_, wfsVisible));
		this.map_.addPanels(this.panel_);
	};

	/**
	 * This function destroys this plugin
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.plugin.Catalog.prototype.destroy = function() {
		this.map_.removeControls(this.controls_);
		this.map_ = null;
	};

	M.plugin.Catalog.prototype.getControls = function() {
		return this.controls_;
	};

})();