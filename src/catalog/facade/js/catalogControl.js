goog.provide('P.control.CatalogControl');

goog.require('P.impl.control.CatalogControl');
goog.require('P.control.CatalogSplitter');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a CatalogControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.CatalogControl = (function(controls, config, width, wfsVisible) {
	// checks if the implementation can create layerimportControl
	if (M.utils.isUndefined(M.impl.control.CatalogControl)) {
		M.exception('La implementación usada no puede crear controles CatalogControl');
	}
	this.controls_ = controls;
	this.config_ = config;
	this.width_ = width;
	this.wfsVisible_ = wfsVisible;
	this.splitter = new M.control.CatalogSplitter();
	// implementation of this control
	this.impl_ = new M.impl.control.CatalogControl();
	// calls super constructor (scope, implementation, controlName)
	goog.base(this, this.impl_, M.control.CatalogControl.NAME);
});
goog.inherits(M.control.CatalogControl, M.Control);

/**
 * This function creates the view to the specified map
 *
 * @public
 * @function
 * @param {map} Map where the control is added
 * @returns {Promise} HTML template
 * @api stable
 */
M.control.CatalogControl.prototype.createView = function(map) {
	var this_ = this;
	var wfsDisplay = this.wfsVisible_ ? "block" : "none"; 
	return new Promise(function (success) {
		M.template.compile(M.control.CatalogControl.TEMPLATE, {
			'jsonp': false,
			'vars': {
				'wfsDisplay': wfsDisplay
			}
		}).then(function (html) {
			html.style.width = this_.width_;
			var tabs = html.querySelectorAll('.catalog-tab');
			tabs.forEach(function(tab){
				tab.style.backgroundColor = this_.config_.color;
			});
			this_.splitter.setSplit(html.querySelector('#splitterMap'),{splitterSize:'6',startPosition:20});
			this_.addEvents(map, html, this_.controls_);
			success(html);
		});
	});
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogControl.prototype.addEvents = function(map, html, controls) {
	var this_ = this;
	this.element_ = html;
	this.on(M.evt.COMPLETED, function() {
		goog.dom.classlist.add(this.element_,
		"shown");
	}, this);

	var templates = [];
	var contFull = 0;
	for (let i = 0; i< controls.length; i++) {
		Promise.resolve(controls[i].createView(map)).then(function(template){
			controls[0].getImpl().addTo(map, template);
			templates.push(template);
			if (controls.length === ++contFull) {
				this_.addTemplates(templates);
			}
		});
	}
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
M.control.CatalogControl.prototype.addTemplates = function (templates) {
	var this_ = this;
	templates.sort(this.compareTorder);
	templates.forEach(function(template){
		if(template.id==='map-tree'){
			var advLSPanel = this_.element_.querySelector('.advLS-panel');
			advLSPanel.appendChild(template);
		}
		else{
			var WFSManagerPanel = this_.element_.querySelector('.wfs-panel');
			WFSManagerPanel.appendChild(template);
		}
	});
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
M.control.CatalogControl.prototype.compareTorder = function (a,b) {
	if (Number(a.attributes.toc_order.nodeValue) < Number(b.attributes.toc_order.nodeValue))
		return -1;
	if (Number(a.attributes.toc_order.nodeValue) > Number(b.attributes.toc_order.nodeValue))
		return 1;
	return 0;
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
M.control.CatalogControl.prototype.equals = function(obj) {
	var equals = false;
	if (obj instanceof M.control.CatalogControl) {
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
M.control.CatalogControl.prototype.destroy = function() {
	this.getImpl().destroy();
};

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.CatalogControl.NAME = 'catalogControl';

/**
 * Template for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.CatalogControl.TEMPLATE = 'catalogControl.html';
if(M.config.devel){
	M.control.CatalogControl.TEMPLATE = 'src/catalog/templates/catalogControl.html';
}