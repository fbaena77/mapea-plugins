goog.provide('P.editionSpatialEngine');

/*jshint undef:false */

(function () {

    /**
	 * M.editionSpatialEngine object
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine = {};

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.bufferFeature = function (feature, distance) {
        feature.setGeometry(M.editionSpatialEngine.bufferGeometry(feature.getGeometry(), distance));
        return feature;
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.bufferGeometry = function (geometry, distance) {
        var jstsGeom = M.editionSpatialEngine.getJSTSGeometry(geometry);
        var bufferGeometry = jstsGeom.buffer(distance);

        return M.impl.editionSpatialEngine.bufferGeometry(bufferGeometry);
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.unionFeature = function (feature1, feature2) {
        return M.impl.editionSpatialEngine.unionFeature(feature1, feature2);
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.splitFeature = function (feature, geometryLine) {
    	var jsts_geom;
    	if (M.editionSpatialEngine.getJSTSGeometry(feature.getGeometry())._geometries !== undefined) {
    		jsts_geom = M.editionSpatialEngine.getJSTSGeometry(feature.getGeometry())._geometries[0];
    	} else {
    		jsts_geom = M.editionSpatialEngine.getJSTSGeometry(feature.getGeometry());
    	}
        var jsts_geom_line = M.editionSpatialEngine.getJSTSGeometry(geometryLine);
        var union = jsts_geom.getExteriorRing().union(jsts_geom_line);

        var polygonizer = M.editionSpatialEngine.getPolygonizer();
        polygonizer.add(union);
        var polygons = polygonizer.getPolygons();
        var resultFeatures = [];
        for (var i = polygons.iterator(); i.hasNext();) {

            var polygon = i.next();
            var newFeature = feature.clone();
            var totalHoles = jsts_geom.getNumInteriorRing();

            for (var n = 0; n < totalHoles; n++) {
                var hole = jsts_geom.getInteriorRingN(n);
                var holePolygonizer = M.editionSpatialEngine.getPolygonizer();
                holePolygonizer.add(hole);
                var holePolygons = holePolygonizer.getPolygons();

                polygon = polygon.difference(holePolygons.iterator().next());
            }
            var impl_geom = M.impl.editionSpatialEngine.getImplGeometry(polygon);
            newFeature.setGeometry(impl_geom);
            resultFeatures.push(newFeature);
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
    M.editionSpatialEngine.intersects = function (features, geometryIntersects) {
        var jsts_geom_intersects = M.editionSpatialEngine.getJSTSGeometry(geometryIntersects);
        var targetFeatures = [];

        features.forEach(function (feature) {
        	var implFeature = M.impl.editionSpatialEngine.getImplFeature(feature);

            var jsts_geom = M.editionSpatialEngine.getJSTSGeometry(implFeature.getGeometry());

            if (jsts_geom.intersects(jsts_geom_intersects)) {
                targetFeatures.push(implFeature);
            }

        });
        return targetFeatures;
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.intersection = function (feature1, feature2) {
        var jsts_geom1 = M.editionSpatialEngine.getJSTSGeometry(feature1.getGeometry());
        var jsts_geom2 = M.editionSpatialEngine.getJSTSGeometry(feature2.getGeometry());
        var resultGeom = jsts_geom1.intersection(jsts_geom2);

        var impl_geom  = M.impl.editionSpatialEngine.getImplGeometry(resultGeom);
        return impl_geom;  
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.difference = function (feature, feature2) {
        var jsts_geom_difference = M.editionSpatialEngine.getJSTSGeometry(feature2.getGeometry());
        var jsts_geom = M.editionSpatialEngine.getJSTSGeometry(feature.getGeometry());
        var resultGeom = jsts_geom.difference(jsts_geom_difference);

        var impl_geom = M.impl.editionSpatialEngine.getImplGeometry(resultGeom);
        return impl_geom;
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.getJSTSGeometry = function (geometry) {
        return M.impl.editionSpatialEngine.getJSTSGeometry(geometry);
    };

    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
    M.editionSpatialEngine.getPolygonizer = function () {
        return new jsts.operation.polygonize.Polygonizer();
    };
    
    /**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.dividePolygon = function (splitFeature, selectedFeature) {
		return M.impl.editionSpatialEngine.dividePolygon (splitFeature, selectedFeature);
	};

	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.getNewHolePolygon = function (polygon2Divide, line4Divide) {
		var polygonizerHole = new jsts.operation.polygonize.Polygonizer();
		var union = polygon2Divide.getExteriorRing().union(line4Divide);
		polygonizerHole.add(union);
		var polygons = polygonizerHole.getPolygons();
		for (let i = polygons.iterator(); i.hasNext();) {
			const polygon = i.next();
			if(polygon._holes.length>0){
				polygonizerHole.add(polygon._holes[0]);
				return polygonizerHole.getPolygons().get(0);
			}
		}
		return false;
	};

	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.getPolygonsOnHoles = function (polygonizer, polygon2Divide) {
		var polygons = polygonizer.getPolygons();
		var polygonizerHoles = new jsts.operation.polygonize.Polygonizer();
		var poly1 = polygons.get(0);
		var poly2 = null;

		for(let i = 0; i< polygon2Divide._holes.length;i++){
			polygonizerHoles.add(polygon2Divide._holes[i]);
		}

		var holes = polygonizerHoles.getPolygons();

		if(polygons.size()===2){
			poly2 = polygons.get(1);
		}

		for (let j = holes.iterator(); j.hasNext();) {
			const hole = j.next();
			poly1 = poly1.difference(hole);
			if(poly2!==null)
				poly2 = poly2.difference(hole);
		}

		var result = [];
		result.push(poly1);
		if(poly2!==null)
			result.push(poly2);

		return result;
	};

	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.dividePolygonWithHolesJSTS = function (newHole, polygon2Divide, selectedFeature) {
		return M.impl.editionSpatialEngine.dividePolygonWithHolesJSTS(newHole, polygon2Divide, selectedFeature);
	};

	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.dividePolygonWithHoles = function (newHole, selectedFeature) {
		return M.impl.editionSpatialEngine.dividePolygonWithHoles(newHole, selectedFeature);
	};

	/**
	 * Zooms the view to the layer extent
	 *
	 * @public
	 * @function
	 * @api stable
	 */
	M.editionSpatialEngine.createDividedPolygons = function (polygons, selectedFeature) {
		return M.impl.editionSpatialEngine.createDividedPolygons(polygons, selectedFeature);
	};
})();