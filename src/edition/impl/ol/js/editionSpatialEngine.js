goog.provide('P.impl.editionSpatialEngine');

/*jshint undef:false */

(function () {

    /**
	 * M.impl.editionSpatialEngine object
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine = {};
    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.getImplFeature = function (MFeature) {
    	return MFeature.getImpl().getOLFeature(); 
    };
    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.getImplGeometry = function (jstsGeom) {
        var writter = new jsts.io.GeoJSONWriter();
        var geojson = writter.write(jstsGeom);

        var olFormat = new ol.format.GeoJSON();
        var olGeom = olFormat.readGeometry(geojson);

        return olGeom;
    };
    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.bufferGeometry = function (bufferGeometry) {
        return M.impl.editionSpatialEngine.getImplGeometry(bufferGeometry);
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.unionFeature = function (feature1, feature2) {
        var feature = feature1.clone();
        feature.setGeometry(M.impl.editionSpatialEngine.unionGeometry(feature1.getGeometry(), feature2.getGeometry()));
        return feature;
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.unionGeometry = function (geom1, geom2) {
        var jstsGeom1 = M.impl.editionSpatialEngine.getJSTSGeometry(geom1);
        var jstsGeom2 = M.impl.editionSpatialEngine.getJSTSGeometry(geom2);
        var unionGeometry = jstsGeom1.union(jstsGeom2);

        return M.impl.editionSpatialEngine.getImplGeometry(unionGeometry);
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.impl.editionSpatialEngine.getJSTSGeometry = function (geometry) {
        var olFormat = new ol.format.GeoJSON();
        var geojsonRepresentation = olFormat.writeGeometry(geometry);

        var reader = new jsts.io.GeoJSONReader();
        var jstsGeom = reader.read(geojsonRepresentation);
        return jstsGeom;
    };
    
    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.impl.editionSpatialEngine.dividePolygon = function (splitFeature, selectedFeature) {
        var olFormat = new ol.format.GeoJSON();
		var polygon2Divide;
    	if (M.editionSpatialEngine.getJSTSGeometry(selectedFeature.getGeometry())._geometries !== undefined) {
    		polygon2Divide = M.editionSpatialEngine.getJSTSGeometry(selectedFeature.getGeometry())._geometries[0];
    	} else {
    		polygon2Divide = M.editionSpatialEngine.getJSTSGeometry(selectedFeature.getGeometry());
    	}
		var line4Divide = M.editionSpatialEngine.getJSTSGeometry(splitFeature.getGeometry());

		try{
			var union = polygon2Divide.getExteriorRing().union(line4Divide);

			var polygonizer = new jsts.operation.polygonize.Polygonizer();
			polygonizer.add(union);
			var polygons = polygonizer.getPolygons();
			var polygons2Create = polygons;
			var newHole = null;

			if(polygons.size()<2){
				try{
					
			        var geojsonRepresentation = olFormat.writeGeometryObject(selectedFeature.getGeometry());
					var polygon2Divide2Line = turf.polygonToLine(geojsonRepresentation);
					polygon2Divide2Line.geometry.coordinates.push(splitFeature.getGeometry().getCoordinates());
					var poligonos = turf.lineToPolygon(polygon2Divide2Line);
					newHole = turf.polygon([poligonos.geometry.coordinates[poligonos.geometry.coordinates.length-1]]);

					return M.impl.editionSpatialEngine.dividePolygonWithHoles(newHole, selectedFeature);
				}
				catch (e){
					return null;
				}
			}

			var exteriorRingTargetPoly = polygon2Divide.getExteriorRing();
			var polygonizerTarget = new jsts.operation.polygonize.Polygonizer();
			polygonizerTarget.add(exteriorRingTargetPoly);


			if(polygonizer.getGeometry().getArea() - polygonizerTarget.getGeometry().getArea() > 0.1){
				return -1;
			}
			else {
				if(polygon2Divide.getNumInteriorRing()>0){
					if(!line4Divide.isSimple()){
						newHole = M.editionSpatialEngine.getNewHolePolygon(polygon2Divide, line4Divide);
						return M.impl.editionSpatialEngine.dividePolygonWithHolesJSTS(newHole, polygon2Divide, selectedFeature);
					}
					else{
						var result = M.editionSpatialEngine.getPolygonsOnHoles (polygonizer, polygon2Divide);
						return M.impl.editionSpatialEngine.dividePolygonWithHolesJSTS(null, result, selectedFeature);
					}
				}
				else if(polygons.size()<2){
					return null;
				}

				return M.impl.editionSpatialEngine.createDividedPolygons(polygons2Create, selectedFeature);
			}
		}
		catch (e){
			//User has tried to divide a multipolygon
			return undefined;
		}
	};
    
	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.impl.editionSpatialEngine.dividePolygonWithHolesJSTS = function (newHole, polygon2Divide, selectedFeature) {
		var polygonGeoJson, newFeature;
		var writer = new jsts.io.GeoJSONWriter();
		var geojsonFormat = new ol.format.GeoJSON();
		var resultFeatures = [];
		var cont = 1;

		var newPolygons = [];

		if(newHole!==null){
			var targetPolygonNoHoles = selectedFeature.getGeoJSON();

			var olNewTargetFeatureJSTS = polygon2Divide.difference(newHole);
			var newHoleFeatureJSTS = newHole.intersection(polygon2Divide);

			var olNewTargetFeatureJSTSgj = writer.write(olNewTargetFeatureJSTS);
			var newHoleFeatureJSTSgj = writer.write(newHoleFeatureJSTS);

			if (olNewTargetFeatureJSTSgj !== null && newHoleFeatureJSTSgj !== null){
				targetPolygonNoHoles.geometry = olNewTargetFeatureJSTSgj;
				newHole.geometry = newHoleFeatureJSTSgj;
				newPolygons.push(targetPolygonNoHoles);
				newPolygons.push(newHole);
			}
			else{
				return -1;
			}

			for(let i=0;i<newPolygons.length;i++){
				newFeature = new M.Feature(selectedFeature.getId()+"_"+Math.random(),newPolygons[i]);
				resultFeatures.push(newFeature);
				cont++;
			}
		}
		else{
			newPolygons = polygon2Divide;

			for(let i=0;i<newPolygons.length;i++){
				polygonGeoJson = writer.write(newPolygons[i]);
				var olFeatures = geojsonFormat.readFeatures(polygonGeoJson);
				var olNewFeature = geojsonFormat.writeFeatureObject(olFeatures[0]);
				newFeature = new M.Feature(selectedFeature.getId()+"_"+Math.random(),olNewFeature);
				resultFeatures.push(newFeature);
				cont++;
			}
		}

		return resultFeatures;
	};
	
	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.impl.editionSpatialEngine.dividePolygonWithHoles = function (newHole, selectedFeature) {
		var resultFeatures = [];
		var cont = 1;
		var newPolygons = [];
		var olFormat = new ol.format.GeoJSON();
		var geomSelected = selectedFeature.getGeometry();
		if(selectedFeature instanceof M.Feature){
			geomSelected = selectedFeature.getImpl().getOLFeature().getGeometry();
		}
		var geojsonRepresentation = olFormat.writeGeometryObject(geomSelected);
		var targetPolygonNoHoles = geojsonRepresentation;
		var writer = new jsts.io.GeoJSONWriter();
		var parser = new jsts.io.OL3Parser();
		var reader = new jsts.io.GeoJSONReader();

		try{
			if(!turf.booleanContains(targetPolygonNoHoles, newHole) && !turf.booleanOverlap(targetPolygonNoHoles, newHole)){
				return -1;
			}
			var targetPolygonNoHolesJSTS =  parser.read(geomSelected);
			var newHoleJSTS = reader.read(newHole.geometry);
			var olNewTargetFeatureJSTS = targetPolygonNoHolesJSTS.difference(newHoleJSTS);
			var newHoleFeatureJSTS = newHoleJSTS.intersection(targetPolygonNoHolesJSTS);

			var olNewTargetFeatureJSTSgj = writer.write(olNewTargetFeatureJSTS);
			var newHoleFeatureJSTSgj = writer.write(newHoleFeatureJSTS);

			if (olNewTargetFeatureJSTSgj !== null && newHoleFeatureJSTSgj !== null){
				targetPolygonNoHoles.geometry = olNewTargetFeatureJSTSgj;
				newHole.geometry = newHoleFeatureJSTSgj;
				newPolygons.push(targetPolygonNoHoles);
				newPolygons.push(newHole);
			}
			else{
				return -1;
			}

		}
		catch (e){
			return -2;
		}

		for(let i=0;i<newPolygons.length;i++){
			var newFeature = new M.Feature(selectedFeature.getId()+"_"+Math.random(),newPolygons[i]);
			resultFeatures.push(newFeature);
			cont++;
		}

		return resultFeatures;
	};
	
	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.impl.editionSpatialEngine.createDividedPolygons = function (polygons, selectedFeature) {
		var writer = new jsts.io.GeoJSONWriter();
		var geojsonFormat = new ol.format.GeoJSON();
		var resultFeatures = [];
		var cont = 1;

		for (let i = polygons.iterator(); i.hasNext();) {
			const polygon = i.next();
			var polygonGeoJson = writer.write(polygon);
			var olFeatures = geojsonFormat.readFeatures(polygonGeoJson);
			var olNewFeature = geojsonFormat.writeFeatureObject(olFeatures[0]);
			var newFeature = new M.Feature(selectedFeature.getId()+"_"+Math.random(),olNewFeature);
			resultFeatures.push(newFeature);
			cont++;
		}

		return resultFeatures;
	};
    
})();