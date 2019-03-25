goog.provide('P.control.advLSPanelControl');

goog.require('goog.dom.classlist');
goog.require('goog.events');

/**
 * @classdesc
 * Main constructor of the class. Creates a advLSPanelControl
 * control
 *
 * @constructor
 * @api stable
 */
M.control.advLSPanelControl = (function (allowMove) {
	/**
	 * Layer for use in control
	 * @private
	 * @type {M.layer.WFS}
	 */
	this.dialogBox = null;
	/**
	 * Layer for use in control
	 * @private
	 * @type {M.layer.WFS}
	 */
	this.draggablePanel = null;
	/**
	 * Layer for use in control
	 * @private
	 * @type {M.layer.WFS}
	 */
	this.panelMinimized = false;
	/**
	 * Layer for use in control
	 * @private
	 * @type {M.layer.WFS}
	 */
	this.allowMove = allowMove;
});

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.advLSPanelControl.prototype.createView = function () {
	var this_ = this;
	return new Promise(function (success) {
		M.template.compile(M.control.advLSPanelControl.TEMPLATE,{'jsonp': false}).then(function (html) {
			this_.dialogBox = html;
			this_.addEvents();
			success(html);
		});
	});
};

/**
 * This function adds events to the control
 *
 * @public
 * @function
 * @param {*} element
 * @api stable
 */
M.control.advLSPanelControl.prototype.addEvents = function () {
	var draggablePanelTitle = this.dialogBox.querySelector('#dialog-title-advLS');
	var draggablePanelClose = this.dialogBox.querySelector('#dialog-close-advLS');
	goog.events.listen(draggablePanelClose, goog.events.EventType.CLICK, this.closePanel, false, this);
	if(this.allowMove === undefined || this.allowMove === true){
		draggablePanelTitle.style.cursor = "move";
		goog.events.listen(draggablePanelTitle, goog.events.EventType.MOUSEDOWN, this.initDrag, false, this);
		goog.events.listen(draggablePanelTitle, goog.events.EventType.MOUSEUP, this.stopDrag, false, this);	
	}
	else{
		draggablePanelTitle.style.cursor = "default";
	}
};

/**
 * This function creates the structure of the panel
 *
 * @public
 * @function
 * @param {*} set
 * @param {*} config
 * @api stable
 */
M.control.advLSPanelControl.prototype.createDialog = function (set, config) {
	document.querySelector('#mapjs').appendChild(this.dialogBox);
	this.dialogBox_title = this.dialogBox.children[0].children[0];
	this.dialogBox_close = this.dialogBox.children[0].children[2];
	this.dialogBox_minimize = this.dialogBox.children[0].children[1];
	this.dialogBox_content = this.dialogBox.children[1];
	this.dialogBox_overlay = this.dialogBox.nextSibling;
	if (this.panelMinimized === true) {
		this.panelMinimized = false;
		this.dialogBox_minimize.innerHTML = '-';
		this.dialogBox_content.style.marginTop = '31px';
		this.dialogBox.querySelector('.dialog-content-advLS').style.display = 'block';
	}
	var this_ = this;
	var defaults = {
			title: config.title,
			content: config.content,
			width: config.width,
			height: config.height,
			top: false,
			left: false
	}; // Default options...

	for (var i in config) {
		defaults[i] = (typeof (config[i])) ? config[i] : defaults[i];
	}

	this_.dialogBox.style.visibility = (set == "open") ? "visible" : "hidden";
	this_.dialogBox.style.opacity = (set == "open") ? 1 : 0;
	this_.dialogBox.style.display = 'table';
	this_.dialogBox.style.width = defaults.width + 'px';
	this_.dialogBox.style.height = defaults.height + 'px';
	this_.dialogBox.style.top = (!defaults.top) ? "50%" : '0px';
	this_.dialogBox.style.left = (!defaults.left) ? "50%" : '0px';
	this_.dialogBox.style.marginTop = (!defaults.top) ? '-' + defaults.height / 2 + 'px' : defaults.top + 'px';
	this_.dialogBox.style.marginLeft = (!defaults.left) ? '-' + defaults.width / 2 + 'px' : defaults.left + 'px';
	this_.dialogBox_title.innerHTML = defaults.title;
	this_.dialogBox_content.innerHTML = defaults.content;

	return this.dialogBox;
};

/**
 * This function starts the drag of the panel
 *
 * @public
 * @function
 * @param {*} e
 * @api stable
 */
M.control.advLSPanelControl.prototype.initDrag = function (e) {
	this.draggablePanel = this.dialogBox;
	this.draggablePanel.style.opacity = 0.7;
	var x = e.clientX;
	var y = e.clientY;
	var boxX = parseFloat(window.getComputedStyle(this.draggablePanel, null)["left"]);
	var boxY = parseFloat(window.getComputedStyle(this.draggablePanel, null)["top"]);
	var this_ = this;
	document.onmousemove = function (e) {
		if (this_.draggablePanel === null) {
			return;
		}
		var deltaX = e.pageX - x;
		var deltaY = e.pageY - y;
		this_.draggablePanel.style.left = (boxX + deltaX) + "px";
		this_.draggablePanel.style.top = (boxY + deltaY) + "px";
		this_.draggablePanel.style.position = 'absolute';
		window.getSelection().empty();
	};
};

/**
 * This function stops the drag of the panel
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSPanelControl.prototype.stopDrag = function () {
	if (this.draggablePanel !== null) {
		this.draggablePanel.style.opacity = 1;
	}
	this.draggablePanel = null;
};

/**
 * This function closes the panel when click the X button
 *
 * @public
 * @function
 * @api stable
 */
M.control.advLSPanelControl.prototype.closePanel = function () {
	if(this.dialogBox!==null && this.dialogBox.parentNode!==null){
		this.dialogBox.parentNode.removeChild(this.dialogBox);	
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
M.control.advLSPanelControl.prototype.equals = function (obj) {
	var equals = false;
	if (obj instanceof M.control.advLSPanelControl) {
		equals = (this.name === obj.name);
	}
	return equals;
};

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSPanelControl.NAME = 'advLSPanelControl';

/**
 * Template for the panel of this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.advLSPanelControl.TEMPLATE = 'advLSPanel.html';
if(M.config.devel){
	M.control.advLSPanelControl.TEMPLATE = 'src/advLS/templates/advLSPanel.html';
}

