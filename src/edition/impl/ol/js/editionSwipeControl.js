goog.provide('P.impl.EditionSwipeControl');


/*	Copyright (c) 2015 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * @classdesc OpenLayers 3 swipe Control.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} Control options.
 *	- layers {ol.layer} layer to swipe
 *	- rightLayer {ol.layer} layer to swipe on right side
 *	- className {string} control class name
 *	- position {number} position propertie of the swipe [0,1], default 0.5
 *	- orientation {vertical|horizontal} orientation propertie, default vertical
 */
M.impl.EditionSwipeControl = function(opt_options) {	
	var options = opt_options || {};

	var button = document.createElement('button');

	var element = document.createElement('div');
			element.className = (options.className || "ol-swipe") + " ol-unselectable ol-control";
			element.appendChild(button);

	element.addEventListener("mousedown", this.move.bind(this));
	element.addEventListener("touchstart", this.move.bind(this));

	ol.control.Control.call(this, {	
		element: element
	});

	// An array of listener on layer postcompose
	this._listener = [];
	
	this.layers = [];
	if (options.layers) this.addLayer(options.layers, false);
	if (options.rightLayers) this.addLayer(options.rightLayers, true);

	this.addEventListener('propertychange', function() 
	{	if (this.getMap()) this.getMap().renderSync();
		if (this.get('orientation') === "horizontal")
		{	this.element.style.top = this.get('position')*100+"%";
			this.element.style.left = "";
		}
		else
		{	if (this.get('orientation') !== "vertical") this.set('orientation', "vertical");
			this.element.style.left = this.get('position')*100+"%";
			this.element.style.top = "";
		}
		this.element.classList.remove("horizontal", "vertical");
		this.element.classList.add(this.get('orientation'));
	}.bind(this));
	
	this.set('position', options.position || 0.5);
	this.set('orientation', options.orientation || 'vertical');
};

goog.inherits(M.impl.EditionSwipeControl, ol.control.Control);

/**
 * Set the map instance the control associated with.
 * @param {ol.Map} map The map instance.
 */
M.impl.EditionSwipeControl.prototype.setMap = function(map) {   
	var l;
	if (this.getMap())
	{	for (var i=0; i<this.layers.length; i++)
		{	l = this.layers[i];
			if (l.right) l.layer.un('precompose', this.precomposeRight, this);
			else l.layer.un('precompose', this.precomposeLeft, this);
			l.layer.un('postcompose', this.postcompose, this);
		}
		this.getMap().renderSync();
	}

	ol.control.Control.prototype.setMap.call(this, map);

	if (map)
	{	for (var j=0; j<this.layers.length; j++)
		{	l = this.layers[j];
			if (l.right) l.layer.on('precompose', this.precomposeRight, this);
			else l.layer.on('precompose', this.precomposeLeft, this);
			l.layer.on('postcompose', this.postcompose, this);
		}
		map.renderSync();
	}
};

/** @private
*/
M.impl.EditionSwipeControl.prototype.isLayer_ = function(layer) {
	for (var k=0; k<this.layers.length; k++){
		if (this.layers[k].layer === layer)  return k;
	}
	return -1;
};

/** Add a layer to clip
 *	@param {ol.layer|Array<ol.layer>} layer to clip
*	@param {bool} add layer in the right part of the map, default left.
*/
M.impl.EditionSwipeControl.prototype.addLayer = function(layers, right) {
	if (!(layers instanceof Array)) layers = [layers];
	for (var i=0; i<layers.length; i++){
		var l = layers[i];
		if (this.isLayer_(l)<0){
			this.layers.push({ layer:l, right:right });
			if (this.getMap()){
				if (right) l.on('precompose', this.precomposeRight, this);
				else l.on('precompose', this.precomposeLeft, this);
				l.on('postcompose', this.postcompose, this);
				this.getMap().renderSync();
			}
		}
	}
};

/** Remove a layer to clip
 *	@param {ol.layer|Array<ol.layer>} layer to clip
 */
M.impl.EditionSwipeControl.prototype.removeLayer = function(layers){
	if (!(layers instanceof Array)) layers = [layers];
	for (var i=0; i<layers.length; i++){
		var k = this.isLayer_(layers[i]);
		if (k >=0 && this.getMap()){
			if (this.layers[k].right) layers[i].un('precompose', this.precomposeRight, this);
			else layers[i].un('precompose', this.precomposeLeft, this);
			layers[i].un('postcompose', this.postcompose, this);
			this.layers.splice(k,1);
			this.getMap().renderSync();
		}
	}
};

/** @private
*/
M.impl.EditionSwipeControl.prototype.move = function(e) {	
	var self = this;
	switch (e.type){
		case 'touchcancel':
		case 'touchend':
		case 'mouseup':{
			self.isMoving = false;
			["mouseup", "mousemove", "touchend", "touchcancel", "touchmove"]
				.forEach(function(eventName) {
					document.removeEventListener(eventName, self.move);
				});
			break;
		}
		case 'mousedown':
		case 'touchstart':
		{	self.isMoving = true;
			["mouseup", "mousemove", "touchend", "touchcancel", "touchmove"]
				.forEach(function(eventName) {
					document.addEventListener(eventName, self.move.bind(self));
				});
			break;
		}
		case 'mousemove':
		case 'touchmove':
		{	var l;
			if (self.isMoving)
			{	if (self.get('orientation') === "vertical")
				{	var pageX = e.pageX || (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageX) || (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageX);
					if (!pageX) break;
					pageX -= self.getMap().getTargetElement().getBoundingClientRect().left +
						window.pageXOffset - document.documentElement.clientLeft;

					l = self.getMap().getSize()[0];
					l = Math.min(Math.max(0, 1-(l-pageX)/l), 1);
					self.set('position', l);
				}
				else
				{	var pageY = e.pageY || (e.originalEvent.touches && e.originalEvent.touches.length && e.originalEvent.touches[0].pageY) || (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length && e.originalEvent.changedTouches[0].pageY);
					if (!pageY) break;
					pageY -= self.getMap().getTargetElement().getBoundingClientRect().top +
						window.pageYOffset - document.documentElement.clientTop;

					l = self.getMap().getSize()[1];
					l = Math.min(Math.max(0, 1-(l-pageY)/l), 1);
					self.set('position', l);
				}
			}
			break;
		}
		default: break;
	}
};

/** @private
*/
M.impl.EditionSwipeControl.prototype.precomposeLeft = function(e) 
{	var ctx = e.context;
	var canvas = ctx.canvas;
	ctx.save();
	ctx.beginPath();
	if (this.get('orientation') === "vertical") ctx.rect (0,0, canvas.width*this.get('position'), canvas.height);
	else ctx.rect (0,0, canvas.width, canvas.height*this.get('position'));
	ctx.clip();
};

/** @private
*/
M.impl.EditionSwipeControl.prototype.precomposeRight = function(e) 
{	var ctx = e.context;
	var canvas = ctx.canvas;
	ctx.save();
	ctx.beginPath();
	if (this.get('orientation') === "vertical") ctx.rect (canvas.width*this.get('position'), 0, canvas.width, canvas.height);
	else ctx.rect (0,canvas.height*this.get('position'), canvas.width, canvas.height);
	ctx.clip();
};

/** @private
*/
M.impl.EditionSwipeControl.prototype.postcompose = function(e) 
{	e.context.restore();
};
