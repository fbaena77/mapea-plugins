goog.provide('P.control.EditionGeometryControl');

goog.require('P.impl.control.EditionGeometryControl');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @classdesc
 * Main constructor of the class. Creates a EditionGeometryControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.EditionGeometryControl = (function(base) {
	if (M.utils.isUndefined(M.impl.control.EditionGeometryControl)) {
		M.exception('La implementación usada no puede crear controles EditionGeometryControl');
	}

	this.NAME = "editionGeometryControl";

	this.facadeMap_ = base.facadeMap_;
	/**
	 * Parent prototype by dependency injection
	 * @private
	 * @type {Object}
	 */
	this.base = base;
	/**
	 * Html Element
	 * @private
	 * @type {Object}
	 */
	this.element_ = base.element_;
	/**
	 * InsertGeomControl control
	 * @private
	 * @type {Object}
	 */
	this.insertGeomControl = this.base.insertGeomControl;
	/**
	 * insertTemporalGeomControl control
	 * @private
	 * @type {Object}
	 */
	this.insertTemporalGeomControl = new M.control.EditionTemporalGeometry(this.facadeMap_, null);
	/**
	 * modifyGeomControl control
	 * @private
	 * @type {Object}
	 */
	this.modifyGeomControl = this.base.modifyGeomControl;
	/**
	 * translateGeomControl control
	 * @private
	 * @type {Object}
	 */
	this.translateGeomControl = this.base.translateGeomControl;
	/**
	 * selectGeomControl control
	 * @private
	 * @type {Object}
	 */
	this.selectGeomControl = this.base.selectGeomControl;
	/**
	 * snappingControl control
	 * @private
	 * @type {Object}
	 */
	this.snappingControl = this.base.snappingControl;
	/**
	 * entityAddWFSControl control
	 * @private
	 * @type {Object}
	 */
	this.entityAddWFSControl = null;
	/**
	 * insertPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.insertPolygonButton = null;
	/**
	 * selectPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.selectPolygonButton = null;
	/**
	 * selectPolygonByAreaButton button
	 * @private
	 * @type {Object}
	 */
	this.selectPolygonByAreaButton = null;
	/**
	 * selectPolygonByLineButton button
	 * @private
	 * @type {Object}
	 */
	this.selectPolygonByLineButton = null;
	/**
	 * selectAllSandboxPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.selectAllSandboxPolygonButton = null;
	/**
	 * modifyPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.modifyPolygonButton = null;
	/**
	 * dividePolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.dividePolygonButton = null;
	/**
	 * joinPolygonsButton button
	 * @private
	 * @type {Object}
	 */
	this.joinPolygonsButton = null;
	/**
	 * intersectPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.intersectPolygonButton = null;
	/**
	 * emptyPolygonButton button
	 * @private
	 * @type {Object}
	 */
	this.emptyPolygonButton = null;
	/**
	 * zoomToSelectedButton button
	 * @private
	 * @type {Object}
	 */
	this.zoomToSelectedButton = null;
	/**
	 * addGeomButton button
	 * @private
	 * @type {Object}
	 */
	this.addGeomButton = null;
	/**
	 * WFSManager control
	 * @private
	 * @type {Object}
	 */
	this.WFSManagerCtl = null;

	this.impl_ = new M.impl.control.EditionGeometryControl(base.facadeMap_);

	this.addEvents();
	// calls super constructor (scope, implementation, controlName)
	goog.base(this, this.impl_, M.control.EditionGeometryControl.NAME);
});
goog.inherits(M.control.EditionGeometryControl, M.Control);


/**
 * This function add the events to the specified html element
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.addEvents = function() {

	/*********Zoom Menu Dropdown************/
	this.zoomMenuElement = this.element_.querySelector('#m-zoommenu-button');
	goog.events.listen(this.zoomMenuElement, goog.events.EventType.MOUSEOVER, this.showDropdownContent, false, this);
	goog.events.listen(this.zoomMenuElement, goog.events.EventType.MOUSELEAVE, this.hideDropdownContent, false, this);
	//Manage zoom button click
	this.zoomMenuPolygonButton = this.element_.querySelector('#m-zoom-button');
	this.zoomMenuPolygonButtonClass = this.zoomMenuPolygonButton.classList.value;
	goog.events.listen(this.zoomMenuPolygonButton, goog.events.EventType.CLICK, this.manageSelectedClassInDropdown, false, this);
	//Zoom to sandbox
	this.zoomToSandBoxButton = this.element_.querySelector('button#m-zoomsandbox-button');
	goog.events.listen(this.zoomToSandBoxButton, goog.events.EventType.CLICK, this.zoomToSandBox, false, this);
	//Zoom to selected
	this.zoomToSelectedButton = this.element_.querySelector('button#m-zoomselect-button');
	goog.events.listen(this.zoomToSelectedButton, goog.events.EventType.CLICK, this.zoomToSelection, false, this);

	/*********Select Menu Dropdown************/
	this.selectMenuElement = this.element_.querySelector('#m-selectmenu-button');
	goog.events.listen(this.selectMenuElement, goog.events.EventType.MOUSEOVER, this.showDropdownContent, false, this);
	goog.events.listen(this.selectMenuElement, goog.events.EventType.MOUSELEAVE, this.hideDropdownContent, false, this);
	//Manage select button click
	this.selectMenuPolygonButton = this.element_.querySelector('#m-select-button');
	this.selectMenuPolygonButtonClass = this.selectMenuPolygonButton.classList.value;
	goog.events.listen(this.selectMenuPolygonButton, goog.events.EventType.CLICK, this.manageSelectedClassInDropdown, false, this);
	//Select by click
	this.selectPolygonButton = this.element_.querySelector('button#m-selectclick-button');
	goog.events.listen(this.selectPolygonButton, goog.events.EventType.CLICK, this.selectPolygonByClick, false, this);
	//Select by area
	this.selectPolygonByAreaButton = this.element_.querySelector('button#m-selectarea-button');
	goog.events.listen(this.selectPolygonByAreaButton, goog.events.EventType.CLICK, this.selectPolygonByDraw, false, this);
	//Select by line
	this.selectPolygonByLineButton = this.element_.querySelector('button#m-selectline-button');
	goog.events.listen(this.selectPolygonByLineButton, goog.events.EventType.CLICK, this.selectPolygonByDraw, false, this);
	//Select all
	this.selectAllSandboxPolygonButton = this.element_.querySelector('button#m-selectall-button');
	goog.events.listen(this.selectAllSandboxPolygonButton, goog.events.EventType.CLICK, this.selectAllSandboxPolygon, false, this);
	//Deselect all
	this.deselectAllSandboxPolygonButton = this.element_.querySelector('button#m-deselectall-button');
	goog.events.listen(this.deselectAllSandboxPolygonButton, goog.events.EventType.CLICK, this.deselectAllSandboxPolygon, false, this);

	/*********Add Geom Menu Dropdown************/
	this.addGeomMenuElement = this.element_.querySelector('#m-addgeometrymenu-button');
	goog.events.listen(this.addGeomMenuElement, goog.events.EventType.MOUSEOVER, this.showDropdownContent, false, this);
	goog.events.listen(this.addGeomMenuElement, goog.events.EventType.MOUSELEAVE, this.hideDropdownContent, false, this);
	//Manage add geom button click
	this.addGeomMenuButton = this.element_.querySelector('#m-addgeometry-button');
	this.addGeomMenuButtonClass = this.addGeomMenuButton.classList.value;
	goog.events.listen(this.addGeomMenuButton, goog.events.EventType.CLICK, this.manageSelectedClassInDropdown, false, this);
	//Add geom by click
	this.addGeomClickButton = this.element_.querySelector('button#m-addgeomclick-button');
	goog.events.listen(this.addGeomClickButton, goog.events.EventType.CLICK, this.addGeom, false, this);
	//Add geom by area
	this.addGeomPolygonButton = this.element_.querySelector('button#m-addgeomarea-button');
	goog.events.listen(this.addGeomPolygonButton, goog.events.EventType.CLICK, this.addGeom, false, this);
	//Add geom by area
	this.addGeomLineButton = this.element_.querySelector('button#m-addgeomlinea-button');
	goog.events.listen(this.addGeomLineButton, goog.events.EventType.CLICK, this.addGeom, false, this);
	//Add geom by radio
	this.addGeomCircleButton = this.element_.querySelector('button#m-addgeomradio-button');
	goog.events.listen(this.addGeomCircleButton, goog.events.EventType.CLICK, this.addGeom, false, this);

	this.insertPolygonButton = this.element_.querySelector('button#m-draw-button');
	goog.events.listen(this.insertPolygonButton, goog.events.EventType.CLICK, this.insertPolygon, false, this);

	this.snappingButton = this.element_.querySelector('#m-snapping-button');
	goog.events.listen(this.snappingButton, goog.events.EventType.CLICK, this.activateSnapping, false, this);

	this.modifyPolygonButton = this.element_.querySelector('button#m-modify-button');
	goog.events.listen(this.modifyPolygonButton, goog.events.EventType.CLICK, this.modifyPolygon, false, this);

	this.dividePolygonButton = this.element_.getElementsByTagName('button')['m-splitpolygon-button'];
	goog.events.listen(this.dividePolygonButton, goog.events.EventType.CLICK, this.dividePolygon, false, this);

	this.joinPolygonsButton = this.element_.querySelector('button#m-unir-button');
	goog.events.listen(this.joinPolygonsButton, goog.events.EventType.CLICK, this.confirmDialogJoinPolygons, false, this);

	this.intersectPolygonButton = this.element_.querySelector('button#m-intersect-button');
	goog.events.listen(this.intersectPolygonButton, goog.events.EventType.CLICK, this.intersectPolygon, false, this);

	this.emptyPolygonButton = this.element_.querySelector('button#m-vaciado-button');
	goog.events.listen(this.emptyPolygonButton, goog.events.EventType.CLICK, this.emptyPolygon, false, this);

	this.removeFromSandBoxButton = this.element_.querySelector('button#m-removefromsandbox-button');
	goog.events.listen(this.removeFromSandBoxButton, goog.events.EventType.CLICK, this.removeSelectedFeaturesFromSandBox, false, this);
};

/**
 * This function shows the dropdown content
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.getEditionLayer = function () {
	return this.base.getEditionLayer();
};

/**
 * This function shows the dropdown content
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.showDropdownContent = function (evt) {
	if (evt.currentTarget.children[1].style.width === "" || evt.currentTarget.children[1].style.width === "0px") {
		if(evt.currentTarget.id === "m-zoommenu-button"){
			evt.currentTarget.children[1].style.width = "80px";
		}
		else if (evt.currentTarget.id === "m-addgeometrymenu-button"){
			evt.currentTarget.children[1].style.width = "160px";
		}
		else{
			evt.currentTarget.children[1].style.width =	"200px";
		}
	}
};

/**
 * This function hides the dropdown content
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.hideDropdownContent = function (evt) {
	evt.currentTarget.children[1].style.width = "0px";
};

/**
 * This function manages the selected class in dropdown
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.manageSelectedClassInDropdown = function (evt) {
	var selectedClass;
	if (evt.currentTarget.id === 'm-select-button' && evt.currentTarget.classList.value !== 'g-cartografia-flecha') {
		if (this.selectMenuPolygonButtonClass === 'g-cartografia-flecha') {
			selectedClass = this.selectMenuPolygonButtonClass;
			evt.currentTarget.nextElementSibling.style.width = "0px";
			evt.currentTarget.classList.value = selectedClass;
			this.deactiveControls();
		}
	}	
	else if (evt.currentTarget.id === 'm-addgeometry-button' && evt.currentTarget.classList.value !== 'icon-edition-import-button') {
		if (this.addGeomMenuButtonClass === 'icon-edition-import-button') {
			selectedClass = this.addGeomMenuButtonClass;
			evt.currentTarget.nextElementSibling.style.width = "0px";
			evt.currentTarget.classList.value = selectedClass;
			this.deactiveControls();
		}
	}
	else if (evt.currentTarget.offsetParent.previousElementSibling !== null && evt.currentTarget.offsetParent.previousElementSibling.id !== "m-zoom-button") {
		selectedClass = evt.currentTarget.classList.value;
		evt.currentTarget.offsetParent.style.width = "0px";
		evt.currentTarget.offsetParent.previousElementSibling.classList.value = selectedClass;
	}
};

/**
 * This function restore the default class in dropdown buttons
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.restoreDefaultClassDropdownButtons = function () {
	this.selectMenuPolygonButton.classList.value = this.selectMenuPolygonButtonClass;
	this.addGeomMenuButton.classList.value = this.addGeomMenuButtonClass;
};

/**
 * This function show a confirmation dialog for removing the selected features from SandBox Layer
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.removeSelectedFeaturesFromSandBox = function (evt) {
	if(this.getEditionLayer().selectedFeatures_.length>0){
		var acceptFn = this.removeSelectedFeatures.bind(this);
		M.EditionDialog.show('Se eliminarán las geometrías seleccionadas ¿Desea continuar?',
				'Eliminar geometrías', 'info', acceptFn);
	}
	else{
		M.dialog.info("No hay geometrías seleccionadas", 'Eliminar geometrías');
	}
};

/**
 * This function removes the selected features from SandBox Layer
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.removeSelectedFeatures = function () {
	this.restoreDefaultClassDropdownButtons();
	this.deactiveControls();
	this.unselectControls();
	this.editionLayer = this.getEditionLayer(); 
	this.editionLayer.removeFeaturesFromSandBox(this.editionLayer.selectedFeatures_);
	M.EditionDialog.close();
};

/**
 * This function activate the snapping interaction
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.activateSnapping = function (evt) {
	this.snappingControl = new M.control.EditionSnapping(this.facadeMap_, this.getEditionLayer());
	if(evt.currentTarget.className.indexOf("selected")<0){
		evt.currentTarget.className += " selected";
		evt.currentTarget.title = 'Desactivar snapping';
		this.snappingControl.activate(null, null);
	} else {
		evt.currentTarget.title = 'Activar snapping';
		evt.currentTarget.className = this.snappingButton.className.replace(" selected", "");
		this.snappingControl.deactivate();
	}
};

/**
 * This function activate the insert geometry interaction
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.insertPolygon = function (evt) {
	this.restoreDefaultClassDropdownButtons();
	this.deactiveControls();
	if(evt.currentTarget.className.indexOf("selected")<0){
		this.unselectControls();
		evt.currentTarget.className += " selected";
		var callback = this.onPolygonInserted.bind(this);
		this.editionLayer = this.getEditionLayer();
		this.insertGeomControl = new M.control.EditionInsertGeometry(this.facadeMap_, this.editionLayer);
		this.insertGeomControl.activate(callback);
		this.snappingControl = new M.control.EditionSnapping(this.facadeMap_, this.editionLayer);
		this.snappingControl.deactivate();
		if(this.snappingButton.className.indexOf("selected")>0){
			this.snappingControl.activate(null, null);
		}
	}
	else{
		this.unselectControls();
	}
};

/**
 * Callback for the insert geometry interaction
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonInserted = function (evt) {
	this.editionLayer.addNewFeatureToSandBox(evt.feature);
};

/**
 * This function activate the select geometry interaction by single click
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.selectPolygonByClick= function (evt) {
	this.restoreDefaultClassDropdownButtons();
	this.manageSelectedClassInDropdown(evt);
	this.deactiveControls();
	if(evt.currentTarget.offsetParent.previousElementSibling.className.indexOf("selected")<0) {
		this.unselectControls();
		evt.currentTarget.offsetParent.previousElementSibling.className += " selected";
		var callback = this.onPolygonSelected.bind(this);
		this.editionLayer = this.getEditionLayer();
		this.selectGeomControl = new M.control.EditionSelectGeometry(this.facadeMap_, this.editionLayer);
		this.selectGeomControl.activate(callback);
	}
	else{
		this.showDropdownContent();
	}
};

/**
 * Callback for the select geometry interaction by single click
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonSelected = function (evt) {
	var this_ = this;
	var featureInSandBox = null;
	if(evt.selected.length>0){
		var sandBoxFeatures = this.editionLayer.getFeatures();
		sandBoxFeatures.forEach(function(f, index, array){
			for(let i=0;i<evt.selected.length;i++){
				if(evt.selected[i].getId()===this_.editionLayer.getImplFeature(f).getId()){
					featureInSandBox = evt.selected[i];	
				}
			}
		});

		if(featureInSandBox !== null){
			var selected = null;
			this.editionLayer.selectedFeatures_.forEach(function(f, index, array){
				for(let i=0;i<evt.selected.length;i++){
					if(evt.selected[i].getId()===this_.editionLayer.getImplFeature(f).getId()){
						selected = evt.selected[i];	
					}
				}
			});
			if(selected === null){
				this.editionLayer.selectFeature(featureInSandBox);
			}
			else{
				this.editionLayer.unselectFeature(featureInSandBox);	
			}
		}

		evt.target.getFeatures().clear();
	}
};

/**
 * This function activate the select geometry interaction by drawing a polygon
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.selectPolygonByDraw= function (evt) {
	this.restoreDefaultClassDropdownButtons();
	this.manageSelectedClassInDropdown(evt);
	var geometryType = evt.currentTarget.id === 'm-selectarea-button' ? 'Polygon' : 'LineString'; 
	this.deactiveControls();
	if(evt.currentTarget.offsetParent.previousElementSibling.className.indexOf("selected")<0) {
		this.unselectControls();
		evt.currentTarget.offsetParent.previousElementSibling.className += " selected";
		var callback = this.onPolygonSelectedByDraw.bind(this);
		this.insertTemporalGeomControl.activate(callback, geometryType);
	}
	else{
		this.showDropdownContent();
	}
};

/**
 * Callback for the select geometry interaction by drawing a polygon
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonSelectedByDraw= function (evt) {
	var this_ = this;
	var sandBoxFeatures = this.editionLayer.getFeatures();
	var intersects = M.editionSpatialEngine.intersects(sandBoxFeatures, evt.feature.getGeometry());
	for (var i = 0; i < intersects.length; i++) {
		var featureInSandBox = null;
		sandBoxFeatures.forEach(function(f, index, array){
			if(intersects[i].getId()===this_.editionLayer.getImplFeature(f).getId()){
				featureInSandBox = intersects[i];	
			}
		});

		if(featureInSandBox !== null){
			var selected = null;
			this.editionLayer.selectedFeatures_.forEach(function(f, index, array){
				if(intersects[i].getId()===this_.editionLayer.getImplFeature(f).getId()){
					selected = intersects[i];	
				}
			});
			if(selected === null){
				this.editionLayer.selectFeature(featureInSandBox);
			}
			else{
				this.editionLayer.unselectFeature(featureInSandBox);	
			}
		}
	}
};

/**
 * This function selects all features in sandboxlayer
 *	
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.selectAllSandboxPolygon= function () {
	this.editionLayer = this.getEditionLayer();
	if(this.editionLayer.getFeatures().length>0){
		this.restoreDefaultClassDropdownButtons();
		this.deactiveControls();
		this.unselectControls();
		this.editionLayer.selectAllFeatures();
	} else {
		M.dialog.info('No hay geometrías en la capa de trabajo');
	}
};

/**
 * This function deselects all features in sandboxlayer
 *	
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.deselectAllSandboxPolygon= function () {
	this.editionLayer = this.getEditionLayer();
	if (this.editionLayer.selectedFeatures_.length > 0) {
		this.restoreDefaultClassDropdownButtons();
		this.deactiveControls();
		this.unselectControls();
		this.editionLayer.unselectAllFeatures();
	} else {
		M.dialog.info('No hay geometrías seleccionadas en la capa de trabajo');
	}
};	

/**
 * This function activate the modify geometry interaction
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.modifyPolygon = function (evt) {
	if (this.getEditionLayer().selectedFeatures_.length > 0) {
		this.restoreDefaultClassDropdownButtons();
		this.deactiveControls();
		if(evt.currentTarget.className.indexOf("selected")<0){
			this.unselectControls();
			evt.currentTarget.className += " selected";
			var featuresSelected = this.getEditionLayer().selectedFeatures_;
			for (let i = 0; i < featuresSelected.length; i++) {
				var styles = this.impl_.getModifyStyle(this.getEditionLayer().getImplFeature(featuresSelected[i]));
				this.getEditionLayer().getImplFeature(featuresSelected[i]).setStyle(styles);
			}
			var callback = this.onPolygonModified.bind(this);
			this.editionLayer = this.getEditionLayer();
			this.modifyGeomControl = new M.control.EditionModifyGeometry(this.facadeMap_, this.editionLayer);
			this.modifyGeomControl.activate(callback);
			this.snappingControl = new M.control.EditionSnapping(this.facadeMap_, this.editionLayer);
			this.snappingControl.deactivate();
			if(this.snappingButton.className.indexOf("selected")>0){
				this.snappingControl.activate(null, null);
			}
		}
		else{
			this.unselectControls();
		}
	} else {
		M.dialog.info('No hay geometrías seleccionadas en la capa de trabajo');
	}
};

/**
 * Callback for the modify geometry interaction
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonModified = function (evt) {
	var olFeature = null;
	var features = evt.features.getArray();
	for (var i = 0; i < features.length; i++) {
		var rev = features[i].getRevision();
		if (rev > 1) {
			olFeature = features[i];
		}
	}
};

/**
 * This function activate the insert line interaction in order to divide selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.dividePolygon = function (evt) {
	this.restoreDefaultClassDropdownButtons();
	this.deactiveControls();
	if (evt.currentTarget.className.indexOf("selected") < 0) {
		this.unselectControls();
		evt.currentTarget.className += " selected";
		var callback = this.onPolygonDivided.bind(this);
		this.insertTemporalGeomControl.activate(callback, 'LineString');
		document.body.style.cursor = 'pointer';
	}
	else {
		this.unselectControls();
	}
};

/**
 * Callback for the insert line interaction in order to divide selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonDivided = function (evt) {
	var intersects;
	var featuresSelected = this.getEditionLayer().selectedFeatures_;
	var resultPolygons = [];
	if (featuresSelected.length > 0) {
		intersects = M.editionSpatialEngine.intersects(featuresSelected, evt.feature.getGeometry());
		for (var i = 0; i < intersects.length; i++) {
			resultPolygons.push(M.editionSpatialEngine.dividePolygon(evt.feature, intersects[i]));
		}
		var topologicalError = false;
		for (var j = 0; j < resultPolygons.length; j++) {
			if(resultPolygons[j]===0 || resultPolygons[j]===-1 || resultPolygons[j]===-2 || resultPolygons[j]===undefined || resultPolygons[j]===null){
				topologicalError = true;
			}
		}
		if(!topologicalError ){
			for (var k = 0; k < resultPolygons.length; k++) {
				this.getEditionLayer().addFeatures(resultPolygons[k]);	
			}
			this.getEditionLayer().removeFeaturesFromSandBox(intersects);	
		}
		else{
			M.dialog.info('La geometría no es válida', 'Dividir geometría');
		}
	} else {
		M.dialog.info('Debe seleccionar al menos una geometría', 'Dividir geometría');
		return;
	}
};

/**
 * This function show a confirmation dialog for joining selected features
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.confirmDialogJoinPolygons = function(evt) {
	var featuresSelected = this.getEditionLayer().selectedFeatures_;
	if(featuresSelected.length>1){
		var acceptFn = this.joinPolygons.bind(this);
		M.EditionDialog.show('Se agruparán las geometrías seleccionadas ¿Desea continuar?',
				'Agrupar geometrías', 'info', acceptFn);
	}
	else{
		M.dialog.info('Debe seleccionar al menos dos geometrías', 'Agrupar geometrías');
	}
};

/**
 * This function joins adjacent selected polygons
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.joinPolygons = function () {
	var featuresSelected = this.getEditionLayer().selectedFeatures_,
	pairTargetPolygons = [],
	targetPolygon,
	polygonsToDelete = [],
	union, areAdjacentPolygons, newFeature,
	polygonsToVerify = [];
	this.restoreDefaultClassDropdownButtons();
	M.EditionDialog.close();
	for (let i = 0; i < featuresSelected.length; i++) {
		var clone = this.getEditionLayer().getImplFeature(featuresSelected[i]).clone();
		clone.setId(featuresSelected[i].getId());
		polygonsToVerify.push(clone);
	}
	if (featuresSelected.length > 0) {
		this.deactiveControls();
		this.unselectControls();
		for (let j = 0; j < featuresSelected.length; j++) {
			targetPolygon = featuresSelected[j];
			for (let k = 0; k < polygonsToVerify.length; k++) {
				pairTargetPolygons.push(this.getEditionLayer().getImplFeature(targetPolygon));
				var jstsGeomFeature1 = M.editionSpatialEngine.getJSTSGeometry(this.getEditionLayer().getImplFeature(targetPolygon).getGeometry());
				var jstsGeomFeature2 = M.editionSpatialEngine.getJSTSGeometry(polygonsToVerify[k].getGeometry());
				areAdjacentPolygons = jstsGeomFeature1.intersects(jstsGeomFeature2);
				if (areAdjacentPolygons === true && targetPolygon.equals(polygonsToVerify[k]) === false) {
					polygonsToDelete.push(this.getEditionLayer().getImplFeature(targetPolygon));
					pairTargetPolygons.push(polygonsToVerify[k]);
					union = M.editionSpatialEngine.unionFeature(pairTargetPolygons[0], pairTargetPolygons[1]);
					union.setId(Math.floor(Math.random()*1000000));
					pairTargetPolygons = [];
					this.getEditionLayer().addNewFeatureToSandBox(union);
					polygonsToDelete.push(polygonsToVerify[k]);
					this.getEditionLayer().removeFeaturesFromSandBox(polygonsToDelete);
					for (let l = 0; l < polygonsToDelete.length; l++) {
						var index = polygonsToVerify.indexOf(polygonsToDelete[l]);
						if (index > -1) {
							polygonsToVerify.splice(index, 1);
						}
					}
					var jsonFeature = this.impl_.getGeoJsonFromFeature(union);
					newFeature = new M.Feature(union.getId(), jsonFeature);
					targetPolygon = newFeature;
					k = 0;
					j = 0;
				} else {
					pairTargetPolygons = [];
				}
			}
		}
	} else {
		M.dialog.info('Debe seleccionar al menos dos geometrías');
		return;
	}
};

/**
 * This function activate the select geometry interaction in order to intersect selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.intersectPolygon = function (evt) {
	this.restoreDefaultClassDropdownButtons();
	var featuresSelected = this.getEditionLayer().selectedFeatures_;
	if (featuresSelected.length === 0) {
		M.dialog.info('No hay geometrías seleccionadas', 'Intersección');
		return;
	}
	this.deactiveControls();
	if (evt.currentTarget.className.indexOf("selected") < 0) {
		this.unselectControls();
		evt.currentTarget.className += " selected";
		document.body.style.cursor = 'pointer';
		var callback = this.onPolygonIntersected.bind(this);
		this.editionLayer = this.getEditionLayer();
		this.selectGeomControl = new M.control.EditionSelectGeometry(this.facadeMap_, this.editionLayer);
		this.selectGeomControl.activate(callback);
		this.editionLayer.highlightControl.activate();
	}
	else {
		this.editionLayer.highlightControl.deactivate();
		this.unselectControls();
	}
};

/**
 * Callback for the select geometry interaction in order to intersect selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onPolygonIntersected = function (evt) {
	var intersects, featuresSelected;
	featuresSelected = this.getEditionLayer().selectedFeatures_;
	if (featuresSelected.length > 0 && evt.selected[0] !==undefined) {
		intersects = M.editionSpatialEngine.intersects(featuresSelected, evt.selected[0].getGeometry());
		if (intersects.length > 0) {
			var args = [];
			args.push(intersects);
			args.push(evt.selected[0]);
			this.doSpatialProcess(M.editionSpatialEngine.intersection, args);
			this.clear();
			evt.target.getFeatures().clear();
		}
	}
};

/**
 * This function activate the select geometry interaction in order to empty selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.emptyPolygon = function (evt) {
	this.restoreDefaultClassDropdownButtons();
	var featuresSelected = this.getEditionLayer().selectedFeatures_;
	if (featuresSelected.length === 0) {
		M.dialog.info('No hay geometrías seleccionadas', 'Vaciado');
		return;
	}
	this.deactiveControls();
	if(evt.currentTarget.className.indexOf("selected") < 0) {
		this.unselectControls();
		evt.currentTarget.className += " selected";
		document.body.style.cursor = 'pointer';
		var callback = this.onGeometryEmptied.bind(this);
		this.editionLayer = this.getEditionLayer();
		this.selectGeomControl = new M.control.EditionSelectGeometry(this.facadeMap_, this.editionLayer);
		this.selectGeomControl.activate(callback);
		this.editionLayer.highlightControl.activate();
	} else {
		this.editionLayer.highlightControl.deactivate();
		this.unselectControls();
	}
};

/**
 * Callback for the select geometry interaction in order to empty selected polygons
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.onGeometryEmptied = function (evt) {
	var featuresSelected = this.getEditionLayer().selectedFeatures_;
	if (featuresSelected.length > 0) {
		var olFeatures = [];
		for(let i = 0; i < featuresSelected.length; i++){
			olFeatures.push(this.getEditionLayer().getImplFeature(featuresSelected[i]));
		}
		var args = [];
		args.push(olFeatures);
		args.push(evt.selected[0]);
		this.doSpatialProcess(M.editionSpatialEngine.difference, args);
		this.clear();
	}
};

/**
 * This function launch the spatialProcess
 *
 * @public
 * @function
 * @param {Object} fnProcess - process function in editionSpatialEngine
 * @param {Array} args - arguments for fnProcess function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.doSpatialProcess = function (fnProcess, args) {
	var featuresSelected = args[0];
	var plantillaRecorte = args[1];

	for(let i = 0; i < featuresSelected.length; i++){
		var olFeature = featuresSelected[i];

		if(plantillaRecorte !== olFeature){
			var difference = fnProcess.apply(this, [olFeature, plantillaRecorte]);
			var feature = olFeature.clone();
			feature.setGeometry(difference);
			feature.setId(Math.floor(Math.random()*1000000) + 1);

			if(feature.getGeometry().getType() === "MultiPolygon"){
				var featureTmp = this.impl_.createOLPolygonFeature(feature);
				this.getEditionLayer().addNewFeatureToSandBox(featureTmp);
			}else{
				this.getEditionLayer().addNewFeatureToSandBox(feature);
			}
		}

		if(featuresSelected.length>1 || (featuresSelected.length===1 && plantillaRecorte !== olFeature)){
			this.getEditionLayer().removeFeaturesFromSandBox([olFeature]);	
		}
	}
};

/**
 * This function activate the listener on clicking the map in order to add geometries from WFSManager active service
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.addGeom = function (evt) {
	if(this.checkWFSManagerPlugin()){
		for (let i = 0; i < this.facadeMap_.getControls().length; i++) {
			if (this.facadeMap_.getControls()[i].activated) {
				this.facadeMap_.getControls()[i].deactivate();
			}
		}
		this.restoreDefaultClassDropdownButtons();
		this.manageSelectedClassInDropdown(evt);
		this.deactiveControls();
		if(evt.currentTarget.offsetParent.previousElementSibling.className.indexOf("selected")<0) {
			this.unselectControls();
			evt.currentTarget.offsetParent.previousElementSibling.className += " selected";
			document.body.style.cursor = 'pointer';
			this.getWfsFeatures = this.getWfsFeatures.bind(this);
			if(evt.currentTarget.id==="m-addgeomclick-button"){
				var mapImpl = this.facadeMap_.getMapImpl();
				mapImpl.on('click', this.getWfsFeatures, this);	
			}
			else{
				M.dialog.info("Se importará un máximo de 100 geometrías cada vez");
				var callback = this.getWfsFeatures.bind(this);
				var geometryType = 'Polygon';
				if(evt.currentTarget.id === 'm-addgeomlinea-button'){
					geometryType = 'LineString'; 
				}
				else if(evt.currentTarget.id === 'm-addgeomradio-button'){
					geometryType = 'Circle'; 
				}
				this.insertTemporalGeomControl.activate(callback, geometryType);
			}
		}
		else{
			this.unselectControls();
			document.body.style.cursor = 'auto';
		}	
	}
	else{
		M.dialog.error('No se ha encontrado el plugin WFSManager');
	}
};

/**
 * This function does a filtered WFS GetFeature from active service in WFSManager Plugin
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.getWfsFeatures = function (evt) {
	var this_ = this;
	evt.preventDefault();
	var mapContainer = document.getElementsByClassName("m-mapea-container")[0];
	M.EditionSpinner.show(mapContainer);
	var requestParams = this.WFSManagerCtl.getServiceActive();
	if(evt.type==="click"){
		var featureRequest = this.impl_.getFilterPointFeatureRequestBody(requestParams, evt.coordinate);	
	}
	else if (evt.type==="drawend"){
		var featureRequest = this.impl_.getFilterPolygonFeatureRequestBody(requestParams, evt.feature.getGeometry());
	}
	var options = {jsonp: requestParams.useProxy};
	var body = new XMLSerializer().serializeToString(featureRequest);

	M.remote.post(requestParams.url, body, options)
	.then(function(response) {
		if(response.code===200){
			var numberFeatures = Number(response.xml.documentElement.getAttribute("numberOfFeatures"));
			if(numberFeatures<1){
				M.EditionSpinner.close(mapContainer);
				M.dialog.info('No se han encontrado '+requestParams.description);
			}
			else{
				return response.text;		
			}
		}
		else{
			M.dialog.error('No se ha podido realizar la consulta');
			return;
		}
	}).then(function(text) {
		var features = this_.getEditionLayer().readGML3Features(text);
		if(features.length>0){
			for(let i=0;i<features.length;i++){
				this_.getEditionLayer().addNewFeatureToSandBox(features[i]);	
			}
			M.EditionSpinner.close(mapContainer);
		}
		else{
			M.EditionSpinner.close(mapContainer);
			M.dialog.info('No se han encontrado '+requestParams.description);
		}
	}).catch(function(e) {
		M.EditionSpinner.close(mapContainer);
		M.dialog.error('No se ha podido realizar la consulta');
	});	
};

/**
 * This function checks if WFSManager Plugin is loaded
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.checkWFSManagerPlugin = function () {
	var wfsCatalog = this.facadeMap_.getPanels('Catalog')[0].getControls()[0];
	if(wfsCatalog){
		for(let i=0;i<wfsCatalog.controls_.length;i++){
			if(wfsCatalog.controls_[i].name==="WFSManagerControl"){
				this.WFSManagerCtl = wfsCatalog.controls_[i];		
			}
		}
		return this.WFSManagerCtl!==null;
	}
	else{
		return false;
	}
};

/**
 * This function does a zoom to sandbox layer
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.zoomToSandBox = function (evt) {
	this.manageSelectedClassInDropdown(evt);
	this.editionLayer = this.getEditionLayer();
	if(this.editionLayer.getFeatures().length>0){
		this.editionLayer.zoomToFeatures(this.editionLayer.getFeatures());
	} else {
		M.dialog.info('No hay geometrías en la capa de trabajo', 'Zoom a la capa de trabajo');
	}
};

/**
 * This function does a zoom to features selected in sandbox layer
 *
 * @public
 * @function
 * @param {evt} event
 * @api stable
 */
M.control.EditionGeometryControl.prototype.zoomToSelection = function (evt) {
	this.manageSelectedClassInDropdown(evt);
	this.editionLayer = this.getEditionLayer();
	if(this.editionLayer.selectedFeatures_.length>0){
		this.editionLayer.zoomToFeatures(this.editionLayer.selectedFeatures_);
	} else {
		M.dialog.info('No hay geometrías seleccionadas', 'Zoom a la selección');
	}
};

/**
 * This function deactivates all controls
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.deactiveControls = function () {
	this.insertGeomControl.deactivate();
	this.insertTemporalGeomControl.deactivate();
	this.modifyGeomControl.deactivate();
	this.translateGeomControl.deactivate();
	this.selectGeomControl.deactivate();
	this.snappingControl.deactivate();
	this.editionLayer = this.getEditionLayer();
	this.editionLayer.highlightControl.deactivate();
	var mapImpl = this.facadeMap_.getMapImpl();
	mapImpl.un('click', this.getWfsFeatures, this);
};

/**
 * This function unselects all controls
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.unselectControls = function () {
	this.insertPolygonButton.className = this.insertPolygonButton.className.replace(" selected", "");
	this.addGeomClickButton.className = this.addGeomClickButton.className.replace(" selected", "");
	this.addGeomPolygonButton.className = this.addGeomPolygonButton.className.replace(" selected", "");
	this.addGeomLineButton.className = this.addGeomLineButton.className.replace(" selected", "");
	this.addGeomCircleButton.className = this.addGeomCircleButton.className.replace(" selected", "");
	this.selectPolygonButton.className = this.selectPolygonButton.className.replace(" selected", "");
	this.selectPolygonByLineButton.className =  this.selectPolygonByLineButton.className.replace(" selected", "");
	this.selectPolygonByAreaButton.className = this.selectPolygonByAreaButton.className.replace(" selected", "");
	this.modifyPolygonButton.className = this.modifyPolygonButton.className.replace(" selected", "");
	this.dividePolygonButton.className = this.dividePolygonButton.className.replace(" selected", ""); 
	this.intersectPolygonButton.className = this.intersectPolygonButton.className.replace(" selected", "");
	this.emptyPolygonButton.className = this.emptyPolygonButton.className.replace(" selected", "");
	this.removeFromSandBoxButton.className = this.removeFromSandBoxButton.className.replace(" selected", "");	

	this.editionLayer = this.getEditionLayer();
	var featuresSelected = this.editionLayer.selectedFeatures_;
	for (let i = 0; i < featuresSelected.length; i++) {
		featuresSelected[i].getImpl().getOLFeature().setStyle(this.editionLayer.getSelectedStyle());
	}

	document.body.style.cursor = 'default';
};

/**
 * This function execute both deactivate all controls and unselect all controls functions
 *
 * @public
 * @function
 * @api stable
 */
M.control.EditionGeometryControl.prototype.clear = function () {
	this.unselectControls();
	this.deactiveControls();
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
M.control.EditionGeometryControl.prototype.equals = function(obj) {
	var equals = false;
	if (obj instanceof M.control.EditionGeometryControl) {
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
M.control.EditionGeometryControl.prototype.destroy = function() {
	this.getImpl().destroy();
};
