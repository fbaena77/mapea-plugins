goog.provide('P.control.advLSAddWMSControl');

goog.require('P.impl.control.advLSAddWMSControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSAddWMSControl
 * control
 *
 * @constructor
 * @extends {M.control.advLSContextMenuControl}
 * @api stable
 */
M.control.advLSAddWMSControl = (function (base) {
	// checks if the implementation can create advLSAddWMSControl
	if (M.utils.isUndefined(M.impl.control.advLSAddWMSControl)) {
		M.exception('La implementación usada no puede crear controles advLSAddWMSControl');
	}
	/**
	 * Parent control composition
	 * @private
	 * @type {M.control.advLSContextMenuControl}
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
	 * @type {M.control.advLSPanelControl}
	 */
	this.panel_ = null;
	/**
	 * WMS div container
	 * @private
	 * @type {HTMLElement}
	 */
	this.wmsDivContainer_ = null;
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
	this.wmsLayersForm_ = null;
	/**
	 * WMS layers head table
	 * @private
	 * @type {HTMLElement}
	 */
	this.wmsLayersTableThead_ = null;
	/**
	 * WMS layers body table
	 * @private
	 * @type {HTMLElement}
	 */
	this.wmsLayersTableTbody_ = null;
	/**
	 * Implementation of this control
	 * @private
	 * @type {M.impl.control.advLSAddWMSControl}
	 */
	this.impl_ = new M.impl.control.advLSAddWMSControl();

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
M.control.advLSAddWMSControl.prototype.createView = function () {
	var this_ = this;
	this.panel_ = new M.control.advLSPanelControl();
	return Promise.resolve(this.panel_.createView()).then(function(){
		return new Promise(function (success) {
			M.template.compile(M.control.advLSAddWMSControl.TEMPLATE,{'jsonp': false}).then(function (html) {
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
M.control.advLSAddWMSControl.prototype.createPanelInfo = function (html) {
	this.panelInfo_ = html;
	var element = this.panel_.createDialog('open', {
		title: 'Añadir capa WMS',
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
M.control.advLSAddWMSControl.prototype.addEvents = function (html) {
	this.element_ = html;
	this.wmsDivContainer_ = this.element_.querySelector('#m-layerimportwms-container');

	this.loadingCapabilitiesDiv_ = this.element_.querySelector('#m-searching-capabilities');
	this.wmsLayersForm_ = this.element_.querySelector('#importwmsForm');
	this.wmsLayersTableThead_ = this.wmsLayersForm_.querySelector("table thead");
	var wmsLayersTableTheadCheckbox = this.wmsLayersTableThead_.querySelector("input[type=checkbox]");
	this.wmsLayersTableTbody_ = this.wmsLayersForm_.querySelector("table tbody");
	var predefwmsserverSelect_ = this.wmsDivContainer_.querySelector('#predefwmsserverForm');
	var newwmsserverSelect_ = this.wmsDivContainer_.querySelector('#newwmsserverForm button');
	var importwmsButton_ = this.element_.querySelector('#importwmsButton');

	goog.events.listen(predefwmsserverSelect_, goog.events.EventType.CHANGE, this.selectPredefWMSServer_, false, this);
	goog.events.listen(newwmsserverSelect_, goog.events.EventType.CLICK, this.selectNewWMSServer_, false, this);
	goog.events.listen(wmsLayersTableTheadCheckbox, goog.events.EventType.CLICK, this.toggleWmsCheckbox_, false, this);
	goog.events.listen(importwmsButton_, goog.events.EventType.CLICK, this.addWmsLayers_, false, this);
};

/**
 * This function closes the floating panel of this control
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSAddWMSControl.prototype.close = function () {
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
M.control.advLSAddWMSControl.prototype.addPredefinedServers = function (predefServersArray) {
	var predefWmsSelect = this.wmsDivContainer_.querySelector('#predefwmsserverForm select');
	for (var i = 0; i < predefServersArray.length; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", predefServersArray[i]['url']);
		var txtNode = document.createTextNode(predefServersArray[i]['name']);
		option.appendChild(txtNode);
		predefWmsSelect.appendChild(option);
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
M.control.advLSAddWMSControl.prototype.selectPredefWMSServer_ = function (evt) {
	this.cleanWMSCapabilities();
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
M.control.advLSAddWMSControl.prototype.selectNewWMSServer_ = function (evt) {
	var input = this.wmsDivContainer_.querySelector('#m-layerimportwms-newserver');
	var selectedUrl = input.value.trim();
	if (!M.utils.isUndefined(selectedUrl) && selectedUrl !== "") {
		this.cleanWMSCapabilities();
		var predefwmsserverSelect = document.querySelector('#predefwmsserverForm > label > select');
		predefwmsserverSelect.selectedIndex = 0;

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
M.control.advLSAddWMSControl.prototype.cleanWMSCapabilities = function () {
	this.currentWMSServer_ = null;
	this.currentWMSLayersArray_ = null;
	goog.dom.classlist.add(this.wmsLayersForm_, M.control.advLSAddWMSControl.HIDDEN_CLASS);
	goog.dom.classlist.add(this.wmsLayersForm_.nextSibling.nextSibling, M.control.advLSAddWMSControl.HIDDEN_CLASS);
	var headerCheckbox = this.wmsLayersTableThead_.querySelector("input[type=checkbox]");
	headerCheckbox.checked = false;
	var trNodes = this.wmsLayersTableTbody_.querySelectorAll("tr");
	for (var i = 0; i < trNodes.length; i++) {
		this.wmsLayersTableTbody_.removeChild(trNodes[i]);
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
M.control.advLSAddWMSControl.prototype.getCapabilitiesLayers_ = function (selectedUrl) {
	var this_ = this;
	goog.dom.classlist.remove(this.loadingCapabilitiesDiv_, M.control.advLSAddWMSControl.HIDDEN_CLASS);
	this.currentWMSServer_ = selectedUrl;
	var capabilitiesUrl = M.utils.getWMSGetCapabilitiesUrl(selectedUrl);
	if (!M.utils.isNullOrEmpty(capabilitiesUrl)) {
		M.remote.get(capabilitiesUrl).then(function (response) {
			this_.currentWMSLayersArray_ = this_.parseCapabilitiesLayers_(response.xml);
			if (this_.currentWMSLayersArray_ !== null) {
				if (this_.currentWMSLayersArray_.length > 0) {
					this_.renderWMSLayersTable(this_.currentWMSLayersArray_);
				} else {
					M.dialog.info("No se encontraron capas disponibles en el servicio: " + selectedUrl);
				}
			} else {
				M.dialog.error("No se pudieron obtener las capas del servicio: " + selectedUrl);
			}
			goog.dom.classlist.add(this_.loadingCapabilitiesDiv_, M.control.advLSAddWMSControl.HIDDEN_CLASS);
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
M.control.advLSAddWMSControl.prototype.parseCapabilitiesLayers_ = function (xml) {
	try {
		var getCapabilitiesParser = new M.impl.format.WMSCapabilities();
		var getCapabilitiesResponse = getCapabilitiesParser.read(xml);
		return getCapabilitiesResponse.Capability.Layer.Layer;
	} catch (err) {
		return null;
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
M.control.advLSAddWMSControl.prototype.renderWMSLayersTable = function (layersArray) {
	for (var i = 0; i < layersArray.length; i++) {
		var trElement = document.createElement("tr");
		if (i % 2 !== 0)
			trElement.setAttribute("class", "odd");
		var tdCheck = document.createElement("td");
		var checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		goog.events.listen(checkbox, goog.events.EventType.CLICK, this.toggleWmsCheckbox_, false, this);
		tdCheck.appendChild(checkbox);
		var tdLayer = document.createElement("td");
		tdLayer.setAttribute("title", layersArray[i].Abstract);
		var txtNode = document.createTextNode(layersArray[i].Title);
		tdLayer.appendChild(txtNode);
		trElement.appendChild(tdCheck);
		trElement.appendChild(tdLayer);
		this.wmsLayersTableTbody_.appendChild(trElement);
	}
	goog.dom.classlist.remove(this.wmsLayersForm_, M.control.advLSAddWMSControl.HIDDEN_CLASS);
	goog.dom.classlist.remove(this.wmsLayersForm_.nextSibling.nextSibling, M.control.advLSAddWMSControl.HIDDEN_CLASS);
};

/**
 * Toggle single checkbox in wms layers table
 *
 * @public
 * @function
 * @param {object} evt - Click event
 * @api stable
 */
M.control.advLSAddWMSControl.prototype.toggleWmsCheckbox_ = function (evt) {
	var checkboxesArray = this.wmsLayersTableTbody_.querySelectorAll("input[type=checkbox]");
	if (evt.target.parentNode.nodeName.toLowerCase() == "th") {
		for (let i = 0; i < checkboxesArray.length; i++) {
			checkboxesArray[i].checked = evt.target.checked;
		}
	} else {
		var headerCheckbox = this.wmsLayersTableThead_.querySelector("input[type=checkbox]");
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
M.control.advLSAddWMSControl.prototype.addWmsLayers_ = function (evt) {
    var loadedWmsLayers = this.base_.map_.getWMS();
    var alreadyLoaded = [];
    var someChecked = false;
    var trs = this.wmsLayersTableTbody_.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        if (trs[i].querySelector("td > input[type=checkbox]").checked) {
            someChecked = true;
            var alreadyLoadedCurrent = false;
            for (let j = 0; j < loadedWmsLayers.length; j++) {
                var loadedWmsLayerName = loadedWmsLayers[j].name;
                if (loadedWmsLayerName == this.currentWMSLayersArray_[i].Name) {
                    alreadyLoadedCurrent = true;
                    alreadyLoaded.push(this.currentWMSLayersArray_[i].Name);
                    break;
                }
            }
            if (!alreadyLoadedCurrent) {
            	this.base_.addWMSLayer(this.currentWMSServer_, this.currentWMSLayersArray_[i]);
            	M.dialog.info("Las capas se han añadido al catálogo correctamente");
            }
        }
    }

    if (alreadyLoaded.length > 0) {
        var notLoadedInfo = "Las siguientes capas ya están cargadas en el catálogo: ";
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
M.control.advLSAddWMSControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.advLSAddWMSControl) {
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
M.control.advLSAddWMSControl.NAME = 'advLSAddWMSControl';

/**
 * Hidden class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSAddWMSControl.HIDDEN_CLASS = 'hidden';

/**
 * Inactive class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSAddWMSControl.INACTIVE_CLASS = 'inactive';
/**
 * Inactive class name
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSAddWMSControl.TEMPLATE = 'advLSAddWMS.html';
if(M.config.devel){
	M.control.advLSAddWMSControl.TEMPLATE = 'src/advLS/templates/advLSAddWMS.html';	
}

