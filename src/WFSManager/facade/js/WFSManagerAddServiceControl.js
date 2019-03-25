goog.provide('P.control.WFSManagerAddServiceControl');

goog.require('P.impl.control.WFSManagerAddServiceControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/*jshint undef:false */

/**
 * @classdesc
 * Main constructor of the class. Creates a WFSManagerAddServiceControl
 * control
 *
 * @constructor
 * @extends {M.control.WFSManagerContextMenuControl}
 * @api stable
 */
M.control.WFSManagerAddServiceControl = (function (base) {
	// checks if the implementation can create WFSManagerAddServiceControl
	if (M.utils.isUndefined(M.impl.control.WFSManagerAddServiceControl)) {
		M.exception('La implementación usada no puede crear controles WFSManagerAddServiceControl');
	}
	/**
	 * Parent control composition
	 * @private
	 * @type {M.control.WFSManagerContextMenuControl}
	 */
	this.base_ = base;
	/**
	 * HTML template of this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.element_ = null;
	/**
	 * Floating panel for this control
	 * @private
	 * @type {M.control.WFSManagerPanelControl}
	 */
	this.panel_ = null;
	/**
	 * WMS div container
	 * @private
	 * @type {HTMLElement}
	 */
	this.wfsDivContainer_ = null;
	/**
	 * Layers's server div container
	 * @private
	 * @type {HTMLElement}
	 */
	this.loadingCapabilitiesDiv_ = null;
	/**
	 * WMS layers form
	 * @private
	 * @type {HTMLElement}
	 */
	this.wfsLayersForm_ = null;
	/**
	 * WMS layers head table
	 * @private
	 * @type {HTMLElement}
	 */
	this.wfsLayersTableThead_ = null;
	/**
	 * WMS layers body table
	 * @private
	 * @type {HTMLElement}
	 */
	this.wfsLayersTableTbody_ = null;
	/**
	 * WMS layers body table
	 * @private
	 * @type {HTMLElement}
	 */
	this.currentWFSServer_ = null;
	/**
	 * WMS layers body table
	 * @private
	 * @type {HTMLElement}
	 */
	this.currentWFSLayersArray_ = null;
	/**
	 * WMS layers body table
	 * @private
	 * @type {HTMLElement}
	 */
	this.currentWFSVersion_ = null;
	/**
	 * Implementation of this control
	 * @private
	 * @type {M.impl.control.WFSManagerAddServiceControl}
	 */
	this.impl_ = new M.impl.control.WFSManagerAddServiceControl();

	this.createView();
});

/**
 * This function compiles the template and calls the floatingpanel's creation function
 *
 * @public
 * @function
 * @returns {Promise}
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.createView = function () {
	var this_ = this;
	this.panel_ = new M.control.WFSManagerPanelControl();
	return Promise.resolve(this.panel_.createView()).then(function(){
		return new Promise(function (success) {
			M.template.compile(M.control.WFSManagerAddServiceControl.TEMPLATE,{'jsonp': false}).then(function (html) {
				this_.createPanelInfo(html);
				this_.addPredefinedServers(this_.base_.predefServersArray_);
				success(html);
			});
		});
	});
};

/**
 * This function assign the template of panel's info and open the panel
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template of this control
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.createPanelInfo = function (html) {
	this.panelInfo_ = html;
	var element = this.panel_.createDialog('open', {
		title: 'Añadir servicio WFS',
		content: this.panelInfo_.outerHTML,
		width: 440,
		height: 164
	});
	this.addEvents(element);
};

/**
 * This function adds the events for this control's template
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template of this control
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.wfsDivContainer_ = this.element_.querySelector('#m-layerimportService-container');

	this.loadingCapabilitiesDiv_ = this.element_.querySelector('#m-searching-capabilities');
	this.wfsLayersForm_ = this.element_.querySelector('#importServiceForm');
	this.wfsLayersTableThead_ = this.wfsLayersForm_.querySelector("table thead");
	var wfsLayersTableTheadCheckbox = this.wfsLayersTableThead_.querySelector("input[type=checkbox]");
	this.wfsLayersTableTbody_ = this.wfsLayersForm_.querySelector("table tbody");
	var predefwfsserverSelect_ = this.wfsDivContainer_.querySelector('#predefServiceserverForm');
	var newwfsserverSelect_ = this.wfsDivContainer_.querySelector('#newServiceserverForm button');
	var importwfsButton_ = this.element_.querySelector('#importServiceButton');

	goog.events.listen(predefwfsserverSelect_, goog.events.EventType.CHANGE, this.selectPredefWFSServer_, false, this);
	goog.events.listen(newwfsserverSelect_, goog.events.EventType.CLICK, this.selectNewWFSServer_, false, this);
	goog.events.listen(wfsLayersTableTheadCheckbox, goog.events.EventType.CLICK, this.toggleWFSCheckbox_, false, this);
	goog.events.listen(importwfsButton_, goog.events.EventType.CLICK, this.addWFSService, false, this);
};

/**
 * This function closes the floating panel of this control
 *
 * @public
 * @function
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.close = function () {
	this.panel_.closePanel();
};

/**
 * Adds the predefined servers to select control
 *
 * @public
 * @function
 * @param {Array} predefServersArray - Predefined servers
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.addPredefinedServers = function (predefServersArray) {
	var predefWfsSelect = this.wfsDivContainer_.querySelector('#predefServiceserverForm select');
	for (var i = 0; i < predefServersArray.length; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", predefServersArray[i]['url']);
		var txtNode = document.createTextNode(predefServersArray[i]['name']);
		option.appendChild(txtNode);
		predefWfsSelect.appendChild(option);
	}
};

/**
 * Selects one predefined server event
 *
 * @public
 * @function
 * @param {object} evt - Change event
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.selectPredefWFSServer_ = function (evt) {
	this.cleanWFSCapabilities();
	var select = evt.target;
	var selectedUrl = select.options[evt.target.options.selectedIndex].value;
	if (!M.utils.isUndefined(selectedUrl) && selectedUrl !== "") {
		this.getCapabilitiesLayers_(selectedUrl);
	}
};

/**
 * Gets the input server
 *
 * @public
 * @function
 * @param {object} evt - Change event
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.selectNewWFSServer_ = function (evt) {
	var input = this.wfsDivContainer_.querySelector('#m-layerimportService-newserver');
	var selectedUrl = input.value.trim();
	if (!M.utils.isUndefined(selectedUrl) && selectedUrl !== "") {
		this.cleanWFSCapabilities();
		var predefwfsserverSelect = document.querySelector('#predefServiceserverForm > label > select');
		predefwfsserverSelect.selectedIndex = 0;

		var regex = new RegExp("https?://[^\s]+\\.[^\s]+");
		if (selectedUrl.match(regex)) { // this test is needed because Safari doesn't implement <input url="">
			this.getCapabilitiesLayers_(selectedUrl);
		} else {
			M.dialog.info("Introduzca una URL válida");
		}
	} else {
		M.dialog.info("Introduzca una URL válida");
	}
};

/**
 * Remove list of previously added WMS layers
 *
 * @public
 * @function
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.cleanWFSCapabilities = function () {
	goog.dom.classlist.add(this.wfsLayersForm_, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
	goog.dom.classlist.add(this.wfsLayersForm_.nextSibling.nextSibling, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
	var headerCheckbox = this.wfsLayersTableThead_.querySelector("input[type=checkbox]");
	headerCheckbox.checked = false;
	var trNodes = this.wfsLayersTableTbody_.querySelectorAll("tr");
	for (var i = 0; i < trNodes.length; i++) {
		this.wfsLayersTableTbody_.removeChild(trNodes[i]);
	}
};

/**
 * Obtain layers from capabilities
 *
 * @public
 * @function
 * @param {string} selectedUrl - WMS server url
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.getCapabilitiesLayers_ = function (selectedUrl) {
	var this_ = this;
	goog.dom.classlist.remove(this.loadingCapabilitiesDiv_, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
	this.currentWFSServer_ = selectedUrl;
	var capabilitiesUrl = M.utils.getWMSGetCapabilitiesUrl(selectedUrl);
	capabilitiesUrl = capabilitiesUrl.replace("service=WMS", "service=WFS");
	if (!M.utils.isNullOrEmpty(capabilitiesUrl)) {
		M.remote.get(capabilitiesUrl).then(function (response) {
			this_.currentWFSLayersArray_ = this_.parseCapabilitiesLayers_(response.text);
			if (this_.currentWFSLayersArray_ !== null) {
				if (this_.currentWFSLayersArray_.length > 0) {
					this_.renderWFSLayersTable(this_.currentWFSLayersArray_);
				} else {
					M.dialog.info("No se encontraron capas disponibles en el servicio: " + selectedUrl);
				}
			} else {
				M.dialog.error("No se pudieron obtener las capas del servicio: " + selectedUrl);
			}
			goog.dom.classlist.add(this_.loadingCapabilitiesDiv_, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
		});
	} else {
		M.dialog.error("No se pudieron obtener las capas del servicio: " + selectedUrl);
	}
};


/**
 * This function obtains layers from getCapabilities response
 *
 * @public
 * @function
 * @param {object} xml - xml capabilities response
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.parseCapabilitiesLayers_ = function (xml) {
	try {
		var mappings_wfs_2_0_0 = [XLink_1_0, OWS_1_1_0, Filter_2_0, WFS_2_0];
		var context_wfs_2_0_0 =  new Jsonix.Context(mappings_wfs_2_0_0);
		var unmarshaller_wfs_2_0_0 = context_wfs_2_0_0.createUnmarshaller();
		var result = unmarshaller_wfs_2_0_0.unmarshalString(xml);
		this.currentWFSVersion_ = '2.0.0';
		return result.value.featureTypeList.featureType;

	} catch (err) {
		try {
			//WFS versión 1.1.0
			var context_wfs_1_1_0 =  new Jsonix.Context([XLink_1_0, OWS_1_0_0, Filter_1_1_0, GML_3_1_1, SMIL_2_0, SMIL_2_0_Language, WFS_1_1_0]);
			var unmarshaller_wfs_1_1_0 = context_wfs_1_1_0.createUnmarshaller();
			var result = unmarshaller_wfs_1_1_0.unmarshalString(xml);
			this.currentWFSVersion_ = '1.0.0';
			return result.value.featureTypeList.featureType;
			
		} catch (e) {
			return null;
		}
	}
};

/**
 * Get layers available to import
 *
 * @public
 * @function
 * @param {Array} layersArray - Array of wms layers
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.renderWFSLayersTable = function (layersArray) {
	for (var i = 0; i < layersArray.length; i++) {
		var trElement = document.createElement("tr");
		if (i % 2 !== 0)
			trElement.setAttribute("class", "odd");
		var tdCheck = document.createElement("td");
		var checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		goog.events.listen(checkbox, goog.events.EventType.CLICK, this.toggleWFSCheckbox_, false, this);
		tdCheck.appendChild(checkbox);
		var tdLayer = document.createElement("td");
		var title;
		if(layersArray[i].title instanceof Array){
			title = layersArray[i].title[0].value;
		}
		else{
			title = layersArray[i].title;
		}
		tdLayer.setAttribute("title", title);
		var txtNode = document.createTextNode(title);
		tdLayer.appendChild(txtNode);
		trElement.appendChild(tdCheck);
		trElement.appendChild(tdLayer);
		this.wfsLayersTableTbody_.appendChild(trElement);
	}
	goog.dom.classlist.remove(this.wfsLayersForm_, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
	goog.dom.classlist.remove(this.wfsLayersForm_.nextSibling.nextSibling, M.control.WFSManagerAddServiceControl.HIDDEN_CLASS);
};

/**
 * Toggle single checkbox in wms layers table
 *
 * @public
 * @function
 * @param {object} evt - Click event
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.toggleWFSCheckbox_ = function (evt) {
	var checkboxesArray = this.wfsLayersTableTbody_.querySelectorAll("input[type=checkbox]");
	if (evt.target.parentNode.nodeName.toLowerCase() == "th") {
		for (let i = 0; i < checkboxesArray.length; i++) {
			checkboxesArray[i].checked = evt.target.checked;
		}
	} else {
		var headerCheckbox = this.wfsLayersTableThead_.querySelector("input[type=checkbox]");
		if (evt.target.checked) {
			var allChecked = true;
			for (let i = 0; i < checkboxesArray.length; i++) {
				if (!checkboxesArray[i].checked) {
					allChecked = false;
					break;
				}
			}
			headerCheckbox.checked = allChecked;
		} else {
			headerCheckbox.checked = false;
		}
	}
};

/**
 * Add WMS layer
 *
 * @public
 * @function
 * @param {object} evt - Click event
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.addWFSService = function (evt) {
	var this_ = this;
	var loadedWFSServices= this.base_.getAllServices();
	var alreadyLoaded = [];
	var someChecked = false;

	function getDescribeFeature (i){
		var describeFeatureTypeRequest = new M.impl.format.DescribeFeatureType(this_.currentWFSLayersArray_[i].name.localPart, "text/xml; subtype=gml/3.1.1", this_.base_.map_.getProjection());
		var url = this_.getDescribeFeatureUrl(this_.currentWFSServer_, describeFeatureTypeRequest);
		M.remote.get(url)
		.then(function(response) {
			if(this_.currentWFSVersion_==='1.0.0'){
				var mappings = [XLink_1_0, XSD_1_0, OWS_1_1_0, Filter_2_0, GML_3_2_1, WFS_2_0];
				var cntx = new Jsonix.Context(mappings);
				var unmarshaller_wfs_2_0_0 = cntx.createUnmarshaller();
				var result = unmarshaller_wfs_2_0_0.unmarshalString(response.text);
			}
			else{
				var result = describeFeatureTypeRequest.read(response);	
			}
			result.Name = this_.currentWFSLayersArray_[i].name.localPart;
			var title;
			if(this_.currentWFSLayersArray_[i].title instanceof Array){
				title = this_.currentWFSLayersArray_[i].title[0].value;
			}
			else{
				title = this_.currentWFSLayersArray_[i].title;
			}
			result.Title = title;
			result.SRS = this_.currentWFSLayersArray_[i].defaultCRS !== undefined ? this_.currentWFSLayersArray_[i].defaultCRS : this_.currentWFSLayersArray_[i].defaultSRS;
			this_.base_.addWFSService(this_.currentWFSServer_, result);
			if (alreadyLoaded.length === 0) {
				M.dialog.info("Los servicios se han cargado correctamente en el catálogo");
			}
		}).catch(function(reason) {
			M.dialog.error("No se ha podido obtener la descripción de la capa");
		});
	}

	var trs = this.wfsLayersTableTbody_.querySelectorAll("tr");
	for (let i = 0; i < trs.length; i++) {
		if (trs[i].querySelector("td > input[type=checkbox]").checked) {
			someChecked = true;
			var alreadyLoadedCurrent = false;
			for (let j = 0; j < loadedWFSServices.length; j++) {
				var loadedWFSLayerName = loadedWFSServices[j].id;
				if (loadedWFSLayerName == this.currentWFSLayersArray_[i].name.localPart) {
					alreadyLoadedCurrent = true;
					alreadyLoaded.push(this.currentWFSLayersArray_[i].name.localPart);
					break;
				}
			}
			if (!alreadyLoadedCurrent) {
				getDescribeFeature (i);
			}
		}
	}

	if (alreadyLoaded.length > 0) {
		var notLoadedInfo = "Los siguientes servicios ya están cargadas en el catálogo: ";
		for (let i = 0; i < alreadyLoaded.length; i++) {
			if (alreadyLoaded.length - 1 > i) {
				notLoadedInfo += alreadyLoaded[i] + ", ";
			} else {
				notLoadedInfo += alreadyLoaded[i] + ".";
			}
		}
		M.dialog.info(notLoadedInfo);
	}

	if (!someChecked) {
		M.dialog.info("Seleccione al menos una capa");
	}
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {object} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.getDescribeFeatureUrl = function (url, describeFeatureTypeRequest) {
	var objRequest = describeFeatureTypeRequest.fA.options;
	return url+"?service=WFS&request=DescribeFeatureType&version="+this.currentWFSVersion_+"&"+this.obj2UrlParams(objRequest);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {object} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.obj2UrlParams = function (obj) {
	var str = "";
	for (var key in obj) {
		if (str != "") {
			str += "&";
		}
		str += key + "=" + encodeURIComponent(obj[key]);
	}

	return str;
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {object} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.WFSManagerAddServiceControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.WFSManagerAddServiceControl) {
		equals = (this.name === obj.name);
	}
	return equals;
};

/**
 * Name for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerAddServiceControl.NAME = 'WFSManagerAddServiceControl';

/**
 * Hidden class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerAddServiceControl.HIDDEN_CLASS = 'hidden';

/**
 * Inactive class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerAddServiceControl.INACTIVE_CLASS = 'inactive';
/**
 * Inactive class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerAddServiceControl.TEMPLATE = 'WFSManagerAddService.html';
if(M.config.devel){
	M.control.WFSManagerAddServiceControl.TEMPLATE = 'src/WFSManager/templates/WFSManagerAddService.html';	
}

