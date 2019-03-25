goog.provide('P.control.WFSManagerControl');

goog.require('P.impl.control.WFSManagerControl');
goog.require('P.control.WFSManagerContextMenuControl');
goog.require('P.control.WFSManagerFactoryControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a WFSManagerControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.WFSManagerControl = (function (params) {
	if (M.utils.isUndefined(M.impl.control.WFSManagerControl)) {
		M.exception('La implementación usada no puede crear controles WFSManagerControl');
	}
	/**
	 * JSON layers configuration resource
	 * @private
	 * @type {object}
	 */
	this.servicesJson = params.services;
	/**
	 * Predefined WMS server array
	 * @private
	 * @type {Array}
	 */
	this.predefServersArray_ = params.wfsServers;
	/**
	 * Swagger client connector for remote data access
	 * @private
	 * @type {object}
	 */
	this.cqlFilter_ = params.cqlFilter;
	/**
	 * HTML template for this control
	 * @private
	 * @type {HTMLElement}
	 */
	this.html_ = null;
	/**
	 * Tab order in TOC
	 * @private
	 * @type {number}
	 */
	this.order_ = 1;
	/**
	 * Map tree element
	 * @private
	 * @type {HTMLElement}
	 */
	this.mapTree_ = null;
	/**
	 * UUID geoperfil from layers config json file
	 * @public
	 * @type {string}
	 */
	this.services_ = [];
	/**
	 * UUID geoperfil from layers config json file
	 * @public
	 * @type {string}
	 */
	this.idServiceActive_ = null;
	/**
	 * advLS DAO control for remote data access
	 * @private
	 * @type {M.control.advLSDAO}
	 */
	this.color_ = params.color;
	/**
	 * Context menu control
	 * @private
	 * @type {M.control.WFSManagerContextMenuControl}
	 */
	this.contextMenu_ = null;

	this.impl_ = new M.impl.control.WFSManagerControl();

	goog.base(this, this.impl_, 'WFSManagerControl');
});
goog.inherits(M.control.WFSManagerControl, M.Control);

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.WFSManagerControl.prototype.createView = function (map) {
	this.map_ = map;
	var this_ = this;

	return new Promise(function (success) {
		M.template.compile(M.control.WFSManagerControl.TEMPLATE,{'jsonp': false}).
		then(function (html) {
			this_.html_ = html;
			this_.deserializeJson(html, this_.servicesJson);
			success(html);
		});
	});
};

/**
 * This function deserializes the JSON layers configuration resource
 *
 * @private
 * @function
 * @param {HTMLElement} html - HTML template for this control
 * @param {object} configJson - JSON layers configuration resource
 * @api stable
 */
M.control.WFSManagerControl.prototype.deserializeJson = function (html, servicesJson) {
	var this_ = this;
	this.contextMenu_ = new M.control.WFSManagerContextMenuControl(this);
	var initControlFromJson = function (data) {
		this_.uuidgeoperfil_ = data.uuidgeoperfil;
		this_.mapTree_ = this_.initMapTree(data);
		if (!M.utils.isNullOrEmpty(this_.mapTree_)) {
			html.appendChild(this_.mapTree_);
			this_.registerEvents(this_.html_);
			this_.contextMenu_.createView();
			M.catalogSpinner.close();
		}
	};

	var json;
	try {
		if(servicesJson.uuidgeoperfil!==undefined){
			json = servicesJson;
		}
		else{
			json = JSON.parse(servicesJson.toString());	
		}
		initControlFromJson(json);
	} 
	catch (e) {
		var options = {
				jsonp: false
		};
		if(json===undefined){
			M.remote.get(servicesJson, null, options).then(function (response) {
				var data = JSON.parse(response.text);
				initControlFromJson(data);
			}).catch(function(e) {
				M.catalogSpinner.close();
				M.dialog.error("Configuración de servicios no válida");
				this_.deserializeJson(this_.html_, this_.servicesJson);
			});
		}
		else{
			M.catalogSpinner.close();
			M.dialog.error("Configuración de servicios no válida");
			this_.deserializeJson(this_.html_, this_.servicesJson);
		}
	}
};

/**
 * This function initializes the map tree element
 *
 * @private
 * @function
 * @param {HTMLElement} data - Layers nodes
 * @api stable
 */
M.control.WFSManagerControl.prototype.initMapTree = function (data) {
	const mapTree = this.createNode(data, !data.active);
	mapTree.querySelector("div.map-child").appendChild(mapTree.querySelector("div[dt-type='folder']"));
	return mapTree;
};

/**
 * This function creates the nodes for map tree
 *
 * @private
 * @function
 * @param {HTMLElement} node - Layer or folder node from json config
 * @param {boolean} uncheckedAncestor - Evaluates if ancestor is checked
 * @returns {HTMLElement} 
 * @api stable
 */
M.control.WFSManagerControl.prototype.createNode = function (node, uncheckedAncestor) {
	var displayCheck = "block";
	var nodeClass = "";
	var treeCheck = "";
	var typeNode = "service";
	var labelNode = node.label;
	var spanNode = "";
	var colorStyle = "";
	var rootStyle = "";
	
	if (node.type === "folder") {
		nodeClass += "map-node-group";
		typeNode = "folder";
		displayCheck = "none";
	}
	else{
		this.services_.push(node);
		labelNode = node.description;
		treeCheck = '<div class="tree-check">' +
		'               	<input name="wfsServices" id= "radioId_' + node.id + '" type="radio"/>' +
		'           	</div>';
		
		spanNode = '<span class="styleLayerType">WFS </span>';
	}
	if (node.id === "root") {
		rootStyle = ' style="margin-left:8px; margin-top:4px"';
		nodeClass = nodeClass.replace("group","root");
		colorStyle = 'background-color: '+this.color_+' !important; ';
	}
	var readOnly = true;
	if (node.readOnly!==undefined && node.readOnly===false) {
		readOnly = false;
	}
	var collapsePoint = "collapsed";
	if (node.isOpenOnStartUp) {
		collapsePoint = "expanded";
	}

	var childrenTemp = "";
	if (node.children) {
		for (var i = 0; i < node.children.length; i++) {
			childrenTemp += this.createNode(node.children[i], uncheckedAncestor).outerHTML;
		}
	}

	var tempIcon = '<div class="tree-icon"><i class="map-node-expand fa fa-chevron-right"></i></div>';
	if (!node.children || node.children.length < 0 || node.type === "service" || node.id === "root") {
		tempIcon = '';
	}

	var propLegend =  '<div class="prop-legend" style="display: none;"></div>';
	
	var nodeTemp = '' +
	'   <div style="display:block;'+ colorStyle +'" class="props ' + nodeClass + '" title="">' +
	'       <div class="props-up">' + tempIcon + treeCheck +
	'           <div class="prop-info-wfs" draggable="' + (node.id !== "root") +'"'+ rootStyle + '>' +
	'               <label title="' + labelNode + '">' + spanNode + labelNode + '</label>' +
	'           </div>' +
	'       </div>' +
	'       <div class="props-down">' + propLegend + '</div>' +
	'   </div>' +
	'   <div class="map-child">' +
	'       ' + childrenTemp +
	'   </div>';
	var mapNode = document.createElement('div');
	mapNode.className = 'map-node ' + collapsePoint;
	mapNode.setAttribute('onselectstart', 'return false');
	mapNode.setAttribute('onmousedown', 'return true');
	mapNode.setAttribute('dt-id', node.id);
	mapNode.setAttribute('dt-data', collapsePoint);
	mapNode.setAttribute('dt-type', typeNode);
	mapNode.setAttribute('dt-readonly', readOnly);

	mapNode.innerHTML = nodeTemp;

	return mapNode;
};

/**
 * This function registers events on map and layers to render
 * the WFSManagerControl
 *
 * @private
 * @function
 * @param {HTMLElement} html - Template for this control
 * @api stable
 */
M.control.WFSManagerControl.prototype.registerEvents = function (html, isReloaded) {
	var this_ = this;

	this.dragSourceNode = null;
	this.dragTargetNode = null;
	this.dom = html;
	this.on(M.evt.COMPLETED, function () {
		goog.dom.classlist.add(this.dom, "shown");
	}, this);

	var expandNode = function(evt){
		evt.preventDefault();
		var parentDom = this_.closest(evt.target, 'map-node');
		if(parentDom.getAttribute("dt-id")!=="root"){
			var classData = parentDom.getAttribute("dt-data");
			if (classData === 'expanded') {
				this_.collapseNode(parentDom);
			} else if (classData === 'collapsed') {
				this_.expandNode(parentDom);
			}	
		}
	};

	//TREE LISTENERS
	/** Expand/collapse nodes listener **/
	var nodes = this.dom.querySelectorAll('.map-node-expand');
	for (let i = 0; i < nodes.length; i++) {
		if(!goog.events.hasListener(nodes[i], goog.events.EventType.CLICK)){
			goog.events.listen(nodes[i], goog.events.EventType.CLICK, expandNode);
		}
	}

	var folders = this.dom.querySelectorAll("div[dt-type='folder']");
	for (let i = 0; i < folders.length; i++) {
		if(!goog.events.hasListener(folders[i].querySelector(".prop-info-wfs"), goog.events.EventType.CLICK)){
			goog.events.listen(folders[i].querySelector(".prop-info-wfs"), goog.events.EventType.CLICK, expandNode);
		}
	}

	/** Radio checked listeners **/
	var radioButtons = this.dom.querySelectorAll("input[type='radio']");
	if(!isReloaded){
		this.setDefaultServiceActive();	
	}
	for(var i = 0; i<radioButtons.length; i++) {
		radioButtons[i].onclick = function() {
			this_.setDefaultServiceActive(this);
			M.dialog.success("El servicio activo para la importación de geometrías es "+this.offsetParent.innerText,"Servicios");
	    };
	}

	//IMPLEMENTATION LISTENERS
	/** Change service / folder order listener **/
	var dragStartHandler_ = function (evt) {
		if (this_.dragSourceNode !== null) {
			return false;
		}
		this_.dragSourceNode = this_.closest(this, "map-node"); // Here, 'this' refers to the html node being dragged
		evt.event_.dataTransfer.effectAllowed = 'move';
		evt.event_.dataTransfer.setData('text/html', ''); // Hack to make drag and drop work on Firefox

	};
	var dragOverHandler_ = function (evt) {
		// Give visual feedback to user
		let overNode = this;
		if (this.classList && this.classList.contains("props") && this.classList.contains("map-node-group") &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			overNode = this.parentNode;
		}
		if (M.utils.isNullOrEmpty(this_.dragSourceNode)) {
			return;
		}
		overNode.classList.add("currentDragTarget");
		if (evt.preventDefault) {
			evt.preventDefault(); // Necessary. Allows us to drop
		}
		evt.event_.dataTransfer.dropEffect = 'move';
		return false;
	};
	var dragLeaveHandler_ = function (evt) {
		// Give visual feedback to user
		let overNode = this;
		if (this.classList && this.classList.contains("props") && this.classList.contains("map-node-group") &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			overNode = this.parentNode;
		}
		if (M.utils.isNullOrEmpty(this_.dragSourceNode)) {
			return;
		}
		overNode.classList.remove("currentDragTarget");
	};
	var dragEndHandler_ = function (evt) {
		this_.dragSourceNode = null;
		this_.dragTargetNode = null;
	};
	var dropHandler_ = function (evt) {
		if (M.utils.isNullOrEmpty(this_.dragSourceNode)) {
			return;
		}
		let dropCompleted = false;
		// Here, 'this' refers to the target html node
		if (this.getAttribute("dt-type") == "service") {
			this.classList.remove("currentDragTarget");
			this_.dragTargetNode = this;
		} else if (this.classList && this.classList.contains("props") && (this.classList.contains("map-node-group") || this.classList.contains("map-node-root")) &&
				this.parentNode.getAttribute("dt-type") == "folder") {
			this.parentNode.classList.remove("currentDragTarget");
			this_.dragTargetNode = this.parentNode;
		} else {
			dragEndHandler_();
		}
		if (evt.stopPropagation) {
			evt.stopPropagation(); // Stops the browser from redirecting
		}
		if (this_.dragSourceNode !== null && this_.dragTargetNode !== null &&
				this_.dragSourceNode != this_.dragTargetNode) {
			if (this_.dragTargetNode.getAttribute("dt-type") == "service" ||
					(this_.dragTargetNode.getAttribute("dt-type") == "folder" && this_.dragTargetNode.classList.contains("collapsed"))) {
				// Drop onto layer or collapsed folder: append the source node to target node
				try {
					this_.dragTargetNode.parentNode.insertBefore(this_.dragSourceNode, this_.dragTargetNode);
					dropCompleted = true;
				} catch (err) {
					dragEndHandler_();
				}
			} else if (this_.dragTargetNode.getAttribute("dt-type") == "folder") {
				// Drop onto expanded folder: append the source node to target's last children node
				var targetMapChild = null;
				for (let i = 0; i < this_.dragTargetNode.childNodes.length; i++) {
					if (this_.dragTargetNode.childNodes[i].classList && this_.dragTargetNode.childNodes[i].classList.contains("map-child")) {
						targetMapChild = this_.dragTargetNode.childNodes[i];
					}
				}
				if (targetMapChild !== null) {
					try {
						targetMapChild.appendChild(this_.dragSourceNode);
						dropCompleted = true;
					} catch (err) {
						dragEndHandler_();
					}
				} else {
					dragEndHandler_();
				}
			}
		}
		dragEndHandler_();
		return false;
	};
	
	var legendPanel = this.dom.querySelectorAll("div[dt-type='service']");
	for (let i = 0; i < legendPanel.length; i++) {
		if(!goog.events.hasListener(legendPanel[i].querySelector(".prop-info-wfs"), goog.events.EventType.DRAGSTART)){
			goog.events.listen(legendPanel[i].querySelector(".prop-info-wfs"), goog.events.EventType.DRAGSTART, dragStartHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGOVER)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGOVER, dragOverHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGLEAVE)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGLEAVE, dragLeaveHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DROP)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DROP, dropHandler_);	
		}
		if(!goog.events.hasListener(legendPanel[i], goog.events.EventType.DRAGEND)){
			goog.events.listen(legendPanel[i], goog.events.EventType.DRAGEND, dragEndHandler_);	
		}
	}
	for (let i = 0; i < folders.length; i++) {
		if (folders[i].getAttribute("dt-id") !== "root") {
			if(!goog.events.hasListener(folders[i].querySelector(".prop-info-wfs"), goog.events.EventType.DRAGSTART)){
				goog.events.listen(folders[i].querySelector(".prop-info-wfs"), goog.events.EventType.DRAGSTART, dragStartHandler_);	
			}
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DRAGOVER)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DRAGOVER, dragOverHandler_);	
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DRAGLEAVE)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DRAGLEAVE, dragLeaveHandler_);	
		}
		if(!goog.events.hasListener(folders[i].querySelector(".props"), goog.events.EventType.DROP)){
			goog.events.listen(folders[i].querySelector(".props"), goog.events.EventType.DROP, dropHandler_);	
		}
		if(!goog.events.hasListener(folders[i], goog.events.EventType.DRAGEND)){
			goog.events.listen(folders[i], goog.events.EventType.DRAGEND, dragEndHandler_);	
		}
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
M.control.WFSManagerControl.prototype.setDefaultServiceActive = function(radioDefault) {
	var radioButtons = this.mapTree_.querySelectorAll("input[type='radio']");
	for(var i = 0; i<radioButtons.length; i++) {
		radioButtons[i].checked = false;
	}
	if(radioDefault){
		radioDefault.checked = true;
		this.idServiceActive_ = radioDefault.id.replace("radioId_","");
	}
	else{
		radioButtons[0].checked = true;
		this.idServiceActive_ = radioButtons[0].id.replace("radioId_","");
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
M.control.WFSManagerControl.prototype.getServiceActive = function() {
    for(let i=0;i<this.services_.length;i++){
    	if(this.services_[i].id===this.idServiceActive_){
    		this.serviceActive_ = this.services_[i];
    	}
    }
	var useProxy = true;
	if(this.serviceActive_.url.indexOf("192")!==-1){
		useProxy = false;
	}
    this.serviceActive_.useProxy = useProxy;
    return this.serviceActive_;
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
M.control.WFSManagerControl.prototype.getAllServices = function() {
    return this.services_;
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
M.control.WFSManagerControl.prototype.removeService= function(node) {
	var i = this.services_.length;
	while (i--) {
    	if(this.services_[i].id===node.id.replace("radioId_","")){
    		this.services_.splice(i, 1);
    	}
	}
};

/**
 * This function collapses a folder node in map tree
 *
 * @public
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @api stable
 */
M.control.WFSManagerControl.prototype.collapseNode = function (nodeDom) {
	nodeDom.setAttribute("dt-data", "collapsed");
	nodeDom.classList.remove("expanded");
	nodeDom.classList.add("collapsed");
	var childNodes = nodeDom.getElementsByClassName('map-node');
	for (var i = 0; i < childNodes.length; i++) {
		this.collapseNode(childNodes[i]);
	}
};

/**
 * This function expands a folder node in map tree
 *
 * @public
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @api stable
 */
M.control.WFSManagerControl.prototype.expandNode = function (nodeDom) {
	nodeDom.setAttribute("dt-data", "expanded");
	nodeDom.classList.remove("collapsed");
	nodeDom.classList.add("expanded");
};

/**
 * This function finds the closest element of a node based in class
 *
 * @private
 * @function
 * @param {HTMLElement} el - Node from map tree
 * @param {string} cls - Class
 * @api stable
 */
M.control.WFSManagerControl.prototype.closest = function (el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
};

/**
 * This function finds the closest element of a node based in attribute value
 *
 * @private
 * @function
 * @param {HTMLElement} nodeDom - Node from map tree
 * @param {string} attribute - Attribute
 * @param {string} value - Attribute value
 * @api stable
 */
M.control.WFSManagerControl.prototype.closestAttribute = function (nodeDom, attribute, value) {
	if (nodeDom.getAttribute(attribute) == value) {
		return nodeDom;
	} else {
		return this.closestAttribute(nodeDom.parentNode, attribute, value);
	}
};

/**
 * This function renders the panel
 *
 * @function
 * @api stable
 */
M.control.WFSManagerControl.prototype.render = function () {
	this.getImpl().renderPanel();
};

/**
 * Unegisters events for map and layers from the WFSManagerControl
 *
 * @function
 * @api stable
 */
M.control.WFSManagerControl.prototype.unregisterEvents = function () {
	this.getImpl().unregisterEvents();
};

/**
 * Gets this implementation control
 *
 * @function
 * @api stable
 */
M.control.WFSManagerControl.prototype.getImpl = function () {
	return this.impl_;
};

/**
 * Unegisters events for map and layers from the WFSManagerControl
 *
 * @function
 * @api stable
 */
M.control.WFSManagerControl.prototype.getTemplate = function () {
	return this.html_;
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.WFSManagerControl.prototype.equals = function (obj) {
	return (obj instanceof M.control.WFSManagerControl);
};

/**
 * Name for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.WFSManagerControl.NAME = 'WFSManagerControl';

/**
 * Template for this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */

M.control.WFSManagerControl.TEMPLATE = 'WFSManager.html';
if(M.config.devel){
	M.control.WFSManagerControl.TEMPLATE = 'src/WFSManager/templates/WFSManager.html';
}


