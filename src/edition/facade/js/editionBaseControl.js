goog.provide('P.control.Edition');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a Edition
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stablev
 */
M.control.Edition = (function (userParameters) {
	if (M.utils.isUndefined(M.impl.control.Edition)) {
		M.exception('La implementación usada no puede crear controles Edition');
	}
	/**
	 * Entity name
	 * @private
	 * @type {String}
	 */
	this.name = "EditionControl";
	/**
	 * Entity config parameters
	 * @private
	 * @type {Integer}
	 */
	this.config_ = userParameters.config;
	/**
	 * Html Element
	 * @private
	 * @type {Object}
	 */
	this.element_ = null;
	/**	
	 * Edition layer
	 * @private
	 * @type {Object}
	 */
	this.editionLayer = null;
	/**
	 * Map object
	 * @private
	 * @type {Object}
	 */
	this.facadeMap_ = null;

	// implementation of this control
	this.impl_ = new M.impl.control.Edition();
	// calls super constructor (scope, implementation, controlName)
	goog.base(this, this.impl_, this.name);
});

goog.inherits(M.control.Edition, M.Control);

/**
 * This function creates the view to the specified map
 *
 * @public
 * @function
 * @param {Object} Map
 * @returns {Promise} HTML template
 * @api stable
 */
M.control.Edition.prototype.createView = function (map) {
	var this_ = this;
	this.facadeMap_ = map;
	return new Promise(function (success) {
		return M.template.compile(M.control.Edition.TEMPLATE,{
			'jsonp': false,
			'vars': {
				'orientation': this_.config_.orientation
			}	
		}).then(function (html) {
			this_.element_ = html;
			this_.createControls();
			this_.addEvents(map, html);
			success(html);
		});
	});
};

/**
 * This function creates the edition controls
 *
 * @public
 * @function
 * @api stable
 */
M.control.Edition.prototype.createControls = function () {
	this.insertGeomControl = new M.control.EditionInsertGeometry(this.facadeMap_, this.editionLayer);
	this.modifyGeomControl = new M.control.EditionModifyGeometry(this.facadeMap_, this.editionLayer);
	this.translateGeomControl = new M.control.EditionTranslateGeometry(this.facadeMap_, this.editionLayer);
	this.selectGeomControl = new M.control.EditionSelectGeometry(this.facadeMap_, this.editionLayer);
	this.highlightControl = new M.control.EditionHighlightGeometry(this.facadeMap_, this.editionLayer);
	this.snappingControl = new M.control.EditionSnapping(this.facadeMap_, this.editionLayer);
	this.geomControl = new M.control.EditionGeometryControl(this);
};

/**
 * This function gets the edition layer from Catalog Plugin
 *
 * @public
 * @function
 * @api stable
 */
M.control.Edition.prototype.getEditionLayer = function () {
	var layersCatalog = this.facadeMap_.getPanels('Catalog')[0].getControls()[0];
	if(layersCatalog){
		for(let i=0;i<layersCatalog.controls_.length;i++){
			if(layersCatalog.controls_[i].name==="advLSControl"){
				this.layersManagerCtl = layersCatalog.controls_[i];		
			}
		}
		this.editionLayer = this.layersManagerCtl.getEditionLayer();
	}
	
	if(!this.editionLayer){
		this.editionLayer = new M.impl.EditionLayer(this);
	}
	return this.editionLayer;
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {Object} map 
 * @param {Object} html - html element template
 * @api stable
 */
M.control.Edition.prototype.addEvents = function (map, html) {
	this.on(M.evt.COMPLETED, function() {
		goog.dom.classlist.add(this.element_,
		"shown");
	}, this);
};

/**
 * This function adds features to sandbox layer
 *
 * @public
 * @function
 * @param {Array} geoJsonfeaturesArray 
 * @api stable
 */
M.control.Edition.prototype.addFeaturesToSandbox = function (geoJsonfeaturesArray) {
	this.editionLayer.addFeaturesToSandBox(geoJsonfeaturesArray);	
};

/**
 * This function deactivates all edition controls
 *
 * @public
 * @function
 * @api stable
 */
M.control.Edition.prototype.deactivateControls = function () {
	this.geomControl.restoreDefaultClassDropdownButtons();
	this.geomControl.clear();
};

/**
 * This function returns the control's template
 *
 * @public
 * @function
 * @api stable
 */
M.control.Edition.prototype.getTemplate = function () {
	return this.element_;
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
M.control.Edition.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.Edition) {
		equals = (this.name === obj.name);
	}
	return equals;
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.control.Edition.prototype.destroy = function () {
	this.getImpl().destroy();
};

/**
 * Template for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.Edition.TEMPLATE = 'edition.html';
if(M.config.devel){
	M.control.Edition.TEMPLATE = 'src/edition/templates/edition.html';
}	