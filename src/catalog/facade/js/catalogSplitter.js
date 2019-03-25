/* Copyright (c) 2016 Reinoud Veenhof
Adapted after and inspired by split.js by Nathan Cahill Copyright (c) 2015

Adapted for Mapea by fbaena
*/

goog.provide('P.control.CatalogSplitter');

/**
 * @classdesc
 * Main constructor of the class. Creates a CatalogControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.CatalogSplitter = (function() {
	this.split = {};
	this.splitter = null;
	this.veetsplitterMouseUpFn = null;
	this.veetsplitterMouseMoveFn = null;
});


/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.setSplit = function(splitterElement, options) {
	// get the splitter by Id
	this.splitter = splitterElement;
	if (!this.splitter) {
		//console.log("Error: could not get splitter element id="+elmId+"... Ignoring rest of function...");
		return;
	}
	
	// init, process and apply user supplied options
	this.parseOptions(this.splitter, options);
	this.applyOptions(this.splitter);
	
	// check if it is a fixed splitter
	if (this.splitter.options.isFixed === false) {
		// only install the mousedown handler for a moveable splitter
		var veetsplitterMouseDown = this.veetsplitterMouseDown.bind(this);
		this.splitter.addEventListener('mousedown', veetsplitterMouseDown, false);
	}
	
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.parseOptions = function(splt, useropt) {
	if (!splt.options) splt.options = {};
	
	// get the parent of the splitter by Class
	var parent = splt.parentElement;
	
	// set some key props
	// get parent splitpanel container dims
	splt.options.parentRect = parent.getBoundingClientRect();
	if(splt.options.parentRect.height===0){
		splt.options.parentRect.height = 400;
	}
	if (splt.classList.contains("row")) {
		splt.options.orientation = 'horizontal';
		splt.options.panel1 = parent.getElementsByClassName("toppanel")[0];
		splt.options.panel2 = parent.getElementsByClassName("bottompanel")[0];
	}
	else {
		//default = vertical
		splt.options.orientation = 'vertical';
		splt.options.panel1 = parent.getElementsByClassName("leftpanel")[0];
		splt.options.panel2 = parent.getElementsByClassName("rightpanel")[0];
	}
	
	// set the defaults
	splt.options.splitterSize = 5;
	splt.options.startPosition = 25; // in %
	
	splt.options.minSize = 3; // in %
	splt.options.minSizePanel1 = splt.options.minSize; // in %
	splt.options.minSizePanel2 = splt.options.minSize; // in %
	
	splt.options.isFixed = false;
	splt.options.fixedPanel2 = false;
	
	// parse the user specs
	if (useropt) {
		if (useropt.splitterSize) { splt.options.splitterSize = Math.min(Math.max(useropt.splitterSize,3),100); }
		if (useropt.startPosition) { splt.options.startPosition = Math.min(Math.max(useropt.startPosition,0),100); }
		
		if (useropt.minSize) { splt.options.minSize = Math.min(Math.max(useropt.minSize,0),100); }
		if (useropt.minSizePanel1) { splt.options.minSizePanel1 = Math.min(Math.max(useropt.minSizePanel1,0),100); }
		if (useropt.minSizePanel2) { splt.options.minSizePanel2 = Math.min(Math.max(useropt.minSizePanel2,0),100); }
		
		if (useropt.isFixed === true) { splt.options.isFixed = true; }
		if (useropt.fixedPanel2 === true) { splt.options.fixedPanel2 = true; }
	}
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.applyOptions = function(splt) {
	var pos = Math.min(Math.max(splt.options.startPosition,0),100);
	var min1 = Math.min(Math.max(splt.options.minSizePanel1,0),100);
	var min2 = Math.min(Math.max(splt.options.minSizePanel2,0),100);
	
	if (pos < min1) {
		pos = min1;
	}
	else if (pos > (100-min2)) {
		pos = (100-min2);
	}
	
	if (splt.options.orientation === 'horizontal') {
		splt.style.height = splt.options.splitterSize+"px";
		
		splt.options.panel1.style.minHeight = "0px";
		splt.options.panel2.style.minHeight = (splt.options.parentRect.height*min2/100)+"px";
		
		splt.options.panel1.style.height = 160+"px";
		splt.style.top = (splt.options.parentRect.height*pos/100)+"px";
	}
	else {
		//default = vertical
		splt.style.width = splt.options.splitterSize+"px";
		
		splt.options.panel1.style.minWidth = (splt.options.parentRect.width*min1/100)+"px";
		splt.options.panel2.style.minWidth = (splt.options.parentRect.width*min2/100)+"px";
		
		splt.options.panel1.style.width = (splt.options.parentRect.width*pos/100)+"px";
		splt.style.left = (splt.options.parentRect.width*pos/100)+"px";
	}
	
	// check if it is a fixed splitter
	if (splt.options.isFixed === true) {
		splt.style.cursor = "default";
		splt.style.backgroundImage = "none";
	}
	
	// check if panel2 is the fixed sized panel when resizing the window
	// Note: panel1 fixedsize when resizing is the default
	if (this.splitter.options.fixedPanel2 === true) {
		var ps = Math.min(Math.max(this.splitter.options.startPosition,0),100);
		var sz = this.splitter.options.splitterSize;
		var pw = this.splitter.options.parentRect.width;
		var ph = this.splitter.options.parentRect.height;
		var psx = pw*ps/100;
		var psy = ph*ps/100;
	
		if (this.splitter.options.orientation === 'horizontal') {
			this.splitter.options.panel2.style.height = (ph-psy-sz)+"px";
			this.splitter.options.panel1.style.height = null;
		}
		else {
			this.splitter.options.panel2.style.width = (pw-psx-sz)+"px";
			this.splitter.options.panel1.style.width = null;
		}
		
		// swap the flex style of the panels
		this.splitter.options.panel1.style["-webkit-box-flex"] = '1';
		this.splitter.options.panel1.style["-ms-flex"] = '1 1 auto';
		this.splitter.options.panel1.style.flex =  '1 1 auto';
		
		this.splitter.options.panel2.style["-webkit-box-flex"] = '0';
		this.splitter.options.panel2.style["-ms-flex"] = '0 0 auto';
		this.splitter.options.panel2.style.flex =  '0 0 auto';
	}
	
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.veetsplitterMouseDown = function(e) {
	e.preventDefault();
	this.veetsplitterMouseUpFn = this.veetsplitterMouseUp.bind(this);
	window.addEventListener('mouseup', this.veetsplitterMouseUpFn, false);
	// get the splitter and parent splitpanel container
	this.splitter = e.target;
	this.splitter.options.parentRect = this.splitter.parentElement.getBoundingClientRect();
	this.splitter.options.anchorX = e.clientX;
	this.splitter.options.anchorY = e.clientY;
	this.veetsplitterMouseMoveFn = this.veetsplitterMouseMove.bind(this);
	window.addEventListener('mousemove', this.veetsplitterMouseMoveFn, true);
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.veetsplitterMouseMove = function(e) {
	e.preventDefault();
	var minpos1, minpos2;
	var spz = this.splitter.options.splitterSize;
	var pr = this.splitter.options.parentRect;
	
	if (this.splitter.options.orientation === 'horizontal') {
		minpos1 = parseFloat(this.splitter.options.panel1.style.minHeight);
		minpos2 = (pr.height-parseFloat(this.splitter.options.panel2.style.minHeight)-spz);
		var yoffs = (e.clientY-77-(spz/2));
		
		yoffs = Math.min(Math.max(yoffs,minpos1),minpos2);
		this.splitter.style.top = yoffs+'px';
		if (this.splitter.options.fixedPanel2 === true) {
			this.splitter.options.panel2.style.height = (pr.height-yoffs-spz)+'px';
		}
		else {
			this.splitter.options.panel1.style.height = yoffs+'px';
		}
	}
	else {  // vertical is the default
		minpos1 = parseFloat(this.splitter.options.panel1.style.minWidth);
		minpos2 = (pr.width-parseFloat(this.splitter.options.panel2.style.minWidth)-spz);
		var xoffs = (e.clientX-pr.left-(spz/2));
		
		xoffs = Math.min(Math.max(xoffs,minpos1),minpos2);
		this.splitter.style.left = xoffs+'px';
		if (this.splitter.options.fixedPanel2 === true) {
			this.splitter.options.panel2.style.width = (pr.width-xoffs-spz)+'px';
		}
		else {
			this.splitter.options.panel1.style.width = xoffs+'px';
		}
	}
};

/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @param {html} html element
 * @api stable
 */
M.control.CatalogSplitter.prototype.veetsplitterMouseUp = function(e) {
	window.removeEventListener('mousemove', this.veetsplitterMouseMoveFn, true);
	window.removeEventListener('mouseup', this.veetsplitterMouseUpFn, true);
};